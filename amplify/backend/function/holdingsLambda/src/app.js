require('dotenv').config();
const express = require('express');
const mysql = require('serverless-mysql');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const axios = require('axios');
/*
  Middleware
*/
const app = express();
if (!process.env.DEV) {
  app.use(awsServerlessExpressMiddleware.eventContext())
}
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});
app.use(function (req, res, next) {
  if (!process.env.DEV) {
    const IDP_REGEX = /.*\/.*,(.*)\/(.*):CognitoSignIn:(.*)/;
    const authProvider =
      req.apiGateway.event.requestContext.identity
        .cognitoAuthenticationProvider;
    const [, , , userId] = authProvider.match(IDP_REGEX);
    req.userId = userId;
    next();
  } else {
    req.userId = 'f3ea1aa2-13e2-4f08-882c-acfab0dfffe4';
    next();
  }
});

/*
  Utils
*/
async function query(sql, values = []) {
  let connection;

  try {
    connection = await mysql({
      config: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_SCHEMA,
      }
    });
    return connection.query(sql, values);
  } catch (error) {
    console.log(error);
    // TODO: log error
    return 'Database Error';
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

/*
  CRUD
*/
app.get('/holdings', async function (req, res) {
  const sort = req.query.sort.split('_')[0] || 'symbol';
  const direction = req.query.sort.split('_')[1] || 'desc';

  let result;
  if (req.query.search) {
    result = await query(
      `SELECT *, (SELECT COUNT(*) FROM holdings WHERE user_id = ? AND symbol LIKE '%${req.query.search}%') AS count FROM holdings WHERE user_id = ? AND symbol LIKE '%${req.query.search}%' ORDER BY ${sort} ${direction} LIMIT ?,?`,
      [req.userId, req.userId, Number(req.query.offset), Number(req.query.limit)]
    );
  } else {
    result = await query(
      `SELECT *, (SELECT COUNT(*) FROM holdings WHERE user_id = ?) AS count FROM holdings WHERE user_id = ? ORDER BY ${sort} ${direction} LIMIT ?,?`,
      [req.userId, req.userId, Number(req.query.offset), Number(req.query.limit)]
    );
  }

  res.json({ success: true, count: result[0] && result[0].count || 0, result });
});

app.post('/holdings', async function (req, res) {
  const { symbol, quantity, price, comments } = req.body;

  const result = await query(
    'INSERT INTO holdings (user_id, symbol, price, quantity, comments) VALUES(?,?,?,?,?)',
    [req.userId, String(symbol).toUpperCase(), price, quantity, comments]
  );

  res.json({ success: true, result });
});

app.put('/holdings', async function (req, res) {
  const { symbol, quantity, price, comments, id } = req.body;

  const result = await query(
    'UPDATE `holdings` SET `symbol` = ?, `price` = ?, `quantity` = ?, `comments` = ? WHERE `id` = ? AND `user_id` = ?',
    [String(symbol).toUpperCase(), price, quantity, comments, id, req.userId]
  );

  res.json({ success: true, result });
});

app.delete('/holdings', async function (req, res) {
  const result = await query('DELETE FROM holdings WHERE id = ? AND user_id = ?', [req.body.id, req.userId])

  res.json({ success: true, result });
});

app.get('/holdings/dividends', async function (req, res) {
  const list = [];
  const holdings = await query(`SELECT symbol, quantity FROM holdings WHERE user_id = ?`, [req.userId]);

  for (const { symbol, quantity } of holdings) {
    try {
      const { data } = await axios.get(`https://cloud.iexapis.com/stable/stock/${symbol}/dividends/next?token=${process.env.IEX_TOKEN}`);

      if (data.length) {
        list.push({
          ...data[0],
          quantity,
          allDay: true,
          title: symbol,
          start: data[0].paymentDate,
          extendedProps: {
            amount: Number(quantity) * Number(data[0].amount)
          },
        });
      }
    } catch (error) {
      if (error.response.data === 'Unknown symbol') {
        list.push({ title: 'warning', description: `Symbol ${symbol} not found.` });
      } else {
        res.json({ success: false });
      }
    }
  }

  res.json({ success: true, data: list });
});

app.listen(3001, function () {
  console.log("App started");
});

module.exports = app;

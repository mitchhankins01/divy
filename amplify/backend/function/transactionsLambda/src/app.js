require('dotenv').config();
const express = require('express');
const mysql = require('serverless-mysql');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

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
app.get('/transactions', async function (req, res) {
  const result = await query('SELECT * FROM transactions WHERE user_id = ?', [req.userId]);

  res.json({ success: true, result });
});

app.post('/transactions', async function (req, res) {
  const { symbol, side, quantity, price, date } = req.body;

  const result = await query(
    'INSERT INTO transactions (user_id, symbol, price, quantity, side, date) VALUES(?,?,?,?,?,?)',
    [req.userId, symbol, price, quantity, side, date]
  );

  res.json({ success: true, result });
});

app.put('/transactions', async function (req, res) {
  const { symbol, side, quantity, price, date, id } = req.body;

  const result = await query(
    'UPDATE `transactions` SET `symbol` = ?, `price` = ?, `quantity` = ?, `side` = ?, `date` = ? WHERE `id` = ? AND `user_id` = ?',
    [symbol, price, quantity, side, date, id, req.userId]
  );

  res.json({ success: true, result });
});

app.delete('/transactions', async function (req, res) {
  const result = await query('DELETE FROM transactions WHERE id = ? AND user_id = ?', [req.body.id, req.userId])

  res.json({ success: true, result });
});

app.listen(3000, function () {
  console.log("App started");
});

module.exports = app;

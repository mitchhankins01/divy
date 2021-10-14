/* Amplify Params - DO NOT EDIT
  API_HOLDINGS_GRAPHQLAPIIDOUTPUT
  API_HOLDINGS_HOLDINGTABLE_ARN
  API_HOLDINGS_HOLDINGTABLE_NAME
  API_HOLDINGS_STRIPEEVENTTABLE_ARN
  API_HOLDINGS_STRIPEEVENTTABLE_NAME
  AUTH_DIVY302D4878302D4878_USERPOOLID
  ENV
  REGION
Amplify Params - DO NOT EDIT */
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const getUnixTime = require('date-fns/getUnixTime');
const addToDate = require('date-fns/add');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

const app = express();
app.use(
  bodyParser.json({
    verify: function (req, res, buf) {
      req.rawBody = buf.toString()
    },
  })
);
app.use(awsServerlessExpressMiddleware.eventContext());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

const saveEvent = async (id, type, message) => {
  try {
    await docClient.put({
      TableName: process.env.API_HOLDINGS_STRIPEEVENTTABLE_NAME,
      Item: {
        id: id,
        type: type,
        message: message,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    }).promise();
  } catch (error) {
    console.log(error);
  }
}

app.post('/webhook', async function (req, res) {
  const oneDayMs = 86400000;
  const sig = req.headers['stripe-signature'];
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: 'latest' });

  try {
    const event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);

    switch (event.type) {
      /* 
        checkout.session.completed
      */
      case 'checkout.session.completed': {
        const retrievedSession = await stripe.checkout.sessions.retrieve(event.data.object.id, { expand: ["line_items"] });

        await cognitoidentityserviceprovider.adminUpdateUserAttributes({
          UserAttributes: [
            {
              Name: 'custom:subscription',
              Value: retrievedSession.line_items.data[0].price.id
            },
            {
              Name: 'preferred_username',
              Value: retrievedSession.customer
            },
            {
              Name: 'custom:stripe_customer_id',
              Value: retrievedSession.customer
            },
            {
              Name: 'custom:expires',
              Value: String(getUnixTime(addToDate(new Date(), { months: 1, days: 2 })))
            }
          ],
          UserPoolId: process.env.AUTH_DIVY302D4878302D4878_USERPOOLID,
          Username: req.body.data.object.client_reference_id
        }).promise();

        await saveEvent(event.id, 'checkout.session.completed', JSON.stringify({ event, retrievedSession }));
        break;
      }


      /* 
        customer.subscription.updated
      */
      case 'customer.subscription.updated': {
        const { Users } = await cognitoidentityserviceprovider.listUsers({
          UserPoolId: process.env.AUTH_DIVY302D4878302D4878_USERPOOLID,
          Filter: `preferred_username = \"${event.data.object.customer}\"`
        }).promise();

        if (Users.length) {
          await cognitoidentityserviceprovider.adminUpdateUserAttributes({
            UserAttributes: [
              {
                Name: 'custom:subscription',
                Value: event.data.object.items.data[0].price.id
              },
              {
                Name: 'custom:expires',
                Value: String(Number(event.data.object.current_period_end) * 1000 + (2 * oneDayMs))
              }
            ],
            UserPoolId: process.env.AUTH_DIVY302D4878302D4878_USERPOOLID,
            Username: Users[0].Username
          }).promise();
          await saveEvent(event.id, 'customer.subscription.updated', JSON.stringify({ note: 'user found', event }));
        } else {
          await saveEvent(event.id, 'customer.subscription.updated', JSON.stringify({ note: 'no user found', event }));
        }
        break;
      }


      /* 
        invoice.paid
      */
      case 'invoice.paid': {
        const { Users } = await cognitoidentityserviceprovider.listUsers({
          UserPoolId: process.env.AUTH_DIVY302D4878302D4878_USERPOOLID,
          Filter: `preferred_username = \"${event.data.object.customer}\"`
        }).promise();

        if (Users.length) {
          await cognitoidentityserviceprovider.adminUpdateUserAttributes({
            UserAttributes: [
              {
                Name: 'custom:expires',
                Value: String(Number(event.data.object.period_end) * 1000 + (2 * oneDayMs))
              }
            ],
            UserPoolId: process.env.AUTH_DIVY302D4878302D4878_USERPOOLID,
            Username: Users[0].Username
          }).promise();
          await saveEvent(event.id, 'invoice.paid', JSON.stringify({ note: 'user found', event }));
        } else {
          await saveEvent(event.id, 'invoice.paid', JSON.stringify({ note: 'no user found', event }));
        }
        break;
      }


      /* 
        invoice.payment_failed
        customer.subscription.deleted
      */
      case 'invoice.payment_failed':
      case 'customer.subscription.deleted': {
        // do I get all the info I need?
        await saveEvent(event.id, event.type, JSON.stringify(event));
        break;
      }


      default:
        return res.status(400).end();
    }
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  res.json({ received: true });
})

app.listen(3000, function () {
  console.log('App started');
});

module.exports = app;

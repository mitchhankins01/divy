const AWS = require('aws-sdk');
const ses = new AWS.SES();
const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
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

const sendEmail = async (subject, message) => {
  try {
    await ses
      .sendEmail({
        Destination: {
          ToAddresses: ['mitchhankins@icloud.com'],
        },
        Source: 'mitchhankins@icloud.com',
        Message: {
          Subject: { Data: `Divy ${subject}` },
          Body: {
            Text: { Data: message },
          },
        },
      })
      .promise();
  } catch (error) {
    console.log(error);
  }
}

app.post('/webhook', async function (req, res) {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: 'latest' });
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);

    switch (event.type) {
      case 'checkout.session.completed':
        const retrievedSession = await stripe.checkout.sessions.retrieve(event.data.object.id, { expand: ["line_items"] });

        await cognitoidentityserviceprovider.adminUpdateUserAttributes({
          UserAttributes: [{
            Name: 'custom:subscription',
            Value: retrievedSession.line_items.data[0].price.id
          },
          {
            Name: 'custom:stripe_customer_id',
            Value: retrievedSession.customer
          }],
          UserPoolId: process.env.USER_POOL_ID,
          Username: req.body.data.object.client_reference_id
        }, function (err, data) {
          console.log('error', err);
          if (err) throw Error(err);
        }).promise();

        sendEmail('checkout.session.completed', JSON.stringify({ event, retrievedSession }, null, 2));
        break;
      case 'invoice.paid':
        break;
      case 'invoice.payment_failed':
        sendEmail('invoice.payment_failed', JSON.stringify({ event }, null, 2));
        break;
      default:
        return res.status(400).end();
    }
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  res.json({ received: true });
})

app.listen(3000, function () {
  console.log('App started');
});

module.exports = app;

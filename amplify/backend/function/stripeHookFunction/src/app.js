const AWS = require('aws-sdk');
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

app.post('/webhook', async function (req, res) {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: 'latest' });
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);

    switch (event.type) {
      case 'checkout.session.completed':
        const { line_items } = await stripe.checkout.sessions.retrieve(event.data.object.id, { expand: ["line_items"] });
        await cognitoidentityserviceprovider.adminUpdateUserAttributes({
          UserAttributes: [{
            Name: 'custom:subscription',
            Value: line_items.data[0].price.id
          }],
          UserPoolId: process.env.USER_POOL_ID,
          Username: req.body.data.object.client_reference_id
        }, function (err, data) {
          console.log('error', err);
          if (err) throw Error(err);
        }).promise();

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

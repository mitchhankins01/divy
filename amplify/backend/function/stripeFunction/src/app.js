const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

app.post('/checkout', async function (req, res) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          // The priceId of the product being purchased, retrievable from the Stripe dashboard
          price: req.body.priceId, 
          quantity: req.body.quantity,
        },
      ],
      subscription_data: {
        trial_period_days: 14
      },
      mode: 'subscription',
      client_reference_id: req.body.client_reference_id,
      success_url:
        'http://localhost:3000/pricing?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cancel',
    });
    res.json(session);
  } catch (err) {
    res.json(err);
  }
});

app.post('/create-customer-portal-sessio', async function (req, res) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: req.body.id,
      return_url: 'http://localhost:3000/app/account?updated=true',
    });
    res.json(session);
  } catch (err) {
    res.json(err);
  }
});

app.listen(3000, function () {
  console.log('App started');
});

module.exports = app;

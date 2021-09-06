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
          price: req.body.priceId, // The priceId of the product being purchased, retrievable from the Stripe dashboard
          quantity: req.body.quantity,
        },
      ],
      mode: 'subscription',
      client_reference_id: req.body.client_reference_id,
      success_url:
        'https://example.com/success?session_id={CHECKOUT_SESSION_ID}', // The URL the customer will be directed to after the payment or subscription creation is successful.
      cancel_url: 'https://example.com/cancel', // The URL the customer will be directed to if they decide to cancel payment and return to your website.
    })
    res.json(session)
  } catch (err) {
    res.json(err)
  }
})

app.listen(3000, function () {
  console.log("App started");
});

module.exports = app;

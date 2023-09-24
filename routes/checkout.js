const express = require("express");
const router = new express.Router();
const stripe = require("stripe")(`${process.env.Stripe_Secret_Key}`);
const Order = require("../models/order");


router.post(
  "/:ownerId/create-session/:userId", 
  async (req, res, next) => {
    const line_items = req.body.cartItems.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.productName,
            images: [item.image],
            description: item.productDescription,
          },
          unit_amount: Math.round(parseFloat(item.price) * 100),
        },
        quantity: item.quantity,
      };
    });

    const cartMetadata = req.body.cartItems.map((item) => {
      return {
        productId: item.productId,
        storeId: item.storeId,
        quantity: item.quantity,
        price: item.price,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          userId: req.params.userId,
          cart: JSON.stringify(cartMetadata),
        },
      },
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/checkout-cancel`,
    });

    console.log(session);
    res.send({ url: session.url });
  }
);

// ****************************Stripe Webhook**************************************

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = `${process.env.endpointSecret}`;

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("Webhook verified");
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    async function saveOrder(userId, orderTotal, cart) {
      try {
        const order = await Order.create(userId, orderTotal, cart);
        console.log(`Order saved: ${order.id}`);
      } catch (err) {
        console.log(err);
      }
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        console.log("payment intent", paymentIntentSucceeded);
        // You can access the userId from the metadata parameter
        const userId = paymentIntentSucceeded.metadata.userId;
        saveOrder(
          userId,
          paymentIntentSucceeded.amount,
          paymentIntentSucceeded.metadata.cart
        );
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send().end();
  }
);

module.exports = router;

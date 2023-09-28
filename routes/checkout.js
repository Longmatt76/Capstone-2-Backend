const express = require("express");
const router = new express.Router();
const stripe = require("stripe")(`${process.env.Stripe_Secret_Key}`);
const Order = require("../models/order");
const User = require("../models/user");
const knex = require("../db");

router.post("/:ownerId/create-session/:userId", async (req, res, next) => {
  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.productName,
          images: [item.image],
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
    metadata: {
      userId: req.params.userId,
      cart: JSON.stringify(cartMetadata),
    },
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/${req.body.cartItems[0].storeId}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/${req.body.cartItems[0].storeId}/checkout-cancel`,
  });

  console.log(session);
  res.send({ url: session.url });
});

// ****************************Stripe Webhook**************************************

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
      const transaction = await knex.transaction();
      try {
        const order = await Order.create(userId, orderTotal, cart);
        const parsedCart = JSON.parse(cart);
    
        for (let cartItem of parsedCart) {
          const id = cartItem.productId;
          const quantity = parseInt(cartItem.quantity);
    
          await knex.transaction(async (trx) => {
            const product = await trx("product")
              .where("id", id)
              .first();
    
            if (product) {
              const newQtyInStock = Math.max(product.qty_in_stock - quantity, 0);
              await trx("product")
                .where("id", id)
                .update({
                  qty_in_stock: newQtyInStock,
                });
            }
          });
        }
        await transaction.commit();
        console.log(`Order saved: ${order.id}`);
      } catch (err) {
        await transaction.rollback();
        console.error(err);
      }
    }
    

    async function createUserAndSaveOrder(userData, orderTotal, cart) {
      const transaction = await knex.transaction();

      try {
        const userCheck = await knex("user_info")
          .select("id")
          .where("email", userData.email)
          .first();

        if (userCheck) {
          const parsedCart = JSON.parse(cart);

          for (let cartItem of parsedCart) {
            const id = cartItem.productId;
            const quantity = parseInt(cartItem.quantity);

            await knex.transaction(async (trx) => {
            const product = await trx("product")
              .where("id", id)
              .first();
    
            if (product) {
              const newQtyInStock = Math.max(product.qty_in_stock - quantity, 0);
              await trx("product")
                .where("id", id)
                .update({
                  qty_in_stock: newQtyInStock,
                });
            }
          });
          }

          await saveOrder(userCheck.id, orderTotal, cart);

          await transaction.commit();
        } else {
          const user = await User.register(userData);
          console.log("user created", user.userId);

          const parsedCart = JSON.parse(cart);

          for (let cartItem of parsedCart) {
            const id = cartItem.productId;
            const quantity = parseInt(cartItem.quantity);

            await knex.transaction(async (trx) => {
              const product = await trx("product")
                .where("id", id)
                .first();
      
              if (product) {
                const newQtyInStock = Math.max(product.qty_in_stock - quantity, 0);
                await trx("product")
                  .where("id", id)
                  .update({
                    qty_in_stock: newQtyInStock,
                  });
              }
            });
          }

          await saveOrder(user.userId, orderTotal, cart);

          await transaction.commit();
        }
      } catch (err) {
        await transaction.rollback();
        console.log(err);
      }
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data.object;
        const userId = checkoutSessionCompleted.metadata.userId;
        console.log("checkout session complete", checkoutSessionCompleted);
        if (userId !== "undefined") {
          saveOrder(
            userId,
            checkoutSessionCompleted.amount_total,
            checkoutSessionCompleted.metadata.cart
          );
        } else {
          const userDataFromSession = {
            username: checkoutSessionCompleted.customer_details.email,
            password: "password",
            firstName: checkoutSessionCompleted.customer_details.name,
            lastName: "placeholder",
            email: checkoutSessionCompleted.customer_details.email,
            isAdmin: false,
          };

          createUserAndSaveOrder(
            userDataFromSession,
            checkoutSessionCompleted.amount_total,
            checkoutSessionCompleted.metadata.cart
          );
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send().end();
  }
);

module.exports = router;

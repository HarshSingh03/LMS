import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  createOrder,
  generateRazorpayOrder,
  getAllOrders,
  newPayment,
  sendStripePublishableKey,
} from "../controllers/order.controller";
const orderRouter = express.Router();

// orderRouter.post("/create-order", isAutheticated, createOrder);
orderRouter.post("/create-order", isAutheticated, generateRazorpayOrder);

orderRouter.get(
  "/get-orders",
  isAutheticated,
  authorizeRoles("admin"),
  getAllOrders
);

orderRouter.post("/verify-payment", isAutheticated, createOrder); // Your existing function

orderRouter.get("/payment/stripepublishablekey", sendStripePublishableKey);

orderRouter.post("/payment", isAutheticated, newPayment);

export default orderRouter;

// import express from "express";
// import { authorizeRoles, isAutheticated } from "../middleware/auth";
// import {
//   createOrder,
//   getAllOrders,
//   newPayment,
//   sendRazorpayKey
// } from "../controllers/order.controller";

// const orderRouter = express.Router();

// // Create Razorpay order (after successful Razorpay payment)
// orderRouter.post("/create-order", isAutheticated, createOrder);

// // Get all orders (Admin only)
// orderRouter.get(
//   "/get-orders",
//   isAutheticated,
//   authorizeRoles("admin"),
//   getAllOrders
// );

// // Create Razorpay payment order (amount, currency, etc.)
// orderRouter.get("/payment/sendRazorPayKey", sendRazorpayKey);
// orderRouter.post("/payment/razorpay", isAutheticated, newPayment);

// export default orderRouter;

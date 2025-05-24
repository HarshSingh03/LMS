// import { Request, Response, NextFunction } from "express";
// import { razorpayInstance } from "../utils/razorpay";
// import ErrorHandler from "../utils/ErrorHandler";
// import { CatchAsyncError } from "../middleware/catchAsyncErrors";
// import crypto from "crypto";

// export const createRazorpayOrder = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { amount } = req.body;

//     if (!amount) {
//       return next(new ErrorHandler("Amount is required", 400));
//     }

//     const options = {
//       amount: amount * 100, // Razorpay accepts amount in paisa
//       currency: "INR",
//       receipt: `receipt_order_${Date.now()}`,
//     };

//     try {
//       const order = await razorpayInstance.orders.create(options);
//       res.status(200).json({ success: true, order });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );



// export const verifyPayment = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return next(new ErrorHandler("Missing payment details", 400));
//     }

//     const body = razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY!)
//       .update(body.toString())
//       .digest("hex");

//     const isValid = expectedSignature === razorpay_signature;

//     if (!isValid) {
//       return next(new ErrorHandler("Payment verification failed", 400));
//     }

//     res.status(200).json({
//       success: true,
//       message: "Payment verified successfully",
//       paymentId: razorpay_payment_id,
//     });
//   }
// );
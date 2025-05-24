// import { NextFunction, Request, Response } from "express";
// import { CatchAsyncError } from "../middleware/catchAsyncErrors";
// import ErrorHandler from "../utils/ErrorHandler";
// import { IOrder } from "../models/order.Model";
// import userModel from "../models/user.model";
// import CourseModel, { ICourse } from "../models/course.model";
// import path from "path";
// import ejs from "ejs";
// import sendMail from "../utils/sendMail";
// import NotificationModel from "../models/notification.Model";
// import { getAllOrdersService, newOrder } from "../services/order.service";
// import { redis } from "../utils/redis";
// import Razorpay from "razorpay";
// require("dotenv").config();
// import crypto from 'crypto';
// // const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// // create order
// export const createOrder = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { courseId, payment_info } = req.body as IOrder;


//       if (payment_info) {
//         if ("id" in payment_info) {
//           const paymentIntentId = payment_info.id;
//           const paymentIntent = await stripe.paymentIntents.retrieve(
//             paymentIntentId
//           );

//           if (paymentIntent.status !== "succeeded") {
//             return next(new ErrorHandler("Payment not authorized!", 400));
//           }
//         }
//       }
      
      

//       const user = await userModel.findById(req.user?._id);

//       const courseExistInUser = user?.courses.some(
//         (course: any) => course._id.toString() === courseId
//       );

//       if (courseExistInUser) {
//         return next(
//           new ErrorHandler("You have already purchased this course", 400)
//         );
//       }

//       const course:ICourse | null = await CourseModel.findById(courseId);

//       if (!course) {
//         return next(new ErrorHandler("Course not found", 404));
//       }

//       const data: any = {
//         courseId: course._id,
//         userId: user?._id,
//         payment_info,
//       };

//       const mailData = {
//         order: {
//           _id: course._id.toString().slice(0, 6),
//           name: course.name,
//           price: course.price,
//           date: new Date().toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           }),
//         },
//       };

//       const html = await ejs.renderFile(
//         path.join(__dirname, "../mails/order-confirmation.ejs"),
//         { order: mailData }
//       );

//       try {
//         if (user) {
//           await sendMail({
//             email: user.email,
//             subject: "Order Confirmation",
//             template: "order-confirmation.ejs",
//             data: mailData,
//           });
//         }
//       } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//       }

//       user?.courses.push(course?._id);

//       await redis.set(req.user?._id, JSON.stringify(user));

//       await user?.save();

//       await NotificationModel.create({
//         user: user?._id,
//         title: "New Order",
//         message: `You have a new order from ${course?.name}`,
//       });

//       course.purchased = course.purchased + 1;

//       await course.save();

//       newOrder(data, res, next);
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );

// // get All orders --- only for admin
// export const getAllOrders = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       getAllOrdersService(res);
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );




import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { IOrder } from "../models/order.Model";
import userModel from "../models/user.model";
import CourseModel, { ICourse } from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.Model";
import { getAllOrdersService, newOrder } from "../services/order.service";
import { redis } from "../utils/redis";
import Razorpay from "razorpay";
import crypto from "crypto";
require("dotenv").config();




// create order
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      // ✅ Razorpay Payment Verification
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payment_info as any;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return next(new ErrorHandler("Payment verification failed!", 400));
      }

      // ✅ User and Course Validation
      const user = await userModel.findById(req.user?._id);
      const courseExistInUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      );

      if (courseExistInUser) {
        return next(
          new ErrorHandler("You have already purchased this course", 400)
        );
      }

      const course: ICourse | null = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const data: any = {
        courseId: course._id,
        userId: user?._id,
        payment_info,
      };

      // ✅ Email Notification
      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      if (user) {
        await sendMail({
          email: user.email,
          subject: "Order Confirmation",
          template: "order-confirmation.ejs",
          data: mailData,
        });
      }

      // ✅ Update User & Course
      user?.courses.push(course?._id);
      await redis.set(req.user?._id, JSON.stringify(user));
      await user?.save();

      await NotificationModel.create({
        user: user?._id,
        title: "New Order",
        message: `You have a new order from ${course?.name}`,
      });

      course.purchased = course.purchased + 1;
      await course.save();

      // ✅ Save Order
      newOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get All orders --- only for admin
export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


// Create Razorpay Order
export const generateRazorpayOrder = CatchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { amount } = req.body;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_SECRET_KEY!,
    });

    const options = {
      amount, // in paise (e.g. 50000 = ₹500)
      currency: "INR",
      receipt: `rcptid_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    console.log("hey this  is order + " + order)

    res.status(200).json({ success: true, order });
  } catch (error: any) {
    next(new ErrorHandler(error.message, 500));
  }
});



//  send stripe publishble key
// export const sendStripePublishableKey = CatchAsyncError(
//   async (req: Request, res: Response) => {
//     res.status(200).json({
//       publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
//     });
//   }
// );

// // new payment
// export const newPayment = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const myPayment = await stripe.paymentIntents.create({
//         amount: req.body.amount,
//         currency: "USD",
//         metadata: {
//           company: "E-Learning",
//         },
//         automatic_payment_methods: {
//           enabled: true,
//         },
//       });

//       res.status(201).json({
//         success: true,
        // client_secret: myPayment.client_secret,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );



// initialize Razorpay instance
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET_KEY!,
});

// send Razorpay key
export const sendStripePublishableKey = CatchAsyncError(
  async (req: Request, res: Response) => {
    res.status(200).json({
      publishablekey: process.env.RAZORPAY_KEY_ID,
    });
  }
);

// new payment (create Razorpay order)
export const newPayment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const myPayment = await instance.orders.create({
        amount: req.body.amount * 100, // amount in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          company: "E-Learning",
        },
      });

      res.status(201).json({
        success: true,
        client_secret: myPayment,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_SECRET!,
// });

// export const newPayment = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const options = {
//         amount: req.body.amount * 100, // Razorpay works in paise
//         currency: "INR",
//         receipt: "receipt_order_" + Date.now(),
//         notes: {
//           company: "E-Learning",
//         },
//       };

//       const order = await instance.orders.create(options);
//       console.log(order.id)
//       res.status(201).json({
//         success: true,
//         client_secret: order.id, // using order.id as client_secret equivalent
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );


















// import { NextFunction, Request, Response } from "express";
// import { CatchAsyncError } from "../middleware/catchAsyncErrors";
// import ErrorHandler from "../utils/ErrorHandler";
// import { IOrder } from "../models/order.Model";
// import userModel from "../models/user.model";
// import CourseModel, { ICourse } from "../models/course.model";
// import path from "path";
// import ejs from "ejs";

// import crypto from "crypto";

// import sendMail from "../utils/sendMail";
// import NotificationModel from "../models/notification.Model";
// import { getAllOrdersService, newOrder } from "../services/order.service";
// import { redis } from "../utils/redis";
// import Razorpay from "razorpay";
// require("dotenv").config();


// interface IRazorpayPaymentInfo {
//   razorpay_order_id: string;
//   razorpay_payment_id: string;
// }
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // 🧾 Create Order (after verifying payment)
// // import crypto from "crypto";
// // order.controller.ts



// export const createOrder = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const {
//         courseId,
//         payment_info,
//         razorpay_signature,
//       }: {
//         courseId: string;
//         payment_info: IRazorpayPaymentInfo;
//         razorpay_signature: string;
//       } = req.body;
      
//       // const { courseId, payment_info, razorpay_signature } = req.body as IOrder & {
//         // razorpay_signature: string;
//       // };

//       // 1. Validate Razorpay payment info
//       if (
//         !payment_info?.razorpay_order_id ||
//         !payment_info?.razorpay_payment_id ||
//         !razorpay_signature
//       ) {
//         return next(new ErrorHandler("Payment not authorized!", 400));
//       }

//       // 2. Server-side signature verification
//       const signBody = `${payment_info.razorpay_order_id}|${payment_info.razorpay_payment_id}`;
//       const expectedSignature = crypto
//         .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
//         .update(signBody.toString())
//         .digest("hex");

//       if (expectedSignature !== razorpay_signature) {
//         return next(new ErrorHandler("Payment signature verification failed", 400));
//       }

//       // 3. Find user
//       const user = await userModel.findById(req.user?._id);

//       if (!user) {
//         return next(new ErrorHandler("User not found", 404));
//       }

//       // 4. Check if course already purchased
//       const courseExistInUser = user.courses.some(
//         (course: any) => course._id.toString() === courseId
//       );

//       if (courseExistInUser) {
//         return next(new ErrorHandler("You have already purchased this course", 400));
//       }

//       // 5. Fetch course
//       const course: ICourse | null = await CourseModel.findById(courseId);

//       if (!course) {
//         return next(new ErrorHandler("Course not found", 404));
//       }

//       // 6. Create order data
//       const data: any = {
//         courseId: course._id,
//         userId: user._id,
//         payment_info,
//       };

//       // 7. Prepare mail content
//       const mailData = {
//         order: {
//           _id: course._id.toString().slice(0, 6),
//           name: course.name,
//           price: course.price,
//           date: new Date().toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           }),
//         },
//       };

//       // 8. Send confirmation email
//       await sendMail({
//         email: user.email,
//         subject: "Order Confirmation",
//         template: "order-confirmation.ejs",
//         data: mailData,
//       });

//       // 9. Update user & course
//       user.courses.push(course._id);
//       await redis.set(req.user?._id, JSON.stringify(user));
//       await user.save();

//       course.purchased += 1;
//       await course.save();

//       // 10. Send notification
//       await NotificationModel.create({
//         user: user._id,
//         title: "New Order",
//         message: `You have a new order from ${course.name}`,
//       });

//       // 11. Save order
//       newOrder(data, res, next);
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );

// // 📦 Get All Orders (admin)
// export const getAllOrders = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       getAllOrdersService(res);
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );

// // 🚀 Send Razorpay Key to Client
// export const sendRazorpayKey = CatchAsyncError(
//   async (req: Request, res: Response) => {
//     res.status(200).json({
//       key: process.env.RAZORPAY_KEY_ID,
//     });
//   }
// );

// // 💳 Create Razorpay Order for Payment
// export const newPayment = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const amount = req.body.amount;

//       const options = {
//         amount: amount * 100, // amount in paise
//         currency: "INR",
//         receipt: `rcptid-${Math.floor(Math.random() * 1000000)}`,
//       };

//       const order = await razorpay.orders.create(options);

//       res.status(201).json({
//         success: true,
//         order,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );

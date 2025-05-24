"use client";
// import { styles } from "@/app/styles/style";
// import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
// import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
// import {
//   LinkAuthenticationElement,
//   PaymentElement,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js";
// import { redirect } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";
// import socketIO from "socket.io-client";
// const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
// const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

// type Props = {
//   setOpen: any;
//   data: any;
//   user:any;
//   refetch:any;
// };

// const CheckOutForm = ({ data,user,refetch }: Props) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [message, setMessage] = useState<any>("");
//   const [createOrder, { data: orderData, error }] = useCreateOrderMutation();
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     if (!stripe || !elements) {
//       return;
//     }
//     setIsLoading(true);
//     const { error, paymentIntent } = await stripe.confirmPayment({
//       elements,
//       redirect: "if_required",
//     });
//     if (error) {
//       setMessage(error.message);
//       setIsLoading(false);
//     } else if (paymentIntent && paymentIntent.status === "succeeded") {
//       setIsLoading(false);
//       createOrder({ courseId: data._id, payment_info: paymentIntent });
//     }
//   };

//   useEffect(() => {
//    if(orderData){
//     refetch();
//     socketId.emit("notification", {
//        title: "New Order",
//        message: `You have a new order from ${data.name}`,
//        userId: user._id,
//     });
//     redirect(`/course-access/${data._id}`);
//    }
//    if(error){
//     if ("data" in error) {
//         const errorMessage = error as any;
//         toast.error(errorMessage.data.message);
//       }
//    }
//   }, [orderData,error])
  

//   return (
//     <form id="payment-form" onSubmit={handleSubmit}>
//       <LinkAuthenticationElement id="link-authentication-element" />
//       <PaymentElement id="payment-element" />
//       <button disabled={isLoading || !stripe || !elements} id="submit">
//         <span id="button-text" className={`${styles.button} mt-2 !h-[35px]`}>
//           {isLoading ? "Paying..." : "Pay now"}
//         </span>
//       </button>
//       {/* Show any error or success messages */}
//       {message && (
//         <div id="payment-message" className="text-[red] font-Poppins pt-2">
//           {message}
//         </div>
//       )}
//     </form>
//   );
// };

// export default CheckOutForm;

// "use client";
// import { styles } from "@/app/styles/style";
// import { toast } from "react-hot-toast";
// import React, { useEffect } from "react";
// import axios from "axios";
// import socketIO from "socket.io-client";

// const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
// const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
// const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

// type Props = {
//   setOpen:any;
//   data: any;
//   user: any;
//   refetch: any;
// };

// const CheckOutForm = ({ data, user, refetch }: Props) => {
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//   }, []);
//   const handlePayment = async () => {
//     if (!(window as any).Razorpay) {
//       toast.error("Razorpay SDK is not loaded yet. Please try again shortly.");
//       return;
//     }
  
//     try {
//       // ... rest of your existing code
  
//   // const handlePayment = async () => {
//     // try {
//       const { data: orderData } = await axios.post(
//         `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/create-order`,
//         {
//           amount: data.price * 100,
//         },
//         { withCredentials: true }
//       );

    

//       const options = {
//         key: RAZORPAY_KEY,
//         amount: orderData.amount,
//         currency: "INR",
//         name: "E-Learning Platform",
//         description: data.name, // Show course title
//         image: "/logo.png",
//         order_id: orderData.id,
//          handler: async function (response: any) {
//           const verifyRes = await axios.post(
//            ` ${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/verify`,
//             {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               courseId: data._id,
//             },
//             { withCredentials: true }
//           );

//           if (verifyRes.data.success) {
//             toast.success("Payment successful!");
//             refetch();
//             socketId.emit("notification", {
//               title: "New Order",
//               message: `You have a new order from ${data.name}`,
//               userId: user._id,
//             });
//             window.location.href = `/course-access/${data._id}`;
//           } else {
//             toast.error("Payment verification failed!");
//           }
//         },
//         prefill: {
//           name: user.name,
//           email: user.email,
//         },
//         notes: {
//           courseId: data._id,
//           courseName: data.name,
//           userId: user._id,
//         },
//         theme: {
//           color: "#2d3748",
//         },
//       };

//       const razorpay = new (window as any).Razorpay(options);
//       razorpay.open();
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div>
//       <button
//         onClick={handlePayment}
//         className={`${styles.button} mt-4 !h-[40px]`}
//       >
//         Pay ₹{data.price}
//       </button>
//     </div>
//   );
// };

// export default CheckOutForm;








// import { styles } from "@/app/styles/style";
// import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
// import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
// import { redirect } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";
// import socketIO from "socket.io-client";
// import axios from "axios";

// const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
// const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });
// const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

// type Props = {
//   setOpen: any;
//   data: any;
//   user: any;
//   refetch: any;
// };

// const CheckOutForm = ({ data, user, refetch }: Props) => {
//   const [createOrder, { data: orderData, error }] = useCreateOrderMutation();
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState<any>("");

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     if (!(window as any).Razorpay) {
//       setMessage("Razorpay SDK not loaded. Please try again.");
//       return;
//     }

//     setIsLoading(true);
//     setMessage("");

//     try {
//       // Create Razorpay order
//       const { data: orderData } = await axios.post(
//         `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/create-order`,
//         {
//           amount: data.price * 100,
//         },
//         { withCredentials: true }
//       );

//       const options = {
//         key: RAZORPAY_KEY,
//         amount: orderData.amount,
//         currency: "INR",
//         name: "E-Learning Platform",
//         description: data.name,
//         image: "/logo.png",
//         order_id: orderData.id,
//         handler: async function (response: any) {
//           const verifyRes = await axios.post(
//             `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/verify`,
//             {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               courseId: data._id,
//             },
//             { withCredentials: true }
//           );

//           if (verifyRes.data.success) {
//             await createOrder({
//               courseId: data._id,
//               payment_info: {
//                 id: response.razorpay_payment_id,
//                 status: "succeeded",
//                 type: "Razorpay",
//               },
//             });
//           } else {
//             setMessage("Payment verification failed.");
//             setIsLoading(false);
//           }
//         },
//         prefill: {
//           name: user.name,
//           email: user.email,
//         },
//         notes: {
//           courseId: data._id,
//           userId: user._id,
//         },
//         theme: {
//           color: "#2d3748",
//         },
//       };

//       const razorpay = new (window as any).Razorpay(options);
//       razorpay.open();
//     } catch (err: any) {
//       setMessage(err.response?.data?.message || "Payment failed.");
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (orderData) {
//       refetch();
//       socketId.emit("notification", {
//         title: "New Order",
//         message: `You have a new order from ${data.name}`,
//         userId: user._id,
//       });
//       redirect(`/course-access/${data._id}`);
//     }
//     if (error) {
//       if ("data" in error) {
//         const errorMessage = error as any;
//         toast.error(errorMessage.data.message);
//       }
//     }
//   }, [orderData, error]);

//   return (
//     <form id="payment-form" onSubmit={handleSubmit}>
//       <div id="link-authentication-element">
//         <p className="text-sm text-gray-600">
//           Logged in as: <strong>{user?.email}</strong>
//         </p>
//       </div>

//       {/* Razorpay UI is triggered via button, no input needed */}
//       <div id="payment-element">
//         <p className="text-sm text-gray-600">Secure payment powered by Razorpay</p>
//       </div>

//       <button disabled={isLoading} id="submit" type="submit">
//         <span id="button-text" className={`${styles.button} mt-2 !h-[35px]`}>
//           {isLoading ? "Paying..." : "Pay now"}
//         </span>
//       </button>

//       {message && (
//         <div id="payment-message" className="text-[red] font-Poppins pt-2">
//           {message}
//         </div>
//       )}
//     </form>
//   );
// };

// export default CheckOutForm;

// "use client";
import React, { useEffect, useState } from "react";
import { styles } from "@/app/styles/style";
import { toast } from "react-hot-toast";
import axios from "axios";
import socketIO from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

type Props = {
  setOpen: any;
  data: any;
  user: any;
  refetch: any;
};

const CheckOutForm = ({ setOpen, data, user, refetch }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: orderData } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/create-order`,
        { amount: data.price * 100 },
        { withCredentials: true }
      );

      const options = {
        key: RAZORPAY_KEY,
        amount: orderData.amount,
        currency: "INR",
        name: "E-Learning Platform",
        description: data.name,
        image: "/logo.png",
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await axios.post(
              `${process.env.NEXT_PUBLIC_SERVER_URI}/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: data._id,
              },
              { withCredentials: true }
            );

            if (verifyRes.data.success) {
              toast.success("Payment successful!");
              refetch();
              socketId.emit("notification", {
                title: "New Order",
                message: `You have a new order from ${data.name}`,
                userId: user._id,
              });
              window.location.href = `/course-access/${data._id}`;
            } else {
              setMessage("Payment verification failed.");
            }
          } catch (error: any) {
            setMessage(error?.response?.data?.message || "Verification failed.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || "",
        },
        notes: {
          courseId: data._id,
          courseName: data.name,
          userId: user._id,
        },
        theme: {
          color: "#2d3748",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      {/* Placeholder for authentication (not used in Razorpay) */}
      <div id="link-authentication-element" />
      <div id="payment-element" />
      <button disabled={isLoading} id="submit">
        <span id="button-text" className={`${styles.button} mt-2 !h-[35px]`}>
          {isLoading ? "Paying..." : "Pay now"}
        </span>
      </button>
      {message && (
        <div id="payment-message" className="text-[red] font-Poppins pt-2">
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckOutForm;


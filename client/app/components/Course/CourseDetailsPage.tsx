// import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
// import React, { useEffect, useState } from "react";
// import Loader from "../Loader/Loader";
// import Heading from "@/app/utils/Heading";
// import Header from "../Header";
// import Footer from "../Footer";
// import CourseDetails from "./CourseDetails";
// import {
//   useCreatePaymentIntentMutation,
//   useGetStripePublishablekeyQuery,
// } from "@/redux/features/orders/ordersApi";
// import { loadStripe } from "@stripe/stripe-js";
// import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

// type Props = {
//   id: string;
// };

// const CourseDetailsPage = ({ id }: Props) => {
//   const [route, setRoute] = useState("Login");
//   const [open, setOpen] = useState(false);
//   const { data, isLoading } = useGetCourseDetailsQuery(id);
//   const { data: config } = useGetStripePublishablekeyQuery({});
//   const [createPaymentIntent, { data: paymentIntentData }] =
//     useCreatePaymentIntentMutation();
//   const { data: userData } = useLoadUserQuery(undefined, {});
//   const [stripePromise, setStripePromise] = useState<any>(null);
//   const [clientSecret, setClientSecret] = useState("");

//   useEffect(() => {
//     if (config) {
//       const publishablekey = config?.publishablekey;
//       setStripePromise(loadStripe(publishablekey));
//     }
//     if (data && userData?.user) {
//       const amount = Math.round(data.course.price * 100);
//       createPaymentIntent(amount);
//     }
//   }, [config, data, userData]);

//   useEffect(() => {
//     if (paymentIntentData) {
//       setClientSecret(paymentIntentData?.client_secret);
//     }
//   }, [paymentIntentData]);

//   return (
//     <>
//       {isLoading ? (
//         <Loader />
//       ) : (
//         <div>
//           <Heading
//             title={data.course.name + " - ELearning"}
//             description={
//               "ELearning is a programming community which is developed by shahriar sajeeb for helping programmers"
//             }
//             keywords={data?.course?.tags}
//           />
//           <Header
//             route={route}
//             setRoute={setRoute}
//             open={open}
//             setOpen={setOpen}
//             activeItem={1}
//           />
//           {stripePromise && (
//             <CourseDetails
//               data={data.course}
//               stripePromise={stripePromise}
//               clientSecret={clientSecret}
//               setRoute={setRoute}
//               setOpen={setOpen}
//             />
//           )}
//           <Footer />
//         </div>
//       )}
//     </>
//   );
// };

// export default CourseDetailsPage;





import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./CourseDetails";
import {
  useCreatePaymentIntentMutation,
  useGetStripePublishablekeyQuery,
} from "@/redux/features/orders/ordersApi"; // Keep this, we'll reuse it
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

// Razorpay: declare global object for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

type Props = {
  id: string;
};

const CourseDetailsPage = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetCourseDetailsQuery(id);
  const { data: config } = useGetStripePublishablekeyQuery({}); // assuming this returns Razorpay key now
  const [createPaymentIntent, { data: paymentIntentData }] =
    useCreatePaymentIntentMutation();
  const { data: userData } = useLoadUserQuery(undefined, {});
  const [stripePromise, setStripePromise] = useState<any>(null); // We will use this to store orderData
  const [clientSecret, setClientSecret] = useState(""); // Used to store order ID

  // Razorpay script loader
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (config) {
      const publishablekey = config?.publishablekey; // treat as Razorpay key now
      setStripePromise(publishablekey); // repurpose this variable
    }

    if (data && userData?.user) {
      const amount = Math.round(data.course.price * 100);
      createPaymentIntent(amount); // still calling the backend to create Razorpay order
    }
  }, [config, data, userData]);

  useEffect(() => {
    if (paymentIntentData) {
      setClientSecret(paymentIntentData?.id); // Razorpay order_id
    }
  }, [paymentIntentData]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Heading
            title={data.course.name + " - ELearning"}
            description={
              "ELearning is a programming community which is developed by shahriar sajeeb for helping programmers"
            }
            keywords={data?.course?.tags}
          />
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          {stripePromise && (
            <CourseDetails
              data={data.course}
              stripePromise={stripePromise} // now Razorpay key
              client_secret={clientSecret}   // now Razorpay order_id
              setRoute={setRoute}
              setOpen={setOpen}
            />
          )}
          <Footer />
        </div>
      )}
    </>
  );
};

export default CourseDetailsPage;


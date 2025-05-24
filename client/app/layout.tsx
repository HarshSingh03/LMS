"use client";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "./utils/theme-provider";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import { SessionProvider } from "next-auth/react";
import React, { FC, useEffect } from "react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./components/Loader/Loader";
import socketIO from "socket.io-client";
import dynamic from "next/dynamic";
const Chat = dynamic(() => import('./components/Chatbot'), { ssr: false });
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });
// import { useSelector } from "react-redux";
// import {store} from '../redux/features/store';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const {token} = useSelector((state:any)=> state.auth)
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${poppins.variable} ${josefin.variable} !bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300`}
      >
        <Providers>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Custom>
                <div suppressHydrationWarning={true}>{children}</div>
              </Custom>
              <Toaster position="top-center" reverseOrder={false} />
              {
              // token &&  
              <Chat />
              }
            </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}

// const Custom: FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isLoading } = useLoadUserQuery({});

//   useEffect(() => {
//     socketId.on("connection", () => {});
//   }, []);

//   return <div>{isLoading ? <Loader /> : <div>{children} </div>}</div>;
// };


const Custom: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useLoadUserQuery({});
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    socketId.on("connection", () => {});
  }, []);

  if (!mounted) {
    return <div suppressHydrationWarning={true} />; // Prevent hydration issues
  }

  return <div>{isLoading ? <Loader /> : children}</div>;
};

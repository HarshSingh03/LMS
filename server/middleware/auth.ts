import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import { updateAccessToken } from "../controllers/user.controller";

// authenticated user
export const isAutheticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Cookies received:", req.cookies);
    const access_token = req.cookies.access_token as string;

    if (!access_token) {
      console.log("Access token not found in cookies!");
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }

    const decoded = jwt.decode(access_token) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("access token is not valid", 400));
    }

    // check if the access token is expired
    if (decoded.exp && decoded.exp <= Date.now() / 1000) {
      try {
        console.log("Access token expired, trying to refresh...");
        await updateAccessToken(req, res, next);
        console.log("Access token refreshed successfully!");
      } catch (error) {
        console.log("Failed to refresh access token:", error);
        return next(error);
      }
    } else {
      const user = await redis.get(decoded.id);
      console.log("User from Redis:", user); 

      if (!user) {
        return next(
          new ErrorHandler("Please login to access this resource", 400)
        );
      }

      req.user = JSON.parse(user);

      next();
    }
  }
);

// validate user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};

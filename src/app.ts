import "reflect-metadata"; // We need this to use @decorators in TypeORM
import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import logger from "./config/logger";

import authRouter from "./routes/auth";
import { cookie } from "express-validator";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser()); // Middleware to parse cookies
app.use(express.json()); // Middleware to parse JSON bodies

app.get("/", (req, res, next) => {
  // const error = createHttpError(401, "You cannnot access this route");
  // throw error;
  // next(error);
  res.send("Hello World!");
});

// saaari baat abhi iss route pe kya hoga vo kaam kar rha hu
app.use("/auth", authRouter);

// gloal error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;
  logger.error(err.message, {
    statusCode,
  });

  res.status(statusCode).json({
    errors: [{ type: err.name, msg: err.message, path: "", location: "" }],
  });
});
export default app;

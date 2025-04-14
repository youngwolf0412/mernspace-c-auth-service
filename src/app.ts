import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import "reflect-metadata"; // We need this to use @decorators in TypeORM
import logger from "./config/logger";

import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import tenantRouter from "./routes/tenant";

const app = express();
app.use(express.static("public"));

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

app.use("/tenants", tenantRouter);

// gloal error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || err.status || 500;
  logger.error(err.message, {
    statusCode,
  });

  res.status(statusCode).json({
    errors: [{ type: err.name, msg: err.message, path: "", location: "" }],
  });
});
export default app;

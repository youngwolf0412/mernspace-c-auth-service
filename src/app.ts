import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import logger from "./config/logger";

const app = express();

app.get("/", (req, res, next) => {
  // const error = createHttpError(401, "You cannnot access this route");
  // throw error;
  // next(error);
  res.send("Hello World!");
});

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

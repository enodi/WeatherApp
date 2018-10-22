"use strict";

import express from "express";
import logger from "morgan";
import mongoose from "mongoose";
import { json as jsonParser, urlencoded } from "body-parser";
import dotenv from 'dotenv';

import UserRoute from "./server/routes/users";
import SearchRoute from "./server/routes/search";

dotenv.config();

mongoose.connect(process.env.MONGO_URL);
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

app.use(logger("dev"));
app.use(urlencoded({ extended: true }));
app.use(jsonParser());

app.use("/api/v1", UserRoute);
app.use("/api/v1", SearchRoute);

app.get('/', (req, res) => res.status(200).send({
  message: 'Simple Weather Forecast Application',
}));

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`listening on port ${port}`));

export default app;

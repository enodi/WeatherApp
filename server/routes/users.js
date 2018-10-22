import express from "express";

import UserController from "../controllers/userController";
import { validateSignupFields, validateUserExists, validateSigninFields }
  from "../middleware/validate";

const app = express.Router();

app.route("/signup")
  .post(validateSignupFields, validateUserExists, UserController.signUp);

app.route("/signin")
  .post(validateSigninFields, UserController.signIn);

export default app;

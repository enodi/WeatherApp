"use strict";

import User from "../models/user";
import UserFields from "../constants/userFields";

function validateFields(req, res, next, requiredFields) {
  const errors = {};
  requiredFields.forEach((field) => {
    if (!req.body[field]) {
      errors[field] = `${field} field is required`
    }
  });
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      errors,
    });
  }
  next();
}

export function validateUserExists(req, res, next) {
  const { email } = req.body;
  const re = /\S+@\S+\.\S+/;
  const requestEmail = re.test(email);
  if (!requestEmail) return res.status(400).json({ message: "Invalid email" });

  User.findOne({ email }, (err, userExists) => {
    if (userExists) {
      return res.status(409).json({
        message: "Email already exist"
      });
    }
    next();
  });
}

export function validateSignupFields(req, res, next) {
  return validateFields(req, res, next, UserFields.SIGNUP);
}

export function validateSigninFields(req, res, next) {
  return validateFields(req, res, next, UserFields.SIGNIN);
}

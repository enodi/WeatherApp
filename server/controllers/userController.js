import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
  static signUp(req, res, next) {
    User.create({
      name: req.body.name.trim(),
      email: req.body.email.trim(),
      password: req.body.password.trim()
    }, (err, user) => {
      if (user) {
        const { _id, name, email } = user;
        const token = jwt.sign(
          { id: user._id, name: user.name },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRY_TIME }
        );
        const userDetails = {
          message: "User created successfully",
          id: _id,
          name,
          email,
          token
        };
        return res.status(201).json(userDetails);
      }
      return next(err);
    });
  }

  static signIn(req, res, next) {
    User.findOne({
      email: req.body.email
    }, (err, userFound) => {
      if (err) return next(err);
      if (!userFound) {
        return res.status(404).json({
          message: "Invalid credentials"
        });
      }
      const passwordMatched = bcrypt.compareSync(req.body.password.trim(), userFound.password);
      if (passwordMatched) {
        const token = jwt
          .sign(
            { id: userFound._id, name: userFound.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY_TIME }
          );
        return res.status(200).json({
          message: "Signin successful",
          token
        });
      }
      return res.status(404).send({
        message: 'Invalid credentials'
      });
    });
  }
}

export default UserController;

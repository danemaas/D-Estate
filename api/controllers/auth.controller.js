import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPass = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPass,
  });
  await newUser
    .save()
    .then(() => {
      res.status(200).json("User created successfully!!");
    })
    .catch((error) => {
      next(error);
    });
};

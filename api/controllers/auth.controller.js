import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "Invalid credentials!"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid credentials!"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { name, email, profileImage } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPass =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPass = bcryptjs.hashSync(generatedPass, 10);

      const newUser = new User({
        username: name.split(" ").join("").toLowerCase(),
        email,
        password: hashedPass,
        profileImage,
      });
      await newUser
        .save()
        .then(() => {
          const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
          const { password: pass, ...rest } = newUser._doc;
          res
            .cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json(rest);
        })
        .catch((error) => {
          next(error);
        });
    }
  } catch (error) {
    next(error);
  }
};

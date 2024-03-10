import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../routes/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const saltRounds = 10; //Defines the number of rounds for the password hashing process. More rounds generally mean a more secure hash.
  try {
    const salt = bcrypt.genSaltSync(saltRounds); //Generates a salt using the specified number of rounds. A salt is a random value used in the password hashing process to increase security.
    const hash = bcrypt.hashSync(req.body.password, salt); //Hashes the user's password using the generated salt. The hashed password is a secure and irreversible version of the original password.
    const newUser = new User({ ...req.body, password: hash }); //Creates a new user object, taking user information from the request body and replacing the plain password with the hashed password.

    await newUser.save(); //Saves the new user (with the hashed password) to a database. This assumes that a User model and a database connection are set up elsewhere in the code.
    res.status(200).send("user has been created"); //If everything is successful, it sends a response indicating that the user has been created.
  } catch (err) {
    next(err); //if any errors occur during the process (e.g., database error), it passes the error to the next middleware or error handler.
  }
};

export const signin = async (req, res, next) => {
  const saltRounds = 10;
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong Credential"));

    const token = jwt.sign({ id: user._id }, process.env.JWT); // If the credentials are correct, it generates a JSON Web Token (JWT) using the user's ID and a secret key.
    const { password, ...others } = user._doc; //Extracts user information excluding the password from the user document.

    res
      .cookie("access_token", token, {
        httpOnly: true,
      }) //Sets an HTTP-only cookie with the JWT for secure token storage. scripts like JS etc cannot have access to that token, which enhances the security
      .status(200)
      .json(others); //Sends a successful response with the user's information (excluding the password).
  } catch (err) {
    next(err);
  }
};

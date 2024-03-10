import express from "express";
import { signin, signup } from "../controllers/auth.js";

const router = express.Router();

//CREATE A USER
router.post("/signup", signup);
//SIGN IN
router.post("/signin", signin);
//GOOGLE AUTH
router.post("/google");

export default router;

/**
 Creates an instance of an Express Router. A router allows you to group route handlers 
 and middleware together, making it easier to organize and modularize your application.
 */

const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { generateToken, isAuth, isAdmin } = require("../utils");
const { body, validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Roles } = require("../utils/constants");
const jwtSecret = "qwertyuioasdfghjklzxcvbnmklkjsf";

const userRouter = express.Router();

userRouter.get(
  "/createadmin",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = new User({
        name: "admin",
        email: "admin@example.com",
        password: "vijay",
        isAdmin: true,
      });
      console.log(user);
      const createdUser = await user.save();
      res.send(createdUser);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  })
);

userRouter.post(
  "/login",
  [
    [
      body("email").isEmail(),
      body("password", "Incorrect Password").isLength({ min: 5 }),
    ],
  ],
  expressAsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      // console.log(req.body)
      let userData = await User.findOne({ email: email });
      console.log(userData);

      if (userData) {
        // console.log(userData.password)
        const pwdCompare = await bcrypt.compare(
          req.body.password,
          userData.password
        );
        if (!pwdCompare) {
          console.log(password);
          res.status(401).json({ message: "Login unSuccessfull" });
        }
        const data = {
          user: {
            email: userData.email,
            name: userData.name,
            id: userData._id,
            role: userData.role,
          },
        };
        const authToken = jwt.sign(data, jwtSecret);
        return res.status(200).json({
          message: "Login Successfull",
          authToken: authToken,
          data: data,
        });
      } else {
        res.status(401).send("user not registere");
      }
    } catch (err) {
      console.log(err);
      return res.status(401).send(err);
    }
  })
);

userRouter.post(
  "/register",
  [
    body("email").isEmail(),
    body("name").isLength({ min: 4 }),
    body("password", "Incorrect Password").isLength({ min: 5 }),
  ],
  expressAsyncHandler(async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    const salt = await bcrypt.genSalt(10);
    console.log(req.body);
    let secPasssword = await bcrypt.hash(req.body.password, salt);

    try {
      const { name, email, password, mobileNo, isAdmin } = req.body;
      let user = await User.findOne({ email: email });
      if (user) {
        return res.status(200).send({ message: "already registered" });
      }
      let user1 = await User.create({
        name,
        email,
        password: secPasssword,
        mobileNo,
      });
      const createdUser = await user1.save();

      if (!createdUser) {
        res.status(401).send({
          message: "Invalid User Data",
        });
      } else {
        const data = {
          user: {
            email: email,
            name: name,
            role: createdUser.role,
          },
        };
        const authToken = jwt.sign(data, jwtSecret);
        res.status(200).json({
          _id: createdUser._id,
          name: createdUser.name,
          email: createdUser.email,
          password: createdUser.password,
          role: createdUser.role,
          // token: generateToken(createdUser),
          authToken: authToken,
        });
      }
    } catch (error) {
      console.log(error);
      // return res.send({err:`${err}`})
      return res.status(400).send("error has occured", error);
    }
  })
);

userRouter.put(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).send({
        message: "User Not Found",
      });
    } else {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        password: updatedUser.password,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    }
  })
);

module.exports = userRouter;

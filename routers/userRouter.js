const express = require("express");
const db = require("../data/helpers/userDb");

const userRouter = express.Router();

const genericError = { err: "There was a problem processing your request" };

userRouter.get("/", async (req, res) => {
  try {
    const users = await db.get();
    res.status(200).json(users);
  } catch {
    res.status(500).json(genericError);
  }
});

userRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await db.getById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ err: "User by that id could not be found" });
    }
  } catch {
    res.status(500).json(genericError);
  }
});

userRouter.post("/", async (req, res) => {
  try {
    if (!req.body.name) {
      res.status(400).json({ err: "Please provide a user name" });
    } else {
      const name = req.body;
      const newUser = await db.insert(name);
      res.status(201).json(newUser);
    }
  } catch {
    res.status(500).json(genericError);
  }
});

module.exports = userRouter;

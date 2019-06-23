require("dotenv").config();

const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../data/dbConfig");
const secret = process.env.JWT_SECRET;

module.exports = server => {
  server.post("/register", register);
  server.post("/login", login);
};

function register(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({
      message: "Please provide both a username and a password."
    });
  }

  const hash = bcrypt.hashSync(password, 10);

  db("users")
    .insert({ username, password: hash })
    .then(([id]) => {
      res.status(201).json({
        username,
        id
      });
    })
    .catch(error => {
      res.status(500).json(error);
    });
}

function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({
      message: "Please provide both a username and a password."
    });
  }

  db("users")
    .where({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = genToken(user);
        res.status(200).json({
          message: `Welcome ${user.username}`,
          token
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
}

function genToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: "1d"
  };
  return jwt.sign(payload, secret, options);
}

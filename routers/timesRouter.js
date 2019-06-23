require("dotenv").config();

const timesRouter = require("express").Router();
const db = require("../data/dbConfig");

timesRouter.post("/:id/logSleep/", async (req, res) => {
  const { start_time, end_time, rating } = req.body;
  const user_id = req.params.id;
});

authRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({
      message: "Please provide both a username and a password."
    });
  }

  const hash = bcrypt.hashSync(password, 10);

  await db("users")
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
});

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({
      message: "Please provide both a username and a password."
    });
  }

  await db("users")
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
});

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

module.exports = authRouter;

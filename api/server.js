const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const authRouter = require("../routers/authRouter");
const timesRouter = require("../routers/timesRouter");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(morgan("combined"));

server.get("/", (req, res) => {
  res.status(200).send("Server is alive and well");
});

server.use("/api/auth", authRouter);
server.use("/api/times", timesRouter);

module.exports = server;

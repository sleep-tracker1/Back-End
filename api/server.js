const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(morgan("combined"));

server.get("/", (req, res) => {
  res.status(200).send("Server is alive and well");
});

module.exports = server;

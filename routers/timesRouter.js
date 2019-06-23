require("dotenv").config();

const timesRouter = require("express").Router();
const db = require("../data/dbConfig");

timesRouter.post("/:id/log-time", async (req, res) => {
  const user_id = req.params.id;
  const { sleep_date } = req.body;
  const [rating, start_time, end_time] = (({
    rating: a,
    start_time: b,
    end_time: c
  }) => [parseInt(a), parseInt(b), parseInt(c)])(req.body);

  if (!start_time || !end_time || !sleep_date) {
    res.status(400).json({
      message: "Please provide a date, and start & end times"
    });
  }

  const duration = end_time - start_time;

  await db("sleep_times")
    .insert({
      user_id,
      start_time,
      end_time,
      duration,
      rating,
      sleep_date
    })
    .then(([id]) => {
      res.status(201).json({
        id,
        message: `Succesfully added log for ${sleep_date}`
      });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = timesRouter;

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

timesRouter.get("/:id/logs", async (req, res) => {
  const user_id = req.params.id;

  try {
    const logs = await db("sleep_times").where({ user_id });

    if (logs) {
      res.status(201).json(logs);
    } else {
      res.status(404).json({
        message: "User ID does not exist or does not contain any logs"
      });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// timesRouter.get("/:id/calculate-ideal-duration", async (req, res) => {});
timesRouter.get("/:id/sleep-averages", async (req, res) => {
  const user_id = req.params.id;

  try {
    const logs = await db("sleep_times").where({ user_id });

    if (!logs) {
      res.status(404).json({
        message: "There were no sleep records"
      });
    }

    // Calculate best, good, poor, and worst sleep times
    const best = [];
    const good = [];
    const poor = [];
    const worst = [];
    for (let i = 0; i < logs.length; i++) {
      if (logs[i].rating === 4) {
        best.push(logs[i].duration);
      } else if (logs[i].rating === 3) {
        good.push(logs[i].duration);
      } else if (logs[i].rating === 2) {
        poor.push(logs[i].duration);
      } else if (logs[i].rating === 1) {
        worst.push(logs[i].duration);
      }
    }
    let best_average;
    let good_average;
    let poor_average;
    let worst_average;
    const findAvgHours = arr => {
      let sum = 0;
      for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
      }
      return sum / arr.length / (1000 * 60 * 60);
    };
    // if no entries, return -1, otherwise get the average
    if (best.length === 0) {
      best_average = -1;
    } else {
      best_average = findAvgHours(best);
    }
    if (good.length === 0) {
      good_average = -1;
    } else {
      good_average = findAvgHours(good);
    }
    if (poor.length === 0) {
      poor_average = -1;
    } else {
      poor_average = findAvgHours(poor);
    }
    if (worst.length === 0) {
      worst_average = -1;
    } else {
      worst_average = findAvgHours(worst);
    }

    // respond with the averages
    res.status(201).json({
      best_average,
      good_average,
      poor_average,
      worst_average
    });
  } catch (error) {
    res.status(500).json({
      message: `There was an error ${error}`
    });
  }
});

module.exports = timesRouter;

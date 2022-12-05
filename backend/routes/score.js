const express = require("express");
const router = express.Router();

const connection = require("../common/db");

router.patch("/", async (req, res) => {
  const std_id = Number(req.body.std_id);
  const exam_id = Number(req.body.exam_id);
  const finished = req.body.finished;
  const score = Number(req.body.score);
  const status = req.body.status;
  const submitted_on = new Date(req.body.submitted_on);

  console.log(std_id);
  console.log(exam_id);
  console.log(finished);
  console.log(score);
  console.log(status);

  try {
    let db = await connection.Get();
    let database = db.db("OptimusEvaluation");
    let collection = database.collection("Exams");

    const query = { $and: [{ exam_id: exam_id }, { student_id: std_id }] };
    const update = {
      $set: {
        "trial.finished": finished,
        "trial.score": score,
        "trial.status": status,
        "trial.submitted_on": submitted_on,
      },
    };
    const Projection = {};
    const sort = {};
    const skip = {};
    const limit = {};

    collection.updateOne(query, update, (err, result) => {
      if (err) console.error(err);
      else {
        if (result) res.status(200).json(result);
        else
          res
            .status(200)
            .json({ Success: true, msg: "Exam data is not found" });
      }
    });
  } catch (err) {
    res.status(401).json({ error: err });
  }
});

router.post("/", async (req, res) => {
  const std_id = Number(req.body.std_id);
  const exam_id = Number(req.body.exam_id);

  console.log(exam_id);

  try {
    let db = await connection.Get();
    let database = db.db("OptimusEvaluation");
    let collection = database.collection("Exams");

    const query = { $and: [{ exam_id: exam_id }, { student_id: std_id }] };
    const Projection = {};
    const sort = {};
    const skip = {};
    const limit = {};

    collection.findOne(query, sort, (err, result) => {
      if (err) console.error(err);
      else {
        if (result) res.status(200).json(result.trial);
        else
          res
            .status(200)
            .json({ Success: true, msg: "Exam data is not found" });
      }
    });
  } catch (err) {
    res.status(401).json({ error: err });
  }
});

module.exports = router;

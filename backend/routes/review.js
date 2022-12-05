const express = require("express");
const router = express.Router();

const connection = require("../common/db");

router.post("/", async (req, res) => {
  const exam_id = Number(req.body.exam_id);
  const std_id = Number(req.body.std_id);

  console.log(exam_id);
  console.log(std_id);

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

router.post("/:id", async (req, res) => {
  const std_id = Number(req.params.id);
  const exam_id = Number(req.body.exam_id);

  console.log(std_id);
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

    collection
      .find(query)
      .sort(sort)
      .toArray((err, result) => {
        if (err) console.error(err);
        else {
          if (result) res.status(200).json(result.trial.score);
          else
            res
              .status(200)
              .json({ Success: true, msg: "questions data is not found" });
        }
      });
  } catch (err) {
    res.status(401).json({ error: err });
  }
});

module.exports = router;

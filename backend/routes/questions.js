const express = require("express");
const router = express.Router();

const connection = require("../common/db");

router.post("/", async (req, res) => {
  const questionsIds = req.body.questions;
  console.log(questionsIds);

  try {
    let db = await connection.Get();
    let database = db.db("OptimusEvaluation");
    let collection = database.collection("questions");

    const query = { question_id: { $in: questionsIds } };
    const Projection = {};
    const sort = { question_id: 1 };
    const skip = {};
    const limit = {};

    collection
      .find(query)
      .sort(sort)
      .toArray((err, result) => {
        if (err) console.error(err);
        else {
          if (result) res.status(200).json(result);
          else
            res
              .status(200)
              .json({ Success: true, msg: "questions data is not found" });
        }
      });
  } catch (err) {
    res.status(401).json({ err });
  }
});

router.post("/:id", async (req, res) => {
  const examId = Number(req.params.id);
  console.log(examId);
  try {
    let db = await connection.Get();
    let database = db.db("OptimusEvaluation");
    let collection = database.collection("Exams");

    const query = { exam_id: examId };
    const Projection = {};
    const sort = {};
    const skip = {};
    const limit = {};

    collection.findOne(query, sort, (err, result) => {
      if (err) console.error(err);
      else {
        if (result) res.status(200).json(result.time_in_seconds);
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

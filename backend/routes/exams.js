const express = require("express");
const router = express.Router();

const connection = require("../common/db");

router.post("/", async (req, res) => {
  const examsList = req.body.exams;
  const std_id = req.body.std_id;
  console.log(examsList);
  console.log(std_id);

  try {
    let db = await connection.Get();
    let database = db.db("OptimusEvaluation");
    let collection = database.collection("Exams");

    const query = {
      $and: [{ exam_id: { $in: examsList } }, { student_id: 1800379 }],
    };
    const Projection = {};
    const sort = { stage: 1 };
    const skip = {};
    const limit = {};

    const aggregate = [
      {
        $match: query,
      },
      {
        $lookup: {
          from: "Student_exam",
          localField: "exam_id",
          foreignField: "exam_id",
          as: "Student_exam",
        },
      },
      {
        $sort: sort,
      },
    ];

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
              .json({ Success: true, msg: "Exams data is not found" });
        }
      });
  } catch (err) {
    console.log(err);
    res.status(401).send(err);
  }
});

router.get("/:id", async (req, res) => {
  const examId = Number(req.params.id);

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

router.patch("/", async (req, res) => {
  const std_id = Number(req.body.std_id);
  const exam_id = Number(req.body.exam_id);
  const attempted = req.body.attempted;
  const date = new Date(req.body.date);

  console.log(std_id);
  console.log(exam_id);
  console.log(attempted);
  console.log(date);

  try {
    let db = await connection.Get();
    let database = db.db("OptimusEvaluation");
    let collection = database.collection("Exams");

    const query = { $and: [{ exam_id: exam_id }, { student_id: std_id }] };
    const update = {
      $set: { "trial.attempted": attempted, "trial.started_time": date },
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

router.patch("/:id", async (req, res) => {
  const std_id = Number(req.params.id);
  const exam_id = Number(req.body.exam_id);
  const items = req.body.items;

  console.log(std_id);
  console.log(exam_id);
  console.log(items);

  try {
    let db = await connection.Get();
    let database = db.db("OptimusEvaluation");
    let collection = database.collection("Exams");

    const query = { $and: [{ exam_id: exam_id }, { student_id: std_id }] };
    const update = { $set: { "trial.chosen_answers": items } };
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

module.exports = router;

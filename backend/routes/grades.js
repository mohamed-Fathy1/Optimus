const express = require("express");
const router = express.Router();

const connection = require("../common/db");

router.post("/", async (req, res) => {
  const std_id = Number(req.body.std_id);

  console.log(std_id);

  try {
    let db = await connection.Get();
    let database = db.db("OptimusEvaluation");
    let collection = database.collection("Student_courses_grades");

    const query = { student_id: std_id };
    const Projection = {};
    // const sort = { course_name: 1 };
    const sort = {};
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

router.patch("/", async (req, res) => {
  const std_id = Number(req.body.std_id);
  const course_id = req.body.course_id;
  const score = Number(req.body.score);
  const type = req.body.type;
  const title = req.body.title;
  const exam_number = Number(req.body.exam_number);

  console.log(std_id);
  console.log(course_id);
  console.log(score);
  console.log(type);
  console.log(title);
  console.log(exam_number);

  try {
    let db = await connection.Get();
    let database = db.db("OptimusEvaluation");
    let collection = database.collection("Student_courses_grades");
    const query = { $and: [{ student_id: std_id }, { course_id: course_id }] };

    let update = {};

    switch (type) {
      case "assignment":
        if (exam_number === 1) {
          update = {
            $inc: { assignments: score },
            $set: { [title]: score, "finished.assignment1": true },
          };
        } else {
          update = {
            $inc: { assignments: score },
            $set: { [title]: score, "finished.assignment2": true },
          };
        }

        break;
      case "quiz":
        if (exam_number === 1) {
          update = {
            $inc: { quizzes: score },
            $set: { [title]: score, "finished.quiz1": true },
          };
        } else {
          update = {
            $inc: { quizzes: score },
            $set: { [title]: score, "finished.quiz2": true },
          };
        }
        break;
      case "midterm":
        update = {
          $inc: { midterm: score },
          $set: { "finished.midterm": true },
        };
        break;
      case "final":
        update = {
          $inc: { final: score },
          $set: { ready_for_evaluating: true, "finished.final": true },
        };
        break;
      default:
        console.log("mismatch Type!!!");
    }

    const Projection = {};
    const sort = { course_id: 1 };
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
    res.status(401).json({ err });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();

const connection = require("../common/db");

router.post("/", async (req, res) => {
  const CoursesList = req.body.courses;
  console.log(CoursesList);

  try {
    let db = await connection.Get();
    let database = db.db("OptimusEvaluation");
    let collection = database.collection("Courses");

    const query = { course_id: { $in: CoursesList } };
    const Projection = {};
    const sort = { course_name: 1 };
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
              .json({ Success: true, msg: "Course data is not found" });
        }
      });
  } catch (err) {
    res.status(401).json({ err });
  }
});

router.get("/:id", async (req, res) => {
  const CourseId = req.params.id;

  try {
    let db = await connection.Get();
    let database = db.db("OptimusEvaluation");
    let collection = database.collection("Courses");

    const query = { course_id: CourseId };
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
            .status(401)
            .json({ Success: true, msg: "Course data is not found" });
      }
    });
  } catch (err) {
    res.status(401).json({ error: err });
  }
});

router.post("/:id", async (req, res) => {
  const course_id = req.params.id;
  console.log(course_id);

  try {
    let db = await connection.Get();
    let database = db.db("OptimusEvaluation");
    let collection = database.collection("Courses");

    const query = { course_id: course_id };
    const Projection = {};
    const sort = { course_name: 1 };
    const skip = {};
    const limit = {};

    collection.findOne(query, sort, (err, result) => {
      if (err) console.error(err);
      else {
        if (result) res.status(200).json(result);
        else
          res
            .status(401)
            .json({ Success: true, msg: "Course data is not found" });
      }
    });
  } catch (err) {
    res.status(401).json({ err });
  }
});

module.exports = router;

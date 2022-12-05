const express = require("express");
const router = express.Router();

const connection = require("../common/db");

router.post("/", async (req, res) => {
  const level = Number(req.body.level);

  console.log(level);

  try {
    let db = await connection.Get();
    let database = db.db("OptimusEvaluation");
    let collection = database.collection("Announcements");

    const query = { level: level };
    const Projection = {};
    const sort = { Course_name: 1 };
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

module.exports = router;

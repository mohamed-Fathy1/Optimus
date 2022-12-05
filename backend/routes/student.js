const express = require("express");
const router = express.Router();

const connection = require("../common/db");

router.get("/", async (req, res) => {
  try {
    let db = await connection.Get();
    let database = db.db("OptimusEvaluation");
    let collection = database.collection("Students");

    const query = { id: 1800135 };
    const Projection = {};
    const sort = {};
    const skip = {};
    const limit = {};

    collection.findOne(query, (err, result) => {
      if (err) console.error(err);
      else {
        res.status(200).json(result);
      }
    });
  } catch (err) {
    console.error(err);
  }
});

router.post("/", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    let db = await connection.Get();
    let database = db.db("OptimusEvaluation");
    let collection = database.collection("Students");

    const query = { $and: [{ username: username }, { password: password }] };
    const Projection = {};
    const sort = {};
    const skip = {};
    const limit = {};

    collection.findOne(query, (err, result) => {
      if (err) console.error(err);
      else {
        if (result) res.status(200).json(result);
        else res.status(200).json({ msg: "User Not Found" });
      }
    });
  } catch (err) {
    res.status(401).json({ success: true, msg: "user Not Found" });
  }
});

module.exports = router;

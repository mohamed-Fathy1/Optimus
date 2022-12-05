const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bcrypt = require("bcrypt");

//----------

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// & routes variables
var gradeseRouter = require("./routes/grades");
var studentRouter = require("./routes/student");
var courseseRouter = require("./routes/courses");
var examsRouter = require("./routes/exams");
var questionsRouter = require("./routes/questions");
var scoreRouter = require("./routes/score");
var reviewRouter = require("./routes/review");
var announcementsRouter = require("./routes/announcements");

// & use routes endpoints
app.use("/grades", gradeseRouter);
app.use("/students", studentRouter);
app.use("/courses", courseseRouter);
app.use("/exams", examsRouter);
app.use("/questions", questionsRouter);
app.use("/score", scoreRouter);
app.use("/review", reviewRouter);
app.use("/announcements", announcementsRouter);

// // & connect to database
// const URL = 'mongodb+srv://essamayman:UaM7kxXwCkUCp4pB@optimusevaluation.m3tro.mongodb.net/?retryWrites=true&w=majority'
// // const URL = process.env.ATLAS_URL;

// mongoose.connect(URL,{useNewUrlParser: true, useUnifiedTopology: true });
// const connection = mongoose.connection;
// connection.once('open',()=>{
//     console.log('connected to database');
// })

var MongoClient = require("mongodb").MongoClient;

// & listen on port...
app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});

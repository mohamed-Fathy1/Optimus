import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import "./AttemptQuiz.css";
import icon from "../img/Checkbox.png";
import { QuizList } from "./QuizList";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import "./Quiz.css";
import { QuizInfo } from "./QuizInfo";
import img from "../img/Mask Group 2.png";
import { Link } from "react-router-dom";
import axios from "axios";

const AttemptQuiz = () => {
  let animat = 0.2;
  let history = useHistory();
  let scorePoints = 0;
  let interval;
  let temp_array = [];
  const [time, settime] = useState();
  const helfTime = time / 2;
  const [half, sethalf] = useState(false);
  const [seconds, setseconds] = useState();
  const [items, setItems] = useState([]);
  const [finished, setfinished] = useState();
  const [attempted, setattempted] = useState();
  const [scoreP, setScore] = useState(0);
  const [timerHours, setTimerHours] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [totalScore, settotalScore] = useState();
  const [examInfo, setexamInfo] = useState({});
  const [questions, setquestions] = useState([]);
  const [lastScore, setlastScore] = useState();
  const [submittedTime, setsubmittedTime] = useState();
  const [loading, setloading] = useState(false);
  const [loading2, setloading2] = useState(false);
  var countdown;
  // const savedData = JSON.parse(window.localStorage.getItem("save"));
  const data = JSON.parse(window.localStorage.getItem("user"));
  const std_id = data.id;
  const exam_id = localStorage.getItem("exam_id");
  const exam_type = localStorage.getItem("exam_type");
  const exam_number = localStorage.getItem("exam_number");
  const exam_name = exam_type + exam_number;
  const course_id = localStorage.getItem("current_course_view");

  const score = () => {
    clearInterval(countdown);
    questions?.map((Answers, index) => {
      if (items[index] == Answers.correct_answer) {
        scorePoints = scorePoints + Answers.points;
      }
    });
    setlastScore(scorePoints);
    setsubmittedTime(new Date());
    console.log(scorePoints);

    axios
      .patch("http://localhost:5000/score", {
        std_id: std_id,
        exam_id: exam_id,
        score: scorePoints,
        finished: true,
        status: "Finished",
        submitted_on: new Date(),
      })
      .then((res) => {
        if (res.data) {
          setfinished(true);
        }
      })
      .catch((err) => console.error(err));

    axios
      .patch("http://localhost:5000/grades", {
        std_id: std_id,
        course_id: course_id,
        score: scorePoints,
        type: exam_type,
        title: exam_name,
        exam_number: exam_number,
      })
      .then((res) => {
        if (res.data) {
        }
      })
      .catch((err) => console.error(err));
  };

  const addHandler = (index, name) => {
    items[index] = name;
    setItems([...items], items);
    // const exam_id = localStorage.getItem("exam_id");
    axios
      .patch("http://localhost:5000/exams/" + std_id, {
        exam_id: exam_id,
        items: items,
      })
      .then((res) => {
        if (res.data) {
        }
      })
      .catch((err) => console.error(err));

    console.log(items);
  };

  useEffect(() => {
    if (questions.length != 0) {
      localStorage.setItem("questions", JSON.stringify(questions));
    }
  }, [questions]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/exams/" + exam_id)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setexamInfo(res.data);
          setfinished(res.data.trial.finished);
          setattempted(res.data.trial.attempted);
          let now = new Date().getTime();
          let last = new Date(res.data.trial.started_time).getTime();
          let difference = parseInt((now - last) / 1000);
          console.log(difference);
          //parseInt((start2.getTime()-start.getTime())/1000)
          setseconds(res.data.time_in_seconds - difference);
          settime(res.data.time_in_seconds);
          settotalScore(res.data.points);
          setItems(res.data.trial.chosen_answers);
        }
        setloading2(true);
      })
      .catch((err) => console.error(err));
    //***********************
    axios
      .post("http://localhost:5000/score", {
        std_id: std_id,
        exam_id: exam_id,
      })
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          setlastScore(res.data.score);
          setsubmittedTime(res.data.submitted_on);
          console.log(res.data.submitted_on);
        }
        setloading(true);
      })
      .catch((err) => console.error(err));

    //************** *
  }, []);

  useEffect(() => {
    const savedQuestions = JSON.parse(localStorage.getItem("questions"));
    setquestions(savedQuestions);
    console.log(items);
  }, []);

  // useEffect(() => {
  //   window.localStorage.setItem("save", JSON.stringify(items));
  // }, [items]);

  useEffect(() => {
    if (!finished && attempted) {
      countdown = setInterval(() => {
        "use strict";
        startTimer();
      }, 1000);
      return () => clearInterval(countdown);
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [finished]);

  const startTimer = () => {
    "use strict";
    var hours = Math.floor(Math.floor(seconds / 60) / 60);
    var minutes = Math.floor(seconds / 60) % 60;
    var remSeconds = seconds % 60;
    setTimerHours(hours);
    setTimerMinutes(minutes);
    setTimerSeconds(remSeconds);
    // localStorage.setItem("countdown", seconds);
    if (seconds == Math.floor(helfTime)) {
      sethalf(true);
    }

    if (seconds > 0) {
      setseconds(seconds - 1);
    } else {
      clearInterval(countdown);
    }

    if (minutes <= 0 && seconds <= 0) {
      // finishTimer = "Time Limit";
      score();
      // setFinsed(false);
      clearInterval(countdown);
    }
  };
  return (
    <>
      <Navbar></Navbar>
      <div className="course-path course-path-quiz">
        <h3>
          <a href="/home">Home</a> <i class="fa-solid fa-angle-right"></i>
          <a href="/course">Courses</a> <i class="fa-solid fa-angle-right"></i>
          <a href="/courseWork">
            {localStorage.getItem("current_course_name")}
          </a>{" "}
          <i class="fa-solid fa-angle-right"></i>
          <a className="this-course" href="">
            {localStorage.getItem("exam_name")}
          </a>
        </h3>
      </div>
      <div>
        {!attempted && !finished && loading ? (
          <>
            <Quiz
              exam_id={exam_id}
              attempted={attempted}
              setquestions={setquestions}
              examInfo={examInfo}
              setattempted={setattempted}
              temp_array={temp_array}
              setseconds={setseconds}
              setloading2={setloading2}
            ></Quiz>
          </>
        ) : !finished && attempted && loading && loading2 ? (
          <>
            <div style={!half ? { display: "none" } : {}} className="half-time">
              <div className="close-half">
                <i onClick={() => sethalf(false)} className="fas fa-times"></i>
              </div>
              <h2>Half the time is up!</h2>
            </div>
            {/* <div className="timer">
              <h3 className="started">
                Started on:
                <span> 00:23:55</span>
              </h3>
              <h3 className="remaining">
                Remaining Time:
                <span> 00:23:55</span>
              </h3>
            </div> */}
            <div className="quiz-page">
              <div className="quiz-question-container">
                {questions?.map((details, index) => {
                  // console.log(details.options);
                  animat = animat + 0.4;
                  // console.log(index);
                  // console.log(details);
                  return (
                    <div
                      key={index}
                      style={{
                        animation: `delete ${animat}s ease-in-out 0s`,
                      }}
                      id={index}
                      className="quiz-question"
                    >
                      <div className="question-number">
                        <h2>Question {details.number}</h2>
                        <h3>{details.points} point</h3>
                      </div>
                      <div className="question">
                        <p>{details.question_head}</p>
                      </div>
                      {details.options?.map((mcqAnswers, number) => {
                        return (
                          <div key={number} className="mcq-answers">
                            <ul>
                              <li>
                                <label>
                                  <input
                                    checked={
                                      items[index] === mcqAnswers ? true : false
                                    }
                                    type="radio"
                                    name={index}
                                    value=""
                                    onChange={() => {
                                      addHandler(index, mcqAnswers);
                                    }}
                                  />
                                  {mcqAnswers}
                                </label>
                              </li>
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              <div className="answer-quick-accses-container">
                <h3 className="remaining-time">
                  Remaining Time
                  <span
                    style={
                      seconds < 60 ? { color: "#a70000" } : { color: "black" }
                    }
                  >
                    {timerHours < 10 && timerHours > 0
                      ? " " + "0" + timerHours + " : "
                      : timerHours >= 10
                      ? " " + timerHours + " : "
                      : ""}
                    {timerMinutes < 10
                      ? " " + "0" + timerMinutes + " : "
                      : " " + timerMinutes + " : "}
                    {timerSeconds < 10 ? "0" + timerSeconds : timerSeconds}
                  </span>
                </h3>
                <h2>Questions</h2>
                <div className="questions-selector-container">
                  {questions?.map((answernumber, index) => {
                    return (
                      <div className="questions-selector">
                        <a href={"#" + index}>
                          <div className="number">
                            <h3>{answernumber.number}</h3>
                          </div>
                          <div
                            className={classNames("check-mark", {
                              "check-marked":
                                items[index] != null ||
                                items[index] != undefined,
                            })}
                          ></div>
                        </a>
                      </div>
                    );
                  })}
                </div>
                <div className="finish">
                  <button onClick={() => score()}>Finish Attempt</button>
                </div>
              </div>
            </div>
          </>
        ) : finished && loading && loading2 ? (
          <>
            <div className="quiz-summary-container">
              <div className="summary-header">
                <h1>Summary of your previous attempts</h1>
              </div>
              <div className="summary-table">
                <table>
                  <tr>
                    <th>Attempt</th>
                    <th className="table-border-left">State</th>
                    <th className="table-border-left">
                      Grade / {totalScore}.00
                    </th>
                    <th className="table-border-left">Review</th>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td className="td-flex table-border-left">
                      <span>Finished</span>
                      <span>
                        Submitted in{" "}
                        {new Date(submittedTime).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        ,{" "}
                        {new Date(submittedTime).toLocaleTimeString("en-US", {
                          hour12: true,
                          timeStyle: "medium",
                        })}
                      </span>
                    </td>
                    <td className="table-border-left">
                      {lastScore?.toFixed(2)}
                    </td>
                    <td className="table-border-left">
                      <Link to="/reviewQuiz">
                        <a href="">Review</a>
                      </Link>
                    </td>
                  </tr>
                </table>
              </div>
              <div className="summary-grade">
                <h1>
                  Your Grade for this Quiz is {lastScore.toFixed(2)}/
                  {totalScore}.00
                </h1>
                <div className="summary-button">
                  <button onClick={() => history.push("/home")}>
                    Back Home
                  </button>
                  <button onClick={() => history.push("/reviewQuiz")}>
                    Review Quiz
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="loader-margin">
            <div class="loader">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
const Quiz = ({
  exam_id,
  attempted,
  setquestions,
  setattempted,
  examInfo,
  temp_array,
  setseconds,
  setloading2,
}) => {
  // console.log(examInfo.questions);
  setloading2(false);
  return (
    <div className="quiz">
      <div className="quiz-header">
        <h1>{localStorage.getItem("exam_name")}</h1>
        <button
          onClick={() => {
            const data = JSON.parse(window.localStorage.getItem("user"));
            const std_id = data.id;
            //-----------------------

            axios
              .patch("http://localhost:5000/exams", {
                std_id: std_id,
                exam_id: exam_id,
                attempted: true,
                date: new Date(),
              })
              .then((res) => {
                if (res.data) {
                }
              })
              .catch((err) => console.error(err));
            //-----------------------
            setattempted(true);

            axios
              .post("http://localhost:5000/questions", {
                questions: examInfo.questions,
              })
              .then((res) => {
                if (res.data) {
                  res.data.forEach((Element, index) => {
                    temp_array[index] = Element;
                  });
                  setquestions(temp_array);
                  console.log(temp_array);
                  setloading2(true);
                }
              })
              .catch((err) => console.error(err));

            axios
              .post("http://localhost:5000/questions/" + exam_id)
              .then((res) => {
                if (res.data) {
                  setseconds(res.data);
                }
              })
              .catch((err) => console.error(err));
          }}
          className="attempt"
        >
          {" "}
          Attempt {localStorage.getItem("exam_name")}
        </button>
      </div>
      <div className="quiz-info">
        <div>
          <h3>Points</h3>
          <p>{examInfo.points}</p>
        </div>
        <div>
          <h3>Questions</h3>
          <p>{examInfo.no_of_questions}</p>
        </div>
        <div>
          <h3>Start time</h3>
          <p>
            {new Date(examInfo.start_time).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            ,{" "}
            {new Date(examInfo.start_time).toLocaleTimeString("en-US", {
              hour12: true,
              timeStyle: "medium",
            })}
          </p>
        </div>
        <div>
          <h3>End time</h3>
          <p>
            {new Date(examInfo.end_time).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            ,{" "}
            {new Date(examInfo.end_time).toLocaleTimeString("en-US", {
              hour12: true,
              timeStyle: "medium",
            })}
          </p>
        </div>
        <div>
          <h3>Time Limit</h3>
          <p>{examInfo.Time_limit} Minutes</p>
        </div>
        <div>
          <h3>Attempts Allowed</h3>
          <p>{examInfo.attempts_allowed}</p>
        </div>
      </div>
      <div className="quiz-instructions">
        <h1>Instructions</h1>
      </div>
      <div className="important-instructions">
        <img src={img} alt="" />
        <h3>Important Instructions</h3>
      </div>
      <div className="important-list">
        {/* {examInfo.instructions.forEach((details, index) => {
          return (
            <ul key={index}>
              <li>{details[index]}</li>
            </ul>
          );
        })} */}
        <ul>
          {examInfo.instructions?.map((details, index) => {
            return <li key={index}>{details}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default AttemptQuiz;

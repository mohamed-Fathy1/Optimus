import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import "./AttemptQuiz.css";
import icon from "../img/true.png";
import icon1 from "../img/false.png";
import icon2 from "../img/Checkbox.png";
import icon3 from "../img/Union 3.png";
import { QuizList } from "./QuizList";
import classNames from "classnames";
import axios from "axios";
import { useHistory } from "react-router-dom";

function ReviewQuiz() {
  let history = useHistory();
  let animat = 0.2;
  const [answers, setanswers] = useState([]);
  const [startedOn, setstartedOn] = useState();
  const [submittedOn, setsubmittedOn] = useState();
  const [grade, setgrade] = useState();
  const [totalGrade, settotalGrade] = useState();
  const [seconds, setseconds] = useState();
  const [minutes, setminutes] = useState();

  const [loading, setloading] = useState(false);
  const questionsData = JSON.parse(window.localStorage.getItem("questions"));
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const data = JSON.parse(window.localStorage.getItem("user"));
  const std_id = data.id;
  const exam_id = localStorage.getItem("exam_id");

  useEffect(() => {
    axios
      .post("http://localhost:5000/review", {
        exam_id: exam_id,
        std_id: std_id,
      })
      .then((res) => {
        if (res.data) {
          setanswers(res.data.trial.chosen_answers);
          setstartedOn(res.data.trial.started_time);
          let start = new Date(res.data.trial.started_time);
          let submit = new Date(res.data.trial.submitted_on);
          // let difference = parseInt((submit - start) / 1000);
          let difference = new Date(submit - start);
          setseconds(difference.getSeconds());
          setminutes(difference.getMinutes());
          console.log(minutes);
          console.log(seconds);
          console.log(difference);
          setsubmittedOn(res.data.trial.submitted_on);
          setgrade(res.data.trial.score);
          settotalGrade(res.data.points);
          console.log(res.data);
          console.log(answers);
        }
        setloading(true);
      })
      .catch((err) => console.error(err));
  }, []);

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
          <a className="this-course" href="/quiz">
            {localStorage.getItem("exam_name")}
          </a>
        </h3>
      </div>
      {loading ? (
        <div>
          <div className="quiz-review-info-continer">
            <div className="quiz-review-info">
              <div>
                <h3>Started on:</h3>
                <p>
                  {" "}
                  {new Date(startedOn).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  ,{" "}
                  {new Date(startedOn).toLocaleTimeString("en-US", {
                    hour12: true,
                    timeStyle: "medium",
                  })}
                </p>
              </div>
            </div>
            <div className="quiz-review-info">
              <div>
                <h3>Time Taken:</h3>
                <p>
                  {minutes} minutes {seconds} seconds
                </p>
              </div>
            </div>
            <div className="quiz-review-info">
              <div>
                <h3>Submitted on: </h3>
                <p>
                  {" "}
                  {new Date(submittedOn).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  ,{" "}
                  {new Date(submittedOn).toLocaleTimeString("en-US", {
                    hour12: true,
                    timeStyle: "medium",
                  })}
                </p>
              </div>
            </div>
            <div className="quiz-review-info">
              <div>
                <h3>State:</h3>
                <p>Finished</p>
              </div>
            </div>
            <div className="quiz-review-info">
              <div>
                <h3>Grade:</h3>
                <p>
                  {" "}
                  {grade?.toFixed(2)} / {totalGrade?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="quiz-page">
            <div className="quiz-question-container">
              {questionsData?.map((details, index) => {
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
                      <h2>Question {index + 1}</h2>
                      <h3>{details.points} Points</h3>
                    </div>
                    <div className="question">
                      <p>{details.question_head}</p>
                    </div>
                    {details.options?.map((mcqAnswers, number) => {
                      return (
                        <>
                          <div className="mcq-answers">
                            <ul>
                              <li>
                                <label
                                  style={
                                    answers[index] == mcqAnswers
                                      ? { fontWeight: "700" }
                                      : {}
                                  }
                                >
                                  <input
                                    checked={
                                      answers[index] === mcqAnswers
                                        ? true
                                        : false
                                    }
                                    type="radio"
                                    name={index}
                                    disabled="true"
                                    value=""
                                  />
                                  {mcqAnswers}
                                  <div className="correct-false">
                                    <img
                                      src={
                                        answers[index] ==
                                          details.correct_answer &&
                                        details.correct_answer == mcqAnswers
                                          ? icon2
                                          : answers[index] !=
                                              details.correct_answer &&
                                            answers[index] == mcqAnswers
                                          ? icon3
                                          : details.correct_answer ==
                                              mcqAnswers &&
                                            answers[index] !=
                                              details.correct_answer
                                          ? icon2
                                          : {}
                                      }
                                      alt=""
                                    />
                                  </div>
                                </label>{" "}
                              </li>
                            </ul>
                          </div>
                        </>
                      );
                    })}
                    <div className="correct-answer">
                      <h4
                        style={
                          answers[index] == details.correct_answer
                            ? { color: "#52D38C" }
                            : { color: "#ED4F4F" }
                        }
                      >
                        The Correct Answer is: {" " + details.correct_answer}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="answer-quick-accses-container">
              <h2>Questions</h2>
              <div className="questions-selector-container">
                {questionsData?.map((answernumber, index) => {
                  return (
                    <div className="questions-selector">
                      <a href={"#" + index}>
                        <div className="number">
                          <h3>{index + 1}</h3>
                        </div>
                        <div
                          className={classNames("check-mark", {
                            "check-marked": answers[index] != undefined,
                          })}
                          style={
                            answers[index] == answernumber.correct_answer
                              ? { backgroundColor: "#52D38C" }
                              : { backgroundColor: "#ED4F4F" }
                          }
                        >
                          <img
                            src={
                              answers[index] == answernumber.correct_answer
                                ? icon
                                : icon1
                            }
                            alt=""
                          />
                        </div>
                      </a>
                    </div>
                  );
                })}
              </div>
              <div className="finish">
                <button onClick={() => history.push("/Quiz")}>
                  Finish Review
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="loader-margin">
          <div class="loader">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </>
  );
}

export default ReviewQuiz;

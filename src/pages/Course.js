import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import "./Course.css";
import { CourseworkList } from "./CourseworkList";
import img1 from "../img/test-quiz-svgrepo-com.png";
import img2 from "../img/task-assignment-task-homework-assignment-svgrepo-com.png";
import img3 from "../img/Path 519.png";
import axios from "axios";
import { useHistory } from "react-router-dom";
import classNames from "classnames";

const Course = () => {
  const [click, setClick] = useState({
    couresWork: true,
    courseContent: false,
  });
  let temp_array = [];
  const [ExamsArray, setExams] = useState([]);
  const [ExamsFilter, setExamsFilter] = useState([]);
  const [filterState, setfilterState] = useState("All");
  const [loading, setloading] = useState(false);
  const examsList = JSON.parse(window.localStorage.getItem("current_exams"));
  const currentCourseName = window.localStorage.getItem("current_course_name");

  useEffect(() => {
    const data = JSON.parse(window.localStorage.getItem("user"));
    const std_id = data.id;
    console.log(std_id);
    axios
      .post("http://localhost:5000/exams", { exams: examsList, std_id: std_id })
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          res.data.forEach((Element, index) => {
            temp_array[index] = Element;
          });
          setloading(true);
          setExams(temp_array);
          setExamsFilter(ExamsArray);
          console.log(temp_array);
          console.log(ExamsArray);
        }
      })
      .catch((err) => console.error(err));
    window.scrollTo(0, 0);
  }, []);

  const couresWorkClick = () => {
    return setClick({ couresWork: true, courseContent: false });
  };

  const courseContentClick = () => {
    return setClick({ couresWork: false, courseContent: true });
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="course-header">
        <div className="course-path">
          <h3>
            <a href="/home">Home</a> <i class="fa-solid fa-angle-right"></i>
            <a href="/course">Courses</a>{" "}
            <i class="fa-solid fa-angle-right"></i>
            <a className="this-course" href="">
              {currentCourseName}
            </a>
          </h3>
        </div>
        <div className="course-option">
          <div
            className="courseContent"
            style={
              click.courseContent
                ? { backgroundColor: "#E2EDFF" }
                : { backgroundColor: "#fff" }
            }
            onClick={courseContentClick}
          >
            <h3>Course Content</h3>
          </div>
          <div
            className="courseWork"
            style={
              click.couresWork
                ? { backgroundColor: "#E2EDFF" }
                : { backgroundColor: "#fff" }
            }
            onClick={couresWorkClick}
          >
            <h3>Coursework</h3>
          </div>
        </div>
      </div>
      <div>
        {click.couresWork ? (
          <Coursework
            ExamsArray={ExamsArray}
            setExams={setExams}
            ExamsFilter={ExamsFilter}
            setExamsFilter={setExamsFilter}
            temp_array={temp_array}
            filterState={filterState}
            setfilterState={setfilterState}
            loading={loading}
          ></Coursework>
        ) : (
          <>
            <CourseContent></CourseContent>
          </>
        )}
      </div>
    </>
  );
};

const Coursework = ({
  ExamsArray,
  setExams,
  ExamsFilter,
  setExamsFilter,
  temp_array,
  filterState,
  setfilterState,
  loading,
}) => {
  let animat = 0.1;

  let history = useHistory();
  if (filterState == "All") {
    setExamsFilter(ExamsArray);
  }
  return (
    <>
      {/* <Quiz></Quiz> */}
      <div className="coursework-filter">
        <li>
          <a
            style={
              filterState == "All"
                ? { borderBottom: "solid #1492e6", color: "black" }
                : {}
            }
            onClick={() => {
              setExamsFilter(ExamsArray);
              setfilterState("All");
            }}
            className="filter-link"
          >
            All
          </a>
        </li>
        <li>
          <a
            style={
              filterState == "assignment"
                ? { borderBottom: "solid #1492e6", color: "black" }
                : {}
            }
            onClick={() => {
              const AssinmentsArray = ExamsArray.filter(function (e) {
                return e.type === "assignment";
              });
              setExamsFilter(AssinmentsArray);
              setfilterState("assignment");
            }}
            className="filter-link"
          >
            Assignments
          </a>
        </li>
        <li>
          <a
            style={
              filterState == "quiz"
                ? { borderBottom: "solid #1492e6", color: "black" }
                : {}
            }
            onClick={() => {
              const AssinmentsArray = ExamsArray.filter(function (e) {
                return e.type === "quiz";
              });
              console.log(AssinmentsArray);
              setExamsFilter(AssinmentsArray);
              setfilterState("quiz");
            }}
            className="filter-link"
          >
            Quizes
          </a>
        </li>
        <li>
          <a
            style={
              filterState == "exam"
                ? { borderBottom: "solid #1492e6", color: "black" }
                : {}
            }
            onClick={() => {
              const AssinmentsArray = ExamsArray.filter(function (e) {
                return e.type === "midterm" || e.type === "final";
              });
              console.log(AssinmentsArray);
              setExamsFilter(AssinmentsArray);
              console.log(ExamsFilter);
              setfilterState("exam");
            }}
            className="filter-link"
          >
            Exams
          </a>
        </li>
      </div>
      <div className="coursework">
        <div className="coursework-data">
          {loading ? (
            ExamsFilter != "" ? (
              ExamsFilter.map((details, index) => {
                animat = animat + 0.3;
                console.log(ExamsFilter);
                return (
                  <div
                    style={{
                      animation: `delete ${animat}s ease-in-out 0s`,
                    }}
                    onClick={() => {
                      localStorage.setItem("questionsID", details.questions);
                      localStorage.setItem("exam_type", details.type);
                      //----------------------------
                      axios
                        .post("http://localhost:5000/questions", {
                          questions: details.questions,
                        })
                        .then((res) => {
                          if (res.data) {
                            res.data.forEach((Element, index) => {
                              temp_array[index] = Element;
                            });
                            localStorage.setItem(
                              "questions",
                              JSON.stringify(temp_array)
                            );
                            console.log(temp_array);
                          }
                        })
                        .catch((err) => console.error(err));
                      //----------------------------

                      localStorage.setItem("exam_id", details.exam_id);
                      localStorage.setItem("exam_name", details.title);
                      localStorage.setItem("exam_number", details.number);
                      history.push("/Quiz");
                    }}
                    key={index}
                    className="coursework-details"
                  >
                    <div className="coursework-img">
                      <img
                        src={
                          details.type === "assignment"
                            ? img1
                            : details.type === "quiz"
                            ? img2
                            : img3
                        }
                        alt=""
                      />
                    </div>
                    <div className="coursework-text">
                      <h2>{details.title}</h2>
                      <p>
                        <span>Attempts: {details.attempts_allowed}</span>{" "}
                        <i>|</i>
                        <span>Points: {details.points}</span>
                        <i>|</i>
                        <span>Time limit: {details.Time_limit}</span>
                      </p>
                    </div>
                    <h3
                      className={classNames({
                        "green-finished": details.trial.status === "Finished",
                        "gray-finished":
                          details.trial.status === "Not Finished",
                      })}
                    >
                      {details.trial.status}
                    </h3>
                    <div className="coursework-grade">
                      <h3>
                        {details.trial.finished == true ? (
                          <>Grade: {details.trial.score}</>
                        ) : (
                          <></>
                        )}
                      </h3>
                      <div></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-coursework">
                <img src={img1} alt="" />
                <h2>No upcoming activities due</h2>
              </div>
            )
          ) : (
            <div class="loader">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
const CourseContent = () => {
  return (
    <div className="courseContent-contanier">
      <h1>Coures Contant</h1>
    </div>
  );
};
export default Course;

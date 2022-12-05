import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar/Navbar";
import "./Grades.css";
import axios from "axios";
import * as ReactBootStrap from "react-bootstrap";

function Grades() {
  const [grades, setGrades] = useState([]);
  const [loading, setloading] = useState(false);
  const [gradeFilter, setgradeFilter] = useState("All");
  const [dropdownGrade, setdropdownGrade] = useState(false);
  const [gradesFilter, setgradesFilter] = useState([]);
  const [info, setinfo] = useState(-1);
  const [info1, setinfo1] = useState(-1);
  const [info2, setinfo2] = useState(-1);
  const [info3, setinfo3] = useState(-1);
  const [info4, setinfo4] = useState(-1);
  const [info5, setinfo5] = useState(-1);
  const [info6, setinfo6] = useState(-1);
  const [info7, setinfo7] = useState(-1);
  const [info8, setinfo8] = useState(-1);
  const [info9, setinfo9] = useState(-1);
  const [info10, setinfo10] = useState(-1);
  const [info11, setinfo11] = useState(-1);
  let temp_array = [];
  let animat = 0.2;
  const coursesRef = useRef();
  const gradeRef = useRef();
  const felteresRef = useRef();
  useEffect(() => {
    const closeDropdown = (e) => {
      console.log(e);
      console.log(e.path[0].tagName);
      console.log(coursesRef.current);
      console.log(e.path[0]);
      if (
        e.path[0] !== coursesRef.current &&
        e.path[0] !== gradeRef.current &&
        e.path[0] !== felteresRef.current
      ) {
        setdropdownGrade(false);
      }
    };
    document.body.addEventListener("click", closeDropdown);

    return () => document.body.removeEventListener("click", closeDropdown);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const data = JSON.parse(window.localStorage.getItem("user"));
    const std_id = data.id;
    axios
      .post("http://localhost:5000/grades", { std_id: std_id })
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          res.data.forEach((Element, index) => {
            //----------fuzzy rquest-----------------
            let attendence = Element.attendance * 10;
            let internal_marks =
              (Element.assignments + Element.quizzes + Element.midterm) * 2.5;
            let external_marks = Element.final * 2;
            axios
              .post(
                "http://localhost:8000/optimus",
                {
                  attendence: attendence,
                  internal_marks: internal_marks,
                  external_marks: external_marks,
                  student_id: Element.student_id,
                  course_id: Element.course_id,
                },
                {
                  headers: {
                    "Access-Control-Allow-Origin": "*",
                  },
                }
              )
              .then((res) => {
                if (res.data) {
                  axios
                    .post("http://localhost:5000/grades", { std_id: std_id })
                    .then((res) => {
                      console.log(res.data);
                      if (res.data) {
                        res.data.forEach((Element, index) => {
                          temp_array[index] = Element;
                        });
                        console.log(temp_array);
                        setGrades(temp_array);
                        setgradesFilter(temp_array);
                        console.log(grades);
                      }
                      setloading(true);
                    })
                    .catch((err) => console.error(err));
                }
              })
              .catch((err) => console.error(err));
            //--------------------------------
            // temp_array[index] = Element;
          });
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <div className="course-path course-path-grades">
        <h3>
          <a href="/home">Home</a> <i class="fa-solid fa-angle-right"></i>
          <a className="this-course" href="">
            Grades
          </a>
        </h3>
      </div>
      <div className="grades-page">
        <div className="grades-page-container">
          {/* <div className="grades-container">
            <h2>Your Overall Grade</h2>
            <h1>B+</h1>
            <h5>points</h5>
            <h4>313 / 330</h4>
          </div> */}

          {loading ? (
            <div className="filter-grade-container">
              <div
                className="grade-filter"
                ref={gradeRef}
                onClick={() => {
                  document.getElementById("grade-filter").scrollTo(0, 0);
                  setdropdownGrade((prev) => !prev);
                }}
              >
                <h4 ref={felteresRef}>{gradeFilter}</h4>
                <i className="fa-solid fa-filter" ref={coursesRef}></i>
                <div
                  id="grade-filter"
                  className={
                    dropdownGrade ? "dropdown-grade active" : "dropdown-grade"
                  }
                >
                  <h4
                    onClick={() => {
                      setgradeFilter("All");
                      setgradesFilter(grades);
                    }}
                  >
                    All
                  </h4>
                  {grades?.map((details, index) => {
                    return (
                      <h4
                        onClick={() => {
                          setgradeFilter(details.course_name);
                          const gradesArray = grades.filter(function (e) {
                            return e.course_name === details.course_name;
                          });
                          setgradesFilter(gradesArray);
                        }}
                      >
                        {details.course_name}
                      </h4>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          {loading ? (
            gradesFilter.map((details, index) => {
              console.log(details);
              animat = animat + 0.3;
              return (
                <div
                  className="grades-table-container"
                  style={{
                    animation: `delete ${animat}s ease-in-out 0s`,
                  }}
                >
                  <div className="title-name">
                    <h2>
                      Course: {details.course_name} - Spring Semester -
                      2021/2022
                    </h2>
                  </div>
                  <table>
                    <tr className="table-header">
                      <th>Grade Item</th>
                      <th>Points</th>
                      <th>Weight</th>
                      <th>Comments</th>
                    </tr>
                    <tr>
                      <td>Attendance</td>
                      <td>{details.attendance}.00 / 10.00</td>
                      <td>10%</td>
                      <td className="grade-comment">
                        {/* {details.attendance <= 3 ? (
                          <RenderComment
                            info={info}
                            setinfo={setinfo}
                            index={index}
                            color="#cc2d2d"
                            icon="fa-exclamation"
                            performance="poor"
                            comment1="Your attendance grade indicates for "
                            comment2=" performance, make sure to attend more classes"
                          ></RenderComment>
                        ) : details.attendance > 4 &&
                          details.attendance <= 5 ? (
                          <RenderComment
                            info={info}
                            setinfo={setinfo}
                            index={index}
                            color="#fac92a"
                            icon="fa-exclamation"
                            performance="average"
                            comment1="Your attendance grade indicates for "
                            comment2=" performance, make sure to attend more classes"
                          ></RenderComment>
                        ) : details.attendance >= 9 ? (
                          <RenderComment
                            info={info}
                            setinfo={setinfo}
                            index={index}
                            color="#2db542"
                            icon="fa-check"
                            performance="excellent"
                            comment1="Great work, keep going "
                            comment2=" performance, make sure to attend more classes"
                          ></RenderComment>
                        ) : (
                          <></>
                        )} */}
                        -
                      </td>
                    </tr>
                    <tr>
                      <td>Assignments</td>
                      <td>
                        {details.finished.assignment1 &&
                        details.finished.assignment2 ? (
                          <>{details.assignments.toFixed(2)} / 10.00</>
                        ) : details.finished.assignment1 &&
                          !details.finished.assignment2 ? (
                          <>{details.assignments.toFixed(2)} / 5.00</>
                        ) : (
                          <>-</>
                        )}
                      </td>
                      <td>10%</td>
                      <td className="grade-comment">
                        {/* display warnning / advice comments */}
                        {(details.assignments <= 3 &&
                          details.finished.assignment2) ||
                        (details.assignments <= 2 &&
                          !details.finished.assignment2 &&
                          details.finished.assignment1) ? (
                          <RenderComment
                            info={info1}
                            setinfo={setinfo1}
                            index={index}
                            color="#cc2d2d"
                            icon="fa-exclamation"
                            performance="poor"
                            comment1="Your assignments grade indicates for "
                            comment2=" performance, make sure to pay more attention"
                          ></RenderComment>
                        ) : (details.assignments > 4 &&
                            details.assignments <= 6 &&
                            details.finished.assignment2) ||
                          (details.assignments == 3 &&
                            !details.finished.assignment2 &&
                            details.finished.assignment1) ? (
                          <RenderComment
                            info={info1}
                            setinfo={setinfo1}
                            index={index}
                            color="#fac92a"
                            icon="fa-exclamation"
                            performance="average"
                            comment1="be carefull Your assignments grade indicates for "
                            comment2=" performance, make sure to pay more attention"
                          ></RenderComment>
                        ) : (details.assignments >= 9 &&
                            details.finished.assignment2) ||
                          (details.assignments == 5 &&
                            !details.finished.assignment2 &&
                            details.finished.assignment1) ? (
                          <RenderComment
                            info={info1}
                            setinfo={setinfo1}
                            index={index}
                            color="#2db542"
                            icon="fa-check"
                            performance="excellent"
                            comment1="Great work, Your assignment grades indicates for "
                            comment2=" performance, keep going"
                          ></RenderComment>
                        ) : (
                          <>-</>
                        )}
                        {/* display and arrow if the grades is 
                        increasing or decreasing comments */}
                        {details.finished.assignment2 &&
                        details.assignment2 / 5 - details.midterm / 20 > 0 ? (
                          <PerformanceComment
                            info={info7}
                            setinfo={setinfo7}
                            index={index}
                            color="green"
                            deffrence={
                              (
                                details.assignment2 / 5 -
                                details.midterm / 20
                              ).toFixed(2) * 100
                            }
                            comment1="You got a performance increase by "
                            comment2=" in assignment 2 compared to the midterm"
                            logoClass="performance-comment-increase"
                          ></PerformanceComment>
                        ) : details.finished.assignment2 &&
                          details.assignment2 / 5 - details.midterm / 20 < 0 ? (
                          <PerformanceComment
                            info={info7}
                            setinfo={setinfo7}
                            index={index}
                            color="red"
                            deffrence={
                              (
                                details.assignment2 / 5 -
                                details.midterm / 20
                              ).toFixed(2) * 100
                            }
                            comment1="You got a performance decrease by "
                            comment2=" in assignment 2 compared to the midterm"
                            logoClass="performance-comment-decrease"
                          ></PerformanceComment>
                        ) : (
                          <></>
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td>Quizes</td>
                      <td>
                        {details.finished.quiz1 && details.finished.quiz2 ? (
                          <>{details.quizzes.toFixed(2)} / 10.00</>
                        ) : details.finished.quiz1 &&
                          !details.finished.quiz2 ? (
                          <>{details.quizzes.toFixed(2)} / 5.00</>
                        ) : (
                          <>-</>
                        )}
                      </td>
                      <td>10%</td>
                      <td className="grade-comment">
                        {(details.quizzes <= 3 && details.finished.quiz2) ||
                        (details.quizzes <= 2 &&
                          !details.finished.quiz2 &&
                          details.finished.quiz1) ? (
                          <RenderComment
                            info={info2}
                            setinfo={setinfo2}
                            index={index}
                            color="#cc2d2d"
                            icon="fa-exclamation"
                            performance="poor"
                            comment1="Your quizzes grade indicates for "
                            comment2=" performance, make sure to pay more attention"
                          ></RenderComment>
                        ) : (details.quizzes > 4 &&
                            details.quizzes <= 5 &&
                            details.finished.quiz2) ||
                          (details.quizzes == 3 &&
                            !details.finished.quiz2 &&
                            details.finished.quiz1) ? (
                          <RenderComment
                            info={info2}
                            setinfo={setinfo2}
                            index={index}
                            color="#fac92a"
                            icon="fa-exclamation"
                            performance="average"
                            comment1="heads up Your quizzes grade indicates for "
                            comment2=" performance, make sure to pay more attention"
                          ></RenderComment>
                        ) : (details.quizzes >= 9 && details.finished.quiz2) ||
                          (details.quizzes == 5 &&
                            !details.finished.quiz2 &&
                            details.finished.quiz1) ? (
                          <RenderComment
                            info={info2}
                            setinfo={setinfo2}
                            index={index}
                            color="#2db542"
                            icon="fa-check"
                            performance="excellent"
                            comment1="Looking good, Your quizzes grades indicates for "
                            comment2=" performance, Maintain it"
                          ></RenderComment>
                        ) : (
                          <>-</>
                        )}

                        {!details.finished.quiz2 &&
                        details.finished.quiz1 &&
                        details.quiz1 - details.assignment1 > 0 ? (
                          <PerformanceComment
                            info={info8}
                            setinfo={setinfo8}
                            index={index}
                            color="green"
                            deffrence={
                              (
                                details.quiz1 / 5 -
                                details.assignment1 / 5
                              ).toFixed(2) * 100
                            }
                            comment1="You got a performance increase by "
                            comment2=" in quiz 1 compared to assignment 1"
                            logoClass="performance-comment-increase"
                          ></PerformanceComment>
                        ) : !details.finished.quiz2 &&
                          details.finished.quiz1 &&
                          details.quiz1 - details.assignment1 < 0 ? (
                          <PerformanceComment
                            info={info8}
                            setinfo={setinfo8}
                            index={index}
                            color="red"
                            deffrence={
                              (
                                details.quiz1 / 5 -
                                details.assignment1 / 5
                              ).toFixed(2) * 100
                            }
                            comment1="You got a performance decrease by "
                            comment2=" in quiz 1 compared to assignment 1"
                            logoClass="performance-comment-decrease"
                          ></PerformanceComment>
                        ) : details.finished.quiz2 &&
                          details.quiz2 - details.assignment2 > 0 ? (
                          <PerformanceComment
                            info={info8}
                            setinfo={setinfo8}
                            index={index}
                            color="green"
                            deffrence={
                              (
                                details.quiz2 / 5 -
                                details.assignment2 / 5
                              ).toFixed(2) * 100
                            }
                            comment1="You got a performance increase by "
                            comment2=" in quiz 2 compared to assignment 2"
                            logoClass="performance-comment-increase"
                          ></PerformanceComment>
                        ) : details.finished.quiz2 &&
                          details.quiz2 - details.assignment2 < 0 ? (
                          <PerformanceComment
                            info={info8}
                            setinfo={setinfo8}
                            index={index}
                            color="red"
                            deffrence={
                              (
                                details.quiz2 / 5 -
                                details.assignment2 / 5
                              ).toFixed(2) * 100
                            }
                            comment1="You got a performance decrease by "
                            comment2=" in quiz 2 compared to assignment 2"
                            logoClass="performance-comment-decrease"
                          ></PerformanceComment>
                        ) : (
                          <></>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Midterm Exam</td>
                      <td>
                        {details.finished.midterm ? (
                          <>{details.midterm.toFixed(2)} / 20.00</>
                        ) : (
                          <>-</>
                        )}
                      </td>
                      <td>20%</td>
                      <td className="grade-comment">
                        {details.finished.midterm ? (
                          details.midterm <= 10 ? (
                            <RenderComment
                              info={info3}
                              setinfo={setinfo3}
                              index={index}
                              color="#cc2d2d"
                              icon="fa-exclamation"
                              performance="poor"
                              comment1="Your midterm grade indicates for "
                              comment2=" performance, make sure to pay more attention"
                            ></RenderComment>
                          ) : details.midterm > 10 && details.midterm <= 14 ? (
                            <RenderComment
                              info={info3}
                              setinfo={setinfo3}
                              index={index}
                              color="#fac92a"
                              icon="fa-exclamation"
                              performance="average"
                              comment1="Looks like your midterm grade indicates for "
                              comment2=" performance, make sure to pay more attention"
                            ></RenderComment>
                          ) : details.midterm >= 18 ? (
                            <RenderComment
                              info={info3}
                              setinfo={setinfo3}
                              index={index}
                              color="#2db542"
                              icon="fa-check"
                              performance="excellent"
                              comment1="Looking good, Your midterm grades indicates for "
                              comment2=" performance, Maintain it"
                            ></RenderComment>
                          ) : (
                            <></>
                          )
                        ) : (
                          <>-</>
                        )}
                        {details.finished.midterm &&
                        details.midterm / 20 - details.quiz1 / 5 > 0 ? (
                          <PerformanceComment
                            info={info9}
                            setinfo={setinfo9}
                            index={index}
                            color="green"
                            deffrence={
                              (
                                details.midterm / 20 -
                                details.quiz1 / 5
                              ).toFixed(2) * 100
                            }
                            comment1="You got a performance increase by "
                            comment2=" in the midterm compared to quiz 1"
                            logoClass="performance-comment-increase"
                          ></PerformanceComment>
                        ) : details.finished.midterm &&
                          details.midterm / 20 - details.quiz1 / 5 < 0 ? (
                          <PerformanceComment
                            info={info9}
                            setinfo={setinfo9}
                            index={index}
                            color="red"
                            deffrence={
                              (
                                details.midterm / 20 -
                                details.quiz1 / 5
                              ).toFixed(2) * 100
                            }
                            comment1="You got a performance decrease by "
                            comment2=" in the midterm compared to quiz 1"
                            logoClass="performance-comment-decrease"
                          ></PerformanceComment>
                        ) : (
                          <></>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Final Exam</td>
                      <td>
                        {details.finished.final ? (
                          <>{details.final.toFixed(2)} / 50.00</>
                        ) : (
                          <>-</>
                        )}
                      </td>
                      <td>50%</td>
                      <td className="grade-comment">
                        {details.finished.final ? (
                          details.final <= 10 ? (
                            <RenderComment
                              info={info4}
                              setinfo={setinfo4}
                              index={index}
                              color="#cc2d2d"
                              icon="fa-exclamation"
                              performance="poor"
                              comment1="Your final grade indicates for "
                              comment2=" performance, make sure to pay more attention"
                            ></RenderComment>
                          ) : details.final > 10 && details.final <= 20 ? (
                            <RenderComment
                              info={info4}
                              setinfo={setinfo4}
                              index={index}
                              color="#fac92a"
                              icon="fa-exclamation"
                              performance="average"
                              comment1="Your final grade indicates for "
                              comment2=" performance, make sure to pay more attention"
                            ></RenderComment>
                          ) : details.final >= 45 ? (
                            <RenderComment
                              info={info4}
                              setinfo={setinfo4}
                              index={index}
                              color="#2db542"
                              icon="fa-check"
                              performance="excellent"
                              comment1=" "
                              comment2=" performance!"
                            ></RenderComment>
                          ) : (
                            <>-</>
                          )
                        ) : (
                          <>-</>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Preformance</td>
                      <td>
                        {details.finished.final ? (
                          <>{details.performance.toFixed(2)} %</>
                        ) : (
                          <>-</>
                        )}
                      </td>
                      <td>100%</td>
                      <td className="grade-comment">-</td>
                    </tr>
                    <tr className="table-foter">
                      <th>Final Grade</th>
                      <th>
                        {details.finished.final ? <>{details.grade}</> : <></>}
                      </th>
                      <th></th>
                      <th></th>
                    </tr>
                  </table>
                </div>
              );
            })
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
}
const RenderComment = ({
  info,
  setinfo,
  index,
  color,
  icon,
  comment1,
  comment2,
  performance,
}) => {
  return (
    <div className="grade-info-comments">
      <div
        style={{ backgroundColor: color }}
        onMouseEnter={() => setinfo(index)}
        onMouseLeave={() => setinfo(-1)}
        className="grade-info-exclamation"
      >
        <i class={`fa-solid ` + icon}></i>
        <div
          className={
            info == index
              ? "comment-info-container active"
              : "comment-info-container"
          }
        >
          <h3>
            {comment1}
            <span style={{ color: color }}>{performance}</span>
            {comment2}
          </h3>
        </div>
      </div>
    </div>
  );
};

const PerformanceComment = ({
  info,
  setinfo,
  index,
  comment1,
  comment2,
  color,
  deffrence,
  logoClass,
}) => {
  return (
    <div className="grade-performance-comments">
      <div
        onMouseEnter={() => setinfo(index)}
        onMouseLeave={() => setinfo(-1)}
        className="preformance-comment"
      >
        <i class={`fa-solid fa-arrow-up-wide-short ` + logoClass}></i>
        <div
          className={
            info == index
              ? "comment-performance-container active"
              : "comment-performance-container"
          }
        >
          <h3>
            {comment1}{" "}
            <span style={(color = { color })}>{Math.abs(deffrence)}%</span>
            {comment2}{" "}
          </h3>
        </div>
      </div>
    </div>
  );
};
export default Grades;

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import "./Courses.css";
import img from "../img/NoPath - Copy (2).png";
import img2 from "../img/icons8-group-message-48.png";
import { Dashboard } from "./Dashboard";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import axios from "axios";

function Courses() {
  let animat = 0;
  // const [delay, setDelay] = useState([]);
  let history = useHistory();
  let temp_array = [];
  const [courses, setCourses] = useState([]);
  const userData = JSON.parse(window.localStorage.getItem("user"));
  useEffect(() => {
    console.log(userData.courses);
    axios
      .post("http://localhost:5000/courses", { courses: userData.courses })
      .then((res) => {
        // console.log(res.data);
        if (res.data) {
          res.data.forEach((Element, index) => {
            temp_array[index] = Element;
            // animat[index] = animat[index] + 0.3;
            // setDelay((prev) => [...prev], animat + 0.3);
            // console.log(Element.course_name);
            // setItems([...items], items);
            // setCourses(courses.append(Element.course_name));
          });

          // console.log(animat);
          console.log(temp_array);
          setCourses(temp_array);
        }
      })
      .catch((err) => console.error(err));
  }, []);
  return (
    <>
      <Navbar></Navbar>
      <div className="courses">
        <div className="courses-header">
          <h1>Courses</h1>
        </div>
        <div className="courses-body">
          {courses.map((details, index) => {
            animat = animat + 0.2;
            console.log(animat);
            console.log(`delete 0.9s ease-in-out ${animat}s`);
            return (
              <div
                key={index}
                onClick={() => {
                  console.log(details.course_id);
                  localStorage.setItem(
                    "current_course_view",
                    details.course_id
                  );
                  localStorage.setItem(
                    "current_course_name",
                    details.course_name
                  );
                  window.localStorage.setItem(
                    "current_exams",
                    JSON.stringify(details.exams)
                  );
                  history.push("/courseInfo");
                }}
                className="courses-container"
                style={{
                  animation: `delete ${animat}s ease-in-out 0s`,
                }}
              >
                <img src={details.image} alt="" />
                <h5>{details.course_name}</h5>
                <span>
                  Start your journey in the world of {details.course_name}
                </span>

                <div className="course-ditails">
                  <div className="courses-info">
                    <i class="fa-solid fa-layer-group"></i>
                    <p>{details.no_of_lessons} lessons</p>
                  </div>
                  <div className="courses-info">
                    <i class="fa-regular fa-clock"></i>
                    <p>{details.total_reqiure_time}</p>
                  </div>
                </div>

                <div className="progress">
                  <div className="progress-bar">
                    <div
                      style={{ width: details.progress + "%" }}
                      className={classNames(
                        "progress-done",
                        {
                          "progress-done-red": parseInt(details.progress) <= 25,
                        },
                        {
                          "progress-done-blue":
                            parseInt(details.progress) > 25 &&
                            parseInt(details.progress) < 75,
                        },
                        {
                          "progress-done-green":
                            parseInt(details.progress) >= 75,
                        }
                      )}
                    ></div>
                  </div>
                  <div className="progress-prcentage">
                    <p
                      className={classNames(
                        {
                          "progress-prcentage-red":
                            parseInt(details.progress) <= 25,
                        },
                        {
                          "progress-prcentage-blue":
                            parseInt(details.progress) > 25 &&
                            parseInt(details.progress) < 75,
                        },
                        {
                          "progress-prcentage-green":
                            parseInt(details.progress) >= 75,
                        }
                      )}
                    >
                      {details.progress + "%"}
                    </p>
                  </div>
                </div>
                <div className="masseage">
                  <img src={img2} alt="" />
                  <sub>3</sub>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Courses;

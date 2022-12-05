import React, { useState, useEffect } from "react";
import "./Home.css";
import Navbar from "../components/Navbar/Navbar";
import icon1 from "../img/online-learning.png";
import icon2 from "../img/courses.png";
import icon3 from "../img/courses (1).png";
import icon4 from "../img/4104683.png";
import { CoursesList } from "./CoursesList";
import { Announcements } from "./Announcements";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Home = () => {
  let animat = 0;
  let history = useHistory();
  const [courses, setCourses] = useState([]);
  const [announcement, setannouncement] = useState([]);
  let temp_array = [];
  let temp_array2 = [];
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
            // console.log(Element.course_name);
            // setItems([...items], items);
            // setCourses(courses.append(Element.course_name));
          });
          // console.log(temp_array);
          console.log(temp_array);
          setCourses(temp_array);
          console.log(courses);
        }
      })
      .catch((err) => console.error(err));
    //--------------------------
    axios
      .post("http://localhost:5000/announcements", { level: userData.level })
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          res.data.forEach((Element, index) => {
            temp_array2[index] = Element;
          });
          setannouncement(temp_array2);
          console.log(announcement);
        }
      })
      .catch((err) => console.error(err));
    //---------------------------
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <div className="overview">
        <div className="overview-header">
          <h1>Overview</h1>
          <div className="last-days">
            <i class="fa-solid fa-calendar-days"></i>
            <span>Last 7 Days</span>
          </div>
        </div>
        <dir className="progress-contanier">
          <div className="progress-intter">
            <span className="progress-number">04</span>
            <img src={icon1} alt="" />
            <span className="progress-states">Courses in Progress</span>
          </div>
          <div className="progress-intter">
            <span className="progress-number">02</span>
            <img src={icon2} alt="" />
            <span className="progress-states">Courses Completed</span>
          </div>
          <div className="progress-intter">
            <span className="progress-number">
              12 <p>hr</p>
            </span>
            <img src={icon3} alt="" />
            <span className="progress-states">Total Read Time</span>
          </div>
          <div className="progress-intter">
            <span className="progress-number">
              17 <p>hr</p>
            </span>
            <img src={icon4} alt="" />
            <span className="progress-states">Total Watch Time</span>
          </div>
        </dir>
      </div>
      <div className="courses-list">
        <h1>Courses list</h1>
        <div className="Courses">
          {courses.map((details, index) => {
            animat = animat + 0.2;
            return (
              <div
                style={{
                  animation: `delete ${animat}s ease-in-out 0s`,
                }}
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
                className="courses-cards"
                key={index}
              >
                <span>{details.course_name}</span>
                <button>
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="announcements">
        <div className="line">
          <h1>Announcements</h1>
        </div>
        <div className="announcements-flex">
          {announcement.map((details, index) => {
            animat = animat + 0.2;
            return (
              <div
                onClick={() => {
                  // localStorage.setItem("exam_id",details)
                  localStorage.setItem(
                    "current_course_view",
                    details.course_id
                  );
                  localStorage.setItem(
                    "current_course_name",
                    details.course_name
                  );
                  axios
                    .post(
                      "http://localhost:5000/courses/" + details.course_id,
                      {
                        course: details.course_id,
                      }
                    )
                    .then((res) => {
                      if (res.data) {
                        console.log(res.data);
                        localStorage.setItem(
                          "current_exams",
                          JSON.stringify(res.data.exams)
                        );
                        history.push("/courseWork");
                      }
                    })
                    .catch((err) => console.error(err));
                }}
                style={{
                  animation: `delete ${animat}s ease-in-out 0s`,
                }}
                className="announcements-contanier"
              >
                <div
                  style={{ background: details.color }}
                  className="announcement-color"
                ></div>
                <div className="announcements-details">
                  <h3>{details.title}</h3>
                  <span>{details.course_name}</span>
                  <p>
                    {new Date(details.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    ,{" "}
                    {new Date(details.date).toLocaleTimeString("en-US", {
                      hour12: true,
                      timeStyle: "medium",
                    })}
                  </p>
                </div>
                <div className="announcements-icon">
                  <i class="fa-solid fa-arrow-right"></i>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Home;

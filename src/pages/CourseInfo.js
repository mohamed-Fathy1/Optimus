import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import "./CourseInfo.css";
import icon1 from "../img/undraw_youtube_tutorial_re_69qc.png";
import icon2 from "../img/undraw_exams_g-4-ow.png";
import axios from "axios";
import { useHistory } from "react-router-dom";

const CourseInfo = () => {
  let history = useHistory();
  const [courseInfo, setCourseInfo] = useState({});
  const course_id = window.localStorage.getItem("current_course_view");
  useEffect(() => {
    console.log(course_id);
    axios
      .get("http://localhost:5000/courses/" + course_id, {
        course_id: course_id,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setCourseInfo(res.data);
        }
        console.log(courseInfo);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <div
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(150, 150, 0, 0.679), rgba(0, 0, 166, 0.641)),url(${courseInfo.image})`,
        }}
        className="course-info"
      >
        <div className="course-details">
          <h1>{courseInfo.course_name}</h1>
          <p>{courseInfo.Description}</p>
        </div>
        <div className="course-container">
          <div className="course-content">
            <img src={icon1} alt="" />
            <h3>Course Content</h3>
          </div>
          <div
            onClick={() => history.push("/courseWork")}
            className="course-work"
          >
            <img src={icon2} alt="" />
            <h3>Coursework</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseInfo;

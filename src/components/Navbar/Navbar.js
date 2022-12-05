import React, { useEffect, useRef, useState } from "react";
import { MenuItems } from "./MenuItems";
import logo from "../../img/logo.png";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [profileopened, setprofileopened] = useState();
  const [dropdownOpened, setdropdownOpened] = useState();
  const [clicked, setclicked] = useState();
  const btnRef = useRef();
  const coursesRef = useRef();
  let profileRef = useRef();
  useEffect(() => {
    const closeDropdown = (e) => {
      console.log(e);
      console.log(e.path[0].tagName);
      if (
        e.path[0] !== btnRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setprofileopened(false);
      }
      if (e.path[0] !== coursesRef.current) {
        setdropdownOpened(false);
      }
    };
    document.body.addEventListener("click", closeDropdown);

    return () => document.body.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <>
      <nav className="NavbarItems">
        <img className="navbar-logo" src={logo} alt="dasda" />
        <div className="menu-icon" onClick={() => setclicked((prev) => !prev)}>
          <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
        </div>
        <ul className={clicked ? "nav-menu active" : "nav-menu"}>
          {MenuItems.map((item, index) => {
            return (
              <li key={index}>
                <Link
                  style={
                    item.url == window.location.pathname
                      ? {
                          color: "white",
                          borderColor: "white",
                          borderWidth: "2px",
                          borderBottomStyle: "solid",
                        }
                      : {}
                  }
                  to={item.url}
                  className={item.cName}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="notification">
          <i className="fa-solid fa-bell"></i>
        </div>
        <div className="profile">
          {/* <i className="fa-solid fa-circle-user" onClick={this.profile}></i> */}
          <img
            ref={btnRef}
            className="profile-pic"
            src={localStorage.getItem("student_image")}
            alt={localStorage.getItem("student_name")}
            onClick={() => setprofileopened((prev) => !prev)}
          />
        </div>
        <div
          ref={profileRef}
          className={profileopened ? "profile-conatainer" : "profile-closed"}
        >
          {/* <i className="fa-solid fa-circle-user inntir-profle"></i> */}
          <img
            className="profile-pic2"
            src={localStorage.getItem("student_image")}
            alt={localStorage.getItem("student_name")}
          />
          <h3>{localStorage.getItem("student_name")}</h3>
          <h5>{JSON.parse(localStorage.getItem("user")).username}</h5>
          <div className="logout-button">
            <Link className="logout" to="/">
              <i class="fa-solid fa-arrow-left"></i>
              Logout
            </Link>
          </div>
        </div>
      </nav>
      <nav className="sub-nav">
        <div className="search-icon">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <div className="search-bar">
          <input
            type="text"
            name="password"
            id="password"
            placeholder="What do you want to learn? "
          />
        </div>
        <div className="subnav-text">
          <div className="dropdown">
            <span
              ref={coursesRef}
              onClick={() => setdropdownOpened((prev) => !prev)}
            >
              Explore Courses{" "}
              <i
                class={
                  dropdownOpened
                    ? "fa-solid fa-angle-up"
                    : "fa-solid fa-angle-down"
                }
              ></i>
            </span>
            <div
              className={
                dropdownOpened ? "dropdown-courses active" : "dropdown-courses"
              }
            >
              <h4>Information Assurance and Security</h4>
              <h4>Integrated Information Systems</h4>
              <h4>Mobile and Sensor Network</h4>
              <h4>Multimedia and Virtual Reality</h4>
              <h4>Neural networks</h4>
              <h4>Web Engineering (3)</h4>
            </div>
          </div>
          <div>
            <span>
              Ulearne Read <i class="fa-solid fa-angle-down"></i>
            </span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

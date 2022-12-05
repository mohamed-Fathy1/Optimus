import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import logo from "./img/es2.jpg";
import logo2 from "./img/logo.png";
import Home from "./pages/Home";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const users = [
    {
      id: 1,
      name: "Bertie Yates",
      email: "admin@admin123",
      password: "admin123",
      age: 29,
      image:
        "https://res.cloudinary.com/diqqf3eq2/image/upload/v1595959131/person-2_ipcjws.jpg",
    },
    {
      id: 2,
      name: "Hester Hogan",
      email: "admin@admin1234",
      password: "admin1234",
      age: 32,
      image:
        "https://res.cloudinary.com/diqqf3eq2/image/upload/v1595959131/person-3_rxtqvi.jpg",
    },
    {
      id: 3,
      name: "Larry Little",
      email: "admin@admin12345",
      password: "admin12345",
      age: 36,
      image:
        "https://res.cloudinary.com/diqqf3eq2/image/upload/v1586883423/person-4_t9nxjt.jpg",
    },
    {
      id: 4,
      name: "Sean Walsh",
      email: "admin@admin123456",
      password: "admin123456",
      image:
        "https://res.cloudinary.com/diqqf3eq2/image/upload/v1586883417/person-3_ipa0mj.jpg",
    },
    {
      id: 5,
      name: "Lola Gardner",
      email: "admin@admin1234567",
      password: "admin1234567",
      image:
        "https://res.cloudinary.com/diqqf3eq2/image/upload/v1586883334/person-1_rfzshl.jpg",
    },
  ];
  let history = useHistory();
  const [user, setUser] = useState({ email: "", name: "", image: "" });
  const [error, setError] = useState("");
  const [student, setStudent] = useState({});

  useEffect(() => {
    window.localStorage.setItem("user", JSON.stringify(student));
  });

  const Login = (details) => {
    axios
      .post("http://localhost:5000/students", details)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          if (
            details.username === res.data.username &&
            details.password === res.data.password
          ) {
            setStudent(res.data);
            localStorage.setItem("student_name", res.data.name);
            localStorage.setItem("student_image", res.data.image);
            setTimeout(() => {
              history.push("/home");
            }, 6000);
            return setUser({
              email: res.data.username,
              name: res.data.name,
              image: res.data.image,
            });
          } else {
            console.log("Details do not match!");
            return setError(res.data.msg);
          }
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className="all">
        {user.email !== "" ? (
          <>
            <main className="deleteLogin">
              <div className="logged-left-container">
                <img className="svg" src={logo2} alt="dasda" />
                <p>
                  optimize your grades by keeping track of your learning process
                </p>
              </div>

              <div className="logginin">
                <form className="loggedin-container">
                  <div className="form-header">
                    <h4>Hello!</h4>
                    <h6>Sign into Your account</h6>
                  </div>
                  <div className="inner-form">
                    <label htmlFor="Email">Email </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email"
                    />
                  </div>
                  <div className="inner-form">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Password"
                    />
                  </div>
                  <div className="lables">
                    <div className="remember-me">
                      <input type="checkbox" className="my" id="hi" />
                      <label htmlFor="hi" className="redio">
                        Remember me
                      </label>
                    </div>
                    <h6>Forgat my password?</h6>
                  </div>
                  <div className="form-btn">
                    <button type="submit" value="LOGIN" className="login-btn">
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </main>
            <div className="welcome">
              <div className="welcome-contanier">
                <img src={user.image} alt={user.name} placeholder={user.name} />
                <h2>
                  Welcome,<span>{user.name}</span>
                </h2>
              </div>
            </div>
          </>
        ) : (
          <LoginForm Login={Login} error={error} />
        )}
      </div>
    </>
  );
};

export default Login;

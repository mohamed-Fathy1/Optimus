import React, { useState } from "react";
import logo from "./img/logo.png";
import logo2 from "./img/logo.png";
function LoginForm({ Login, error }) {
  const [details, setDetails] = useState({ username: "", password: "" });

  const submitHandler = (e) => {
    e.preventDefault();

    Login(details);
  };
  return (
    <main>
      <div className="left-container">
        <img className="svg" src={logo2} alt="dasda" />
        <p>optimize your grades by keeping track of your learning process</p>
      </div>

      <div className="login">
        <form onSubmit={submitHandler} className="login-container">
          <div className="form-header">
            <h4>Hello!</h4>
            <h6>Sign into Your account</h6>
          </div>
          {error !== "" ? <div className="error">{error} </div> : ""}
          <div className="inner-form">
            <label htmlFor="Email">Email </label>
            <input
              type="email"
              name="username"
              id="email"
              placeholder="Email"
              onChange={(e) =>
                setDetails({ ...details, username: e.target.value })
              }
              value={details.username}
            />
          </div>
          <div className="inner-form">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={(e) =>
                setDetails({ ...details, password: e.target.value })
              }
              value={details.password}
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
            {/* <button type="button" className="create-btn">
              Create Account
            </button> */}
          </div>
        </form>
      </div>
    </main>
  );
}

export default LoginForm;

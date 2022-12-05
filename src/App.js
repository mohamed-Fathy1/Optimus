import Home from "./pages/Home";
import CourseInfo from "./pages/CourseInfo";
import Course from "./pages/Course";
import Login from "./Login";
import AttemptQuiz from "./pages/AttemptQuiz";
import Courses from "./pages/Courses";
import ReviewQuiz from "./pages/ReviewQuiz";
import Grades from "./pages/Grades";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import ProtectedRoutes from "./ProtectedRoutes";

const App = () => {
  return (
    <div className="background">
      <Router>
        <Switch>
          <Route exact path="/">
            <Login></Login>
          </Route>
          <Route path="/home">
            <Home></Home>
          </Route>
          <Route path="/course">
            <Courses></Courses>
          </Route>
          <Route path="/Quiz">
            <AttemptQuiz></AttemptQuiz>
          </Route>
          <Route path="/courseInfo">
            <CourseInfo></CourseInfo>
          </Route>
          <Route path="/reviewQuiz">
            <ReviewQuiz></ReviewQuiz>
          </Route>
          <Route path="/courseWork">
            <Course></Course>
          </Route>
          <Route path="/grades">
            <Grades></Grades>
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;

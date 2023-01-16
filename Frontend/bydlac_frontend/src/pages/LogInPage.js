import React from "react";
import {Link} from "react-router-dom";
import LogIn from "../components/LogIn";

import "./LogInPage.css";

/**
 * Custom Component which represents complete view of log in page
 * @returns {JSX.Element} LogIn Component with button to sign up page
 */
const LogInPage = () => {
  return (
      <div className="logInComponent">
          <div className="logInBox">
              <p className="logInText">LOGOWANIE</p>

              <LogIn/>

              <p style={{marginBottom: "0", color: "rgb(255, 255, 255)"}}>Nie masz jeszcze konta?</p>

              <Link to="/signup" style={{textDecoration: "unset"}}>
                  <button className="signUpButton">
                      Zarejestruj się teraz!
                  </button>
              </Link>
          </div>

      </div>
  )
}

export default LogInPage;
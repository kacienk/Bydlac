import React from "react";
import {Link} from "react-router-dom";

import LogIn from "../components/LogIn";
import "./LogInPage.css";

const LogInPage = () => {
  return (
      <div className="logInPage">
          <p>Logowanie</p>

          <LogIn/>

          <p>Nie masz jeszcze konta?</p>

          <Link to="/signup">Zarejestruj się już teraz!</Link>
      </div>
  )
}

export default LogInPage;
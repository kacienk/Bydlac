import React from "react";
import {Link} from "react-router-dom";

import LogIn from "../components/LogIn";
import "./LogInPage.css";

const LogInPage = () => {
  return (
      <div className="logInComponent">
          <p className="logowanie">LOGOWANIE</p>

          <LogIn/>

          <p className="lub">Lub:</p>
          <button className="google">GOOGLE</button>

          <p className="nieMaszJeszczeKonta">Nie masz jeszcze konta?</p>

          <Link to="/signup" className="zarejestrujSieJuzTeraz">Zarejestruj się już teraz!</Link>
      </div>
  )
}

export default LogInPage;
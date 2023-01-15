import React from "react";
import {Link} from "react-router-dom";

import "./LogOutPage.css"

const LogOutPage = () => {
    localStorage.clear()

    return (
        <div className="logOutPage">
            <div className="logOutBox">
                <p style={{color: "#ffffff", marginTop: "0"}}>Nastąpiło poprawne wylogowanie</p>

                <p style={{color: "#ffffff", marginBottom: "10px"}}>Chcesz zalogować się jeszcze raz?</p>
                <Link to="/login" style={{textDecoration: "unset"}}>
                    <button className="logInAgainButton">
                        Zaloguj się
                    </button>
                </Link>
            </div>
        </div>
  )
}

export default LogOutPage;
import React from "react";

import "./LogOutPage.css"
import {Link} from "react-router-dom";

const LogOutPage = () => { /* TODO should there be an option that sth went wrong? */
    return (
        <div className="logOutPage">
            <p>Nastąpiło poprawne wylogowanie</p>

            <p>Chcesz zalogować się jeszcze raz?</p>
            <Link to="/login">Zaloguj się</Link>
        </div>
  )
}

export default LogOutPage;
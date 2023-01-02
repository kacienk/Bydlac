import React, {useContext} from "react";

import "./LogOutPage.css"
import {Link} from "react-router-dom";
import userContext from "../context/UserContext";

const LogOutPage = () => { /* TODO should there be an option that sth went wrong? */
    localStorage.clear()
    //let {userId, userGroups, currentGroupId, currentMessage} = useContext(userContext)
    //userId = null
    //userGroups = null
    //currentGroupId = null
    //currentMessage = null

    return (
        <div className="logOutPage">
            <p>Nastąpiło poprawne wylogowanie</p>

            <p>Chcesz zalogować się jeszcze raz?</p>
            <Link to="/login">Zaloguj się</Link>
        </div>
  )
}

export default LogOutPage;
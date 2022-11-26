import React from "react";
import {Link} from "react-router-dom";

import SignUp from "../components/SignUp";
import "./SignUpPage.css";

const SignUpPage = () => {
    return (
        <div className='signUpPage'>
            <p>Rejestracja</p>

            <SignUp/>

            <p>Masz już konto?</p>

            <Link to="/login">Zaloguj się</Link>
        </div>
    )
}

export default SignUpPage;
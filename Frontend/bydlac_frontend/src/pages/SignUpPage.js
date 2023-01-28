import React from "react";
import {Link} from "react-router-dom";
import SignUp from "../components/SignUp";

import "./SignUpPage.css";

/**
 * Custom Component which represents complete view of sign up page
 * @returns {JSX.Element} SignUp Component with button to log in page
 */
const SignUpPage = () => {
    return (
        <div className='signUpPage'>
            <div className="signUpBox">
                <p className="signUpText">REJESTRACJA</p>

                <SignUp/>

                <p style={{marginBottom: "0", color: "rgb(255, 255, 255)"}}>Masz już konto?</p>

                <Link to="/login" style={{textDecoration: "unset"}}>
                    <button className="logInButton">
                        Zaloguj się
                    </button>
                </Link>
            </div>

        </div>
    )
}

export default SignUpPage;

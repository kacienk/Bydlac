import React from "react";
import {Link} from "react-router-dom";

import SignUp from "../components/SignUp";
import "./SignUpPage.css";

const SignUpPage = () => {
    return (
        <div className='signUpPage'>
            <p className="rejestracja">REJESTRACJA</p>

            <SignUp/>

            <p className="maszJuzKonto">Masz już konto?</p>

            <Link to="/login" className="zalogujSie">Zaloguj się</Link>
        </div>
    )
}

export default SignUpPage;
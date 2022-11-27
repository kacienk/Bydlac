import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";

import './LogIn.css';
import userContext from "../context/UserContext";

const LogIn = () => {
    let {logInHandler} = useContext(userContext)

    //const [email, setEmail] = useState('')
    //const [password, setPassword] = useState('')
    //const navigate = useNavigate()
    // const submitHandler = async (event) => {
    //     event.preventDefault()
    //     const user = {email, password}
    //
    //     let response = await fetch('http://127.0.0.1:8000/api/login/', {
    //         method: 'POST',
    //         headers: {"Content-Type": "application/json"},
    //         body: JSON.stringify(user)
    //     })
    //
    //     if (response.ok) {
    //         const data = await response.json()
    //
    //         userContext.data = data;
    //         setUserId(data);
    //         console.log(userId);
    //         navigate('/mainview')
    //     }
    //     else if (400 && response.status)
    //         console.log("Złe dane", response.status, response.statusText)
    // }

    return (
        <form className='logInForm' onSubmit={logInHandler}>
            <p className='logInFormText'>E-mail:</p>
            <input
                className='logInFormInput'
                type="text"
                required
                name="email"
                placeholder="E-mail"
                //value={email}
                //onChange={(event) => setEmail(event.target.value)}
            />

            <p className='logInFormText'>Hasło:</p>
            <input
                className='logInFormInput'
                type="text"
                required
                name="password"
                placeholder="Hasło"
                //value={password}
                //onChange={(event) => setPassword(event.target.value)}
            />

            <br/>
            <button className='logInFormButton'>Zaloguj się</button>
        </form>
    )
}

export default LogIn;
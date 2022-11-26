import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

import './LogIn.css';

const LogIn = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const submitHandler = async (event) => {
        event.preventDefault()
        const user = {email, password}

        let response = await fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(user)
        })
        console.log(response.headers)
        if (response.ok)
            navigate('/mainview')
        else if (400 && response.status)
            console.log("Złe dane", response.status, response.statusText)

        /* TODO handling errors*/
    }

    return (
        <form className='logInForm' onSubmit={submitHandler}>
            <p>E-mail:</p>
            <input
                className='email'
                type="text"
                required
                placeholder="E-mail"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />

            <p>Hasło:</p>
            <input
                className='password'
                type="text"
                required
                placeholder="Hasło"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />

            <br/> <br/>
            <button>Zaloguj się</button>
        </form>
    )
}

export default LogIn;
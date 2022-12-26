import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "./SignUp.css"

const SignUp = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeated, setPasswordRepeated] = useState('')
    const navigate = useNavigate()

    const submitHandler = async (event) => {
        event.preventDefault()
        const newUser = {username, password, password2: passwordRepeated, email}

        let response = await fetch('http://127.0.0.1:8000/api/register/', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newUser)
        })

        if (response.ok)
            navigate('/login')
        else
            alert(response.status + ' ' + response.statusText)

        /* TODO handling errors*/
    }

    return (
        <form className='signUpForm' onSubmit={submitHandler}>
            <p className="signUpFormText">Nazwa użytkownika:</p>
            <input
                className="signUpFormInput"
                type="text"
                required
                placeholder="Nazwa użytkownika"
                value={username}
                onChange={(event) => {setUsername(event.target.value)}}
            />

            <p className="signUpFormText">E-mail:</p>
            <input
                className="signUpFormInput"
                type="text"
                required
                placeholder="E-mail"
                value={email}
                onChange={(event) => {setEmail(event.target.value)}}
            />

            <p className="signUpFormText">Hasło:</p>
            <input
                className="signUpFormInput"
                type="text"
                required
                placeholder="Hasło"
                value={password}
                onChange={(event) => {setPassword(event.target.value)}}
            />

            <p className="signUpFormText">Powtórz hasło:</p>
            <input
                className="signUpFormInput"
                type="text"
                required
                placeholder="Powtórz hasło"
                value={passwordRepeated}
                onChange={(event) => {setPasswordRepeated(event.target.value)}}
            />

            <br/>
            <button className="signUpFormSignUpButton">Zarejestruj się</button>
        </form>
    )
}

export default SignUp;
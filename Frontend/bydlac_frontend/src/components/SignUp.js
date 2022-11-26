import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

const SignUp = () => { /* TODO placeholders */
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
            navigate('/')
        else
            console.log(response.status, response.statusText)

        /* TODO handling errors*/
    }

    return (
        <form className='signUpForm' onSubmit={submitHandler}>
            <p>Nazwa użytkownika:</p>
            <input
                className="username"
                type="text"
                required
                placeholder="Nazwa użytkownika"
                value={username}
                onChange={(event) => {setUsername(event.target.value)}}
            />

            <p>E-mail:</p>
            <input
                className="email"
                type="text"
                required
                placeholder="E-mail"
                value={email}
                onChange={(event) => {setEmail(event.target.value)}}
            />

            <p>Hasło:</p>
            <input
                className="password"
                type="text"
                required
                placeholder="Hasło"
                value={password}
                onChange={(event) => {setPassword(event.target.value)}}
            />

            <p>Powtórz hasło:</p>
            <input
                className="passwordRepeated"
                type="text"
                required
                placeholder="Powtórz hasło"
                value={passwordRepeated}
                onChange={(event) => {setPasswordRepeated(event.target.value)}}
            />

            <br/> <br/>
            <button>Zarejestruj się</button>
        </form>
    )
}

export default SignUp;
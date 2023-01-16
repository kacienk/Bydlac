import React, {useContext} from "react";
import userContext from "../context/UserContext";
import {useNavigate} from "react-router-dom";

import './LogIn.css';

const LogIn = () => {
    const {
        ADDRESS,
        setUserToken,
        setCurrentUser,
        setUserId,
        currentGroupId
    } = useContext(userContext)

    const navigate = useNavigate()
    const logInHandler = async (event) => {
        event.preventDefault()

        // send request to backend to log and authorize user
        let response = await fetch(`${ADDRESS}/login/`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                'email' : event.target.email.value,
                'password': event.target.password.value
            })
        })
        let data = await response.json()

        if (response.status === 202) {
            // obtain auth token and store it in localStorage as well as in userContext
            setUserToken(data['token'])
            localStorage.setItem('userToken', JSON.stringify(data['token']))

            // obtain all currently logged user's information
            response = await fetch(`${ADDRESS}/users/self/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${data['token']}`
                }
            })
            data = await response.json()

            // store it in localStorage as well as in userContext
            setCurrentUser(data)
            localStorage.setItem('currentUser', JSON.stringify(data))

            // additionally store currently logged user's ID the same way as other user's info
            setUserId(data['id'])
            localStorage.setItem('userId', data['id'])

            navigate(`/`)
        }
        else
            alert("Problem z logowaniem, spróbuj jeszcze raz")
    }

    return (
        <form className='logInForm' onSubmit={logInHandler}>
            <p className='logInFormText'>E-mail:</p>
            <input
                className='logInFormInput'
                type="text"
                required
                name="email"
                placeholder="E-mail" />

            <p className='logInFormText'>Hasło:</p>
            <input
                className='logInFormInput'
                type="password"
                required
                name="password"
                placeholder="Hasło" />

            <br/>
            <button className='logInFormButton'>Zaloguj się</button>
        </form>
    )
}

export default LogIn;
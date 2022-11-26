import React, {useState} from "react";
import './LogIn.css';

const LogIn = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submitHandler = (event) => {
        event.preventDefault()
        const user = {email,  password}

        console.log(user)
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
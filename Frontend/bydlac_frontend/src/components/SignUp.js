import React, {useState} from "react";

const SignUp = () => { /* TODO placeholders */
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeated, setPasswordRepeated] = useState('')

    const submitHandler = (event) => {
        event.preventDefault()
        const newUser = {username, email, password}

        fetch('http://127.0.0.1:8000/api/register/', {
            method: 'POST',
            headers: {}, /* TODO I don't see it in routes */
            body: JSON.stringify(newUser)
        })
    }

    return (
        <form className='signUpForm' onSubmit={submitHandler}>
            <p>Nazwa użytkownika:</p>
            <input
                className="username"
                type="text"
                required
                placeholder="TODO?"
                value={username}
                onChange={(event) => {setUsername(event.target.value)}}
            />

            <p>E-mail:</p>
            <input
                className="email"
                type="text"
                required
                placeholder="TODO?"
                value={email}
                onChange={(event) => {setEmail(event.target.value)}}
            />

            <p>Hasło:</p>
            <input
                className="password"
                type="text"
                required
                placeholder="TODO?"
                value={password}
                onChange={(event) => {setPassword(event.target.value)}}
            />

            <p>Powtórz hasło:</p>
            <input
                className="passwordRepeated"
                type="text"
                required
                placeholder="TODO?"
                value={passwordRepeated}
                onChange={(event) => {setPasswordRepeated(event.target.value)}}
            />

            <br/> <br/>
            <button>Zarejestruj się</button>
        </form>
    )
}

export default SignUp;
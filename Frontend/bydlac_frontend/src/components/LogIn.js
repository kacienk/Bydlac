import React from "react";
import './LogIn.css';

const LogIn = () => {
  return (
      <div className='logInForm'>
          <p>E-mail:</p>
          <input className='email' type="text" placeholder="E-mail"/>

          <p>Hasło:</p>
          <input className='password' type="text" placeholder="Hasło"/>
      </div>
  )

}

export default LogIn;
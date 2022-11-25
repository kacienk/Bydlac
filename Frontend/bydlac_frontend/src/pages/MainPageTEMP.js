import React from "react";
import User from "../components/User";
import Conversation from "../components/Conversation";
import InputMessage from "../components/InputMessage";

const MainPageTEMP = () => {
  return (
      <div>
          <div className='usersHeader'>
              <User className='otherPerson' name='Nick' surname='Rozmowcy' status='Status' favorite={true}/>
              <User className='you' name='Twoj' surname='Nick' status='Status' favorite={null}/>
          </div>

          <Conversation/>

          <InputMessage/>
      </div>
  )
}

export default MainPageTEMP;
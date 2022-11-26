import React from "react";
import User from "../components/User";
import Conversation from "../components/Conversation";
import InputMessage from "../components/InputMessage";

const MainPageTEMP = () => {
  return (
      <div>
          <div className='usersHeader'>
              <User className='otherPerson' userId={3} favorite={true}/>
              <User className='you' userId={1} favorite={null}/>
          </div>

          <Conversation/>

          <InputMessage/>
      </div>
  )
}

export default MainPageTEMP;
import React, {useContext} from "react";
import userContext from "../context/UserContext";
import User from "../components/User";
import Conversation from "../components/Conversation";
import InputMessage from "../components/InputMessage";

const MainPageTEMP = () => {
    let {userId} = useContext(userContext)
  return (
      <div>
          <div className='usersHeader'>
              <User className='otherPerson' userId={userId} favorite={true}/>
              <User className='you' userId={userId} favorite={null}/>
          </div>

          <Conversation/>

          <InputMessage/>
      </div>
  )
}

export default MainPageTEMP;
import React, {useContext} from "react";
import userContext from "../context/UserContext";
import {Link} from "react-router-dom";

import User from "../components/User";
import Conversation from "../components/Conversation";
import InputMessage from "../components/InputMessage";
import ListHeader from "../components/ListHeader";
import GetOtherUser from "../utils/GetOtherUser";

import "./MainPageTEMP.css"

const MainPageTEMP = () => {
    const {currentGroupId} = useContext(userContext)
    let otherUser = GetOtherUser()

    return (
        <div className='mainView'>
            <div>
                <div className='usersHeader'>
                    <User className='otherPerson' otherUser={otherUser} favorite={true}/>
                    <Link id='logoutContainer' to={'/logout'}>
                        <button className="logoutButton">Wyloguj</button>
                    </Link>
                    <User className='you' favorite={null}/>
                </div>

                <Conversation groupId={currentGroupId}/>

                <InputMessage/>
            </div>
            <div id='TEMPgroupList'>
                <ListHeader/>
            </div>
        </div>
    )
}

export default MainPageTEMP;
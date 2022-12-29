import React, {useContext} from "react";
import userContext from "../context/UserContext";
import User from "../components/User";
import Conversation from "../components/Conversation";
import InputMessage from "../components/InputMessage";
import "./MainPageTEMP.css"
import {Link, useParams} from "react-router-dom";
import GetOtherUser from "../utils/GetOtherUser";
import ListHeader from "../components/ListHeader";

const MainPageTEMP = () => {
    //let params = useParams() TODO page numbering

    let {
        userId,
        currentGroupId
    } = useContext(userContext)

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
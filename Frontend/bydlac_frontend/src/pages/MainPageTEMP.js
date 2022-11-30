import React, {useContext} from "react";
import userContext from "../context/UserContext";
import User from "../components/User";
import Conversation from "../components/Conversation";
import InputMessage from "../components/InputMessage";
import GroupList from "../components/GroupList";
import "./MainPageTEMP.css"
import {Link, useParams} from "react-router-dom";
import GetOtherUser from "../utils/GetOtherUser";

const MainPageTEMP = () => {
    //let params = useParams() TODO page numbering
    //console.log("MainPage params: ", params.groupId)

    let {userId, currentGroupId} = useContext(userContext)
    //console.log("MainPage currentGroupID: ", currentGroupId)
    let otherUser = GetOtherUser()
    //console.log("MainPage otherUserID: ", otherUser.id)

    return (
        <div className='mainView'>
            <div>
                <div className='usersHeader'>
                    <User className='otherPerson' userId={otherUser.id} otherUser={otherUser} favorite={true}/>
                    <Link id='logoutContainer' to={'/logout'}>
                        <button className="logoutButton">Wyloguj</button>
                    </Link>
                    <User className='you' userId={userId} favorite={null}/>
                </div>

                <Conversation groupId={currentGroupId}/>

                <InputMessage/>
            </div>
            <div id='TEMPgroupList'>
                <GroupList/>
            </div>
        </div>

    )
}

export default MainPageTEMP;
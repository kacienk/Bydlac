import React, {useContext} from "react";
import userContext from "../context/UserContext";
import {Link} from "react-router-dom";

import User from "../components/User";
import Conversation from "../components/Conversation";
import InputMessage from "../components/InputMessage";
import ListHeader from "../components/ListHeader";
import GetOtherUser from "../utils/GetOtherUser";

import "./ChatPage.css"
import UsersHeader from "../components/UsersHeader";

const ChatPage = () => {
    const {currentGroupId} = useContext(userContext)
    //let otherUser = GetOtherUser()

    return (
        <div className='mainView'>
            <div>
                <UsersHeader />

                <Conversation groupId={ currentGroupId } />

                <InputMessage/>
            </div>

            <ListHeader whichToShow={true}/>
        </div>
    )
}

export default ChatPage;
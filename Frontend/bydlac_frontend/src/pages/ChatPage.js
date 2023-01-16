import React, {useContext} from "react";
import userContext from "../context/UserContext";
import Conversation from "../components/Conversation";
import InputMessage from "../components/InputMessage";
import ListHeader from "../components/ListHeader";
import UsersHeader from "../components/UsersHeader";

import "./ChatPage.css"

/**
 * Custom Component which represents chat view with messages of specific Conversation Group and option to send message
 * @returns {JSX.Element} Complete view containing logout button, currently logged-in user, messages of specific group,
 * inputs for sending new messages and list of all user's Conversation Groups or Events along with button to create new Group or Event
 */
const ChatPage = () => {
    const {currentGroupId} = useContext(userContext)

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
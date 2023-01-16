import React, {useContext} from "react";
import userContext from "../context/UserContext";
import Conversation from "../components/Conversation";
import InputMessage from "../components/InputMessage";
import ListHeader from "../components/ListHeader";
import UsersHeader from "../components/UsersHeader";

import "./ChatPage.css"

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
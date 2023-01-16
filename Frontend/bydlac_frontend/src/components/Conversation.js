import {useContext, useEffect, useState} from "react";
import Message from "./Message";
import userContext from "../context/UserContext";

import './Conversation.css';

/**
 * Custom Component to obtain messages associated with Conversation Group and to display them
 * @param groupId Conversation Group ID which messages are going to be obtained
 * @returns {JSX.Element} Display all messages
 */
const Conversation = ({groupId}) => {
    let [messages, setMessages] = useState([])
    const {ADDRESS, userToken} = useContext(userContext)

    useEffect(() => {
        /** Requests all messages from Conversation Group specified by its ID and saves them in outside variable messages
         * @param groupId Conversation Group ID which messages are going to be requested */
        const getMessages = async (groupId) => {
            if (groupId !== null) {
                let response = await fetch(`http://192.168.92.21:8000/api/groups/${groupId}/messages/`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Token ${userToken}`
                    }
                })
                let data = await response.json()
                setMessages(data)
            }
        }

        const interval = setInterval(() => {
            if (groupId !== null)
                getMessages(groupId)
        }, 1000)

        return () => clearInterval(interval)
    }, [userToken, groupId])

    return (
        <div className='conversationBox'>
            {messages.map(message => (
                <Message key={message.id} message={message} />
            ))}
        </div>
    )
}
export default Conversation;
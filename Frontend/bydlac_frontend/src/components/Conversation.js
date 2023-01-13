import './Conversation.css';
import {useContext, useEffect, useState} from "react";

import Message from "./Message";
import userContext from "../context/UserContext";

const Conversation = ({props, groupId}) => {
    let [messages, setMessages] = useState([])
    const {userToken} = useContext(userContext)

    useEffect(() => {
        const getMessages = async (groupId) => {
            if (groupId !== null) {
                let response = await fetch(`http://127.0.0.1:8000/api/groups/${groupId}/messages/`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Token ${userToken}`
                    }
                })
                let data = await response.json()
                setMessages(data)
                //console.log("/Conversation.js/getMessages/", data)
            }
        }

        const interval = setInterval(() => {
            if (groupId !== null)
                getMessages(groupId)
        }, 1000)

        return () => clearInterval(interval)
    }, [userToken, groupId]) // [groupId, currentMessage]



    return (
        <div className='conversationBox'>
            {messages.map(message => (
                <Message key={message.id} message={message} />
            ))}
        </div>
    )
}
export default Conversation;
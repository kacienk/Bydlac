import {useContext, useEffect, useState} from "react";
import Message from "./Message";
import userContext from "../context/UserContext";

import './Conversation.css';
const ADDRESS = `http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api`
const Conversation = ({groupId}) => {
    let [messages, setMessages] = useState([])
    const {userToken} = useContext(userContext)

    useEffect(() => {
        const getMessages = async (groupId) => {
            if (groupId !== null) {
                let response = await fetch(`${ADDRESS}/groups/${groupId}/messages/`, {
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
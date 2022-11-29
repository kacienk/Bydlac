import './Conversation.css';
import {useContext, useEffect, useState} from "react";

import Message from "./Message";
import userContext from "../context/UserContext";

const Conversation = ({groupId}) => {
    let [messages, setMessages] = useState([])
    //const {currentMessage} = useContext(userContext)
    //console.log("currmess w conv", currentMessage)

    useEffect(() => {
        getMessages(groupId)
    }, ) // [groupId, currentMessage]


    let getMessages = async (groupId) => {
        const timer = setTimeout(async () => {
            if (groupId !== -1) {
                let response = await fetch('http://127.0.0.1:8000/api/groups/'+ groupId +'/messages/', {
                    method: 'GET',
                    headers: {"Content-Type": "application/json"}
                })
                let data = await response.json()
                setMessages(data)

                console.log("/Conversation.js/getMessages/", data)
            }
        }, 1000)
        //clearTimeout(timer)
    }

    return (
        <div className='conversationBox'>
            {messages.map(message => (
                <Message key={message.id} message={message} />
            ))}
        </div>
    )
}
export default Conversation;
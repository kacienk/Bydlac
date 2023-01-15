import {createContext, useState, useEffect} from "react";

const MessageContext = createContext();

export default MessageContext;

export const MessageProvider = ({children}) => {
    // let [messages, setMessages] = useState([])
    //
    // useEffect(() => {
    //     getMessages()
    // }, [])
    //
    //
    // let getMessages = async () => {
    //     let response = await fetch('http://127.0.0.1:8000/api/groups/3/messages/', {
    //         method: 'GET',
    //         headers: {"Content-Type": "application/json"}
    //     })
    //     let data = await response.json()
    //     setMessages(data)
    // }
}
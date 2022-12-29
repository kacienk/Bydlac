import userContext from "../context/UserContext";
import {useContext} from "react";
import "./Message.css"

const Message = ({message}) => {
    let {userId} = useContext(userContext)

    return (
        <div>
            {(message.author === userId) ?
                <div className='userMessage'>{message.body}</div> :
                <div className='otherMessage'>{message.body}</div>}
        </div>
    )
}

export default Message;
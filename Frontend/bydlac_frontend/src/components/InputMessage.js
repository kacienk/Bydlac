import {useContext, useRef} from "react";
import './InputMessage.css';
import userContext from "../context/UserContext";

function InputMessage() {
    const {currentGroupId, userId, userToken} = useContext(userContext)
    let {currentMessage} = useContext(userContext)
    const messageRef = useRef();

    const sendMessageHandler = async () => {
        currentMessage = messageRef.current.value;
        if (currentMessage === '')
            return;

        let response = await fetch(`http://127.0.0.1:8000/api/groups/${currentGroupId}/messages/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${userToken}`
            },
            body: JSON.stringify({
                'body': currentMessage,
                'author': userId,
                'group': Number(currentGroupId)
            })
        })

        messageRef.current.value = null;
    }

    function inputPhotoHandler() {
        /*TODO*/
    }

    function inputLocationHandler() {
        /*TODO*/
    }

    return (
        <div className="inputMessage">
            <input className='inputMessageField' ref={messageRef} type="text" placeholder='Aa...'></input>
            <button className='inputSendButton' onClick={sendMessageHandler}>S</button>
            <button className='inputPhotoButton' onClick={inputPhotoHandler}>P</button>
            <button className='inputLocationButton' onClick={inputLocationHandler}>L</button>
        </div>
    );
}

export default InputMessage;

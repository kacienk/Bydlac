import {useContext, useRef} from "react";
import './InputMessage.css';
import userContext from "../context/UserContext";

function InputMessage() {
    const {
        currentGroupId,
        userId,
        userToken
    } = useContext(userContext)

    let {currentMessage} = useContext(userContext)
    const messageRef = useRef();

    const sendMessageHandler = async (event) => {
        event.preventDefault()

        currentMessage = messageRef.current.value;
        if (currentMessage === '')
            return;

        console.log("currentGroupId in sendMessageHhandler: ", currentGroupId)
        let response = await fetch(`http://127.0.0.1:8000/api/groups/${currentGroupId}/messages/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${userToken}`
            },
            body: JSON.stringify({
                'body': currentMessage,
                'author': userId,
                'group': currentGroupId
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
        <div className="inputMessage" onSubmit={sendMessageHandler}>
            <form>
                <input className='inputMessageField' ref={messageRef} type="text" placeholder='Aa...'></input>
                <button className='inputSendButton' type="submit">S</button>
            </form>

            <button className='inputPhotoButton' onClick={inputPhotoHandler}>P</button>
            <button className='inputLocationButton' onClick={inputLocationHandler}>L</button>
        </div>
    );
}

export default InputMessage;

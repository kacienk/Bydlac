import {useRef} from "react";
import './InputMessage.css';

function InputMessage(props) {
    const messageRef = useRef();

    function sendMessageHandler() {
        const message = messageRef.current.value;
        if (message === '')
            return;
        console.log(message); /* Send message to database I think? */
        messageRef.current.value = null;
    }

    function inputPhotoHandler() {
        /*TODO*/
    }

    function inputLocationHandler() {
        /*TODO*/
    }

    return (
        <>
            <input className='inputMessageField' ref={messageRef} type="text" placeholder='Aa...'></input>
            <button className='inputSendButton' onClick={sendMessageHandler}>S</button>
            <button className='inputPhotoButton' onClick={inputPhotoHandler}>P</button>
            <button className='inputLocationButton' onClick={inputLocationHandler}>L</button>
        </>
    );
}

export default InputMessage;

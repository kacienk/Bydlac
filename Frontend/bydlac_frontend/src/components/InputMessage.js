import {useContext, useRef, useState} from "react";
import userContext from "../context/UserContext";
import LocationMaps from "./LocationMaps";

import sendIcon from "../images/send_icon.png";
import locationIcon from "../images/location_icon.png";

import './InputMessage.css';

/**
 * Custom Component which represents functionality to send message to specific Conversation Group
 * @returns {JSX.Element} HTML elements: input for new message, send message button and button to show popup with maps to select location to be sent
 */
function InputMessage() {
    const {
        ADDRESS,
        currentGroupId,
        userId,
        userToken
    } = useContext(userContext)

    let {currentMessage} = useContext(userContext)
    const messageRef = useRef();

    /**
     * Function to handle sending message to backend server
     * @param event event from submitting input value in HTML element
     */
    const sendMessageHandler = async (event) => {
        event.preventDefault()

        currentMessage = messageRef.current.value;
        if (currentMessage === '')
            return;

        const response = await fetch(`http://127.0.0.1:8000/api/groups/${currentGroupId}/messages/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${userToken}`
            },
            body: JSON.stringify({
                'body': currentMessage,
                'author': userId,
                'group': currentGroupId,
                'is_location': false
            })
        })

        messageRef.current.value = null;
    }

    const [toggleMaps, setToggleMaps] = useState(false)
    const handleMapsPopup = () => { setToggleMaps(prevState => !prevState) }

    const [location, setLocation] = useState({})
    /**
     * Function to send location as a message
     */
    const sendLocation = async () => {
        console.log("location ", location)
        if (JSON.stringify(location) !== "{}") {
            const response = await fetch(`http://127.0.0.1:8000/api/groups/${currentGroupId}/messages/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                },
                body: JSON.stringify({
                    'body': JSON.stringify(location),
                    'author': userId,
                    'group': currentGroupId,
                    'is_location': true
                })
            })

            handleMapsPopup()
        }
        else
            alert("Lokalizacja nie została wybrana, spróbuj jeszcze raz")
    }

    return (
        <div className="inputMessage" onSubmit={sendMessageHandler}>
            <form className="inputMessage">
                <input
                    className='inputMessageField'
                    ref={messageRef}
                    type="text"
                    placeholder='Aa...' >
                </input>
                <button
                    className='inputSendButton'
                    type="submit" >
                    <img className="sendIcon" src={ sendIcon } alt=''/>
                </button>

                <button
                    type="button"
                    className='inputLocationButton'
                    onClick={ handleMapsPopup } >
                    <img className="locationIcon" src={ locationIcon } alt=''/>
                </button>
            </form>

            {toggleMaps &&
                <LocationMaps
                    handleMapsPopup={ handleMapsPopup }
                    setLocation={ setLocation }
                    submitLocation={ sendLocation }
                    markerPosition={ {lat: 0, lng: 0} }
                    markerVisibility={ false } />}
        </div>

    );
}

export default InputMessage;

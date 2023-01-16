import userContext from "../context/UserContext";
import {useContext, useEffect, useState} from "react";
import LocationMaps from "./LocationMaps";
import {format, parseISO} from "date-fns";

import "./Message.css";

const Message = ({message}) => {
    const {ADDRESS, userId} = useContext(userContext)

    const [whoseMessage, setWhoseMessage] = useState('')
    const [messageTime, setMessageTime] = useState(new Date(parseISO(message.edited)))

    useEffect(() => {
        if (message.author === userId)
            setWhoseMessage('userMessage')
        else
            setWhoseMessage('otherMessage')
    }, [message])

    const [toggleMaps, setToggleMaps] = useState(false)
    const handleMapsPopup = () => { setToggleMaps(prevState => !prevState) }

    return (
        <div>
            { message.is_location ?
                <div className={whoseMessage + "Box"}>
                    <div className="blankSpace" ></div>

                    <div>
                        <div className={whoseMessage + "Author"}> {message.username} </div>
                        <button className={whoseMessage + "LocationButton"} onClick={ handleMapsPopup }>
                            {whoseMessage === 'userMessage' ? "Przesłano lokalizację" : message.username + " wysłał(a) lokalizację"}
                        </button>
                        <div className={whoseMessage + "Time"}> {format(messageTime, 'dd.MM.y HH:mm')} </div>
                    </div>
                </div> :
                <div className={whoseMessage + "Box"}>
                    <div className="blankSpace"></div>

                    <div>
                        <div className={whoseMessage + "Author"}> {message.username} </div>
                        <div className={whoseMessage}> {message.body} </div>
                        <div className={whoseMessage + "Time"}> {format(messageTime, 'dd.MM.y HH:mm')} </div>
                    </div>
                </div> }

            { toggleMaps &&
                <LocationMaps
                    handleMapsPopup={ handleMapsPopup }
                    setLocation={ null }
                    submitLocation={ handleMapsPopup }
                    markerPosition={ JSON.parse(message.body) }
                    markerVisibility={ true } /> }
        </div>
    )
}

export default Message;
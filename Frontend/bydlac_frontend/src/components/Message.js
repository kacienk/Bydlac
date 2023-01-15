import userContext from "../context/UserContext";
import {useContext, useEffect, useState} from "react";
import "./Message.css"
import LocationMaps from "./LocationMaps";

const Message = ({message}) => {
    const {userId} = useContext(userContext)

    const [whoseMessage, setWhoseMessage] = useState('')
    useEffect(() => {
        if (message.author === userId)
            setWhoseMessage('userMessage')
        else
            setWhoseMessage('otherMessage')
    }, [])

    const [toggleMaps, setToggleMaps] = useState(false)
    const handleMapsPopup = () => { setToggleMaps(prevState => !prevState) }

    return (
        <div>
            { message.is_location ?
                <button onClick={ handleMapsPopup }> Pokaż lokalizację </button> :
                <div className={whoseMessage}>{message.body} {message.is_location}</div> }

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
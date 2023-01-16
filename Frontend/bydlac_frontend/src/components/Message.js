import userContext from "../context/UserContext";
import {useContext, useEffect, useState} from "react";
import LocationMaps from "./LocationMaps";
import {format, parseISO} from "date-fns";

import "./Message.css";

const Message = ({message}) => {
    const {ADDRESS, userId, userToken} = useContext(userContext)

    const [whoseMessage, setWhoseMessage] = useState('')
    const [messageAuthor, setMessageAuthor] = useState('')
    const [messageTime, setMessageTime] = useState(new Date(parseISO(message.edited)))

    useEffect(() => {
        const findAuthor = async () => { // TODO
            const findAuthorResponse = await fetch(`http://192.168.92.21:8000/api/users/${message.author}/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                }
            })
            const findAuthorData = await findAuthorResponse.json()
            setMessageAuthor(findAuthorData['username'])
        }

        findAuthor()

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
                        <div className={whoseMessage + "Author"}> {messageAuthor} </div>
                        <button className={whoseMessage + "LocationButton"} onClick={ handleMapsPopup }>
                            {whoseMessage === 'userMessage' ? "Przesłano lokalizację" : messageAuthor + " wysłał(a) lokalizację"}
                        </button>
                        <div className={whoseMessage + "Time"}> {format(messageTime, 'dd.MM.y HH:mm')} </div>
                    </div>
                </div> :
                <div className={whoseMessage + "Box"}>
                    <div className="blankSpace"></div>

                    <div>
                        <div className={whoseMessage + "Author"}> {messageAuthor} </div>
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
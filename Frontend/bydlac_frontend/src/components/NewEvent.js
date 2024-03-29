import React, {useContext, useState} from "react";
import userContext from "../context/UserContext";
import {useNavigate} from "react-router-dom";
import {DateTimePicker} from "@mui/x-date-pickers";
import {TextField} from "@mui/material";
import LocationMaps from "./LocationMaps";

import "./NewEvent.css";

/**
 * Custom Component which represents new Event form and
 * handles sending requests to create Event alongside with Conversation Group in backend server
 * @returns {JSX.Element} Form containing all new Event's details to fulfill: name, description, number of participants, location, expiration date, option to create Conversation Group attached to Event
 */
const NewEvent = () => {
    const {
        ADDRESS,
        userId,
        userToken,
    } = useContext(userContext)

    const [newEventName, setNewEventName] = useState('')
    const [newEventDescription, setNewEventDescription] = useState('')
    const [newEventMaxParticipants, setNewEventMaxParticipants] = useState(1)
    const [newEventLocation, setNewEventLocation] = useState('')
    const [newEventExpirationDate, setNewEventExpirationDate] = useState(Date())

    const [addGroupToEvent, setAddGroupToEvent] = useState(false)
    const addGroup = () => { setAddGroupToEvent(prevState => !prevState) }

    const navigate = useNavigate()

    /**
     * Function to send request to backend server with all information about new Event and new Conversation Group (if chosen)
     * @param e event from submitting input value in HTML element
     */
    const newEventSubmitHandler = async (e) => {
        e.preventDefault()

        const createEventResponse = await fetch(`http://127.0.0.1:8000/api/events/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${userToken}`
            },
            body: JSON.stringify({
                host: userId,
                name: newEventName,
                description: newEventDescription,
                max_participants: newEventMaxParticipants,
                location: JSON.stringify(newEventLocation),
                expires: newEventExpirationDate
            })
        })
        const newEventData = await createEventResponse.json()
        const newEventId = await newEventData['id']

        if (addGroupToEvent) {
            const createGroupToEventResponse = await fetch(`http://127.0.0.1:8000/api/events/${newEventId}/group/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                }
            })
            if (!createGroupToEventResponse.ok)
                alert("Błąd podczas tworzenia grupy do wydarzenia")
        }

        if (createEventResponse.ok) {
            navigate('/event/' + newEventId)
        }
        else
            alert("Błąd podczas procesu tworzenia wydarzenia")
    }

    const [toggleMaps, setToggleMaps] = useState(false)
    const handleMapsPopup = () => { setToggleMaps(prevState => !prevState) }

    return (
        <div id='newEventBox'>
            <div >
                <form id='newEventForm' onSubmit={newEventSubmitHandler}>
                    <p className='newEventPageText'>Nazwa wydarzenia: </p>
                    <input id='newEventPageInput'
                           type="text"
                           required
                           placeholder="Nazwa"
                           onChange={(event) => setNewEventName(event.target.value)}
                    />

                    <p className='newEventPageText'>Opis:</p>
                    <textarea
                        id='newEventPageTextarea'
                        onChange={(event) => setNewEventDescription(event.target.value)}
                    ></textarea>

                    <p className='newEventPageText'>Maksymalna liczba uczestników: </p>
                    <input id='newEventPageInput'
                           type="text"
                           required
                           placeholder="Liczba"
                           onChange={(event) => setNewEventMaxParticipants(Number(event.target.value))}
                    />

                    <button type="button" id="newEventPageButton" style={{marginTop: "10px"}}
                            onClick={ handleMapsPopup } >
                        Dodaj lokalizację wydarzenia
                    </button>
                    { newEventLocation !== '' ?
                        (<p className='newEventPageText' style={{margin: "unset"}} >Lokalizacja wybrana pomyślnie!</p>) :
                        (<p className='newEventPageText' style={{margin: "unset"}} >Nie wybrano lokalizacji</p>) }

                    <p className='newEventPageText' style={{margin: "unset"}} >
                        Dodaj termin wydarzenia:
                    </p>
                    <DateTimePicker
                        ampm={false}
                        disablePast={true}
                        onChange={(newValue) => setNewEventExpirationDate(newValue)}
                        value={newEventExpirationDate}
                        inputFormat="dd.MM.yyyy HH:mm"
                        renderInput={(props) => <TextField {...props} />} />

                    <button type="button" id="newEventPageButton" style={{height: "70px", marginTop: "10px", marginBottom: "10px"}}
                            onClick={ addGroup } >
                        {addGroupToEvent ? "Anuluj tworzenie konwersacji do wydarzenia" : "Stwórz konwersację do wydarzenia"}
                    </button>

                    <button id='newEventPageButton' style={{marginBottom: "10px"}} >Stwórz wydarzenie</button>
                </form>
            </div>

            {toggleMaps &&
                <LocationMaps
                    handleMapsPopup={ handleMapsPopup }
                    setLocation={ setNewEventLocation }
                    submitLocation={ handleMapsPopup }
                    markerPosition={ {lat: 0, lng: 0} }
                    markerVisibility={ false } /> }
        </div>
    )
}

export default NewEvent;

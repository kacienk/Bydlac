import React, {useContext, useState} from "react";
import userContext from "../context/UserContext";
import {useNavigate} from "react-router-dom";
import {DateTimePicker} from "@mui/x-date-pickers";
import {TextField} from "@mui/material";
import LocationMaps from "./LocationMaps";

import "./NewEvent.css";

const NewEvent = () => {
    const {
        userId,
        userToken,
        setUserEvents
    } = useContext(userContext)
    let {userEvents} = useContext(userContext)


    const [newEventName, setNewEventName] = useState('')
    const [newEventDescription, setNewEventDescription] = useState('')
    const [newEventMaxParticipants, setNewEventMaxParticipants] = useState(1)
    const [newEventLocation, setNewEventLocation] = useState('')
    const [newEventExpirationDate, setNewEventExpirationDate] = useState(Date())

    const [addGroupToEvent, setAddGroupToEvent] = useState(false)
    const [newGroupName, setNewGroupName] = useState('')
    const [newGroupDescription, setNewGroupDescription] = useState('')

    const addGroup = () => { setAddGroupToEvent(prevState => !prevState) }


    const navigate = useNavigate()

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
                location: newEventLocation,
                expires: newEventExpirationDate
            })
        })
        const newEventData = await createEventResponse.json()
        const newEventId = newEventData['id']
        //userEvents = setUserEvents(userEvents => [...userEvents, newEventData])

        if (addGroupToEvent) {
            const createGroupToEventResponse = await fetch(`http://127.0.0.1:8000/api/events/${newEventId}/group/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                }
            })
            //const newGroupToEventData = await
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
            <div id='newEventInnerBox'>
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


                    <button type="button"
                            onClick={ handleMapsPopup } >
                        Dodaj lokalizację wydarzenia
                    </button>
                    { newEventLocation !== '' ?
                        (<p>Lokalizacja wybrana pomyślnie!</p>) :
                        (<p>Nie wybrano lokalizacji</p>) }


                    <DateTimePicker
                        ampm={false}
                        disablePast={true}
                        onChange={(newValue) => setNewEventExpirationDate(newValue)}
                        value={newEventExpirationDate}
                        renderInput={(props) => <TextField {...props} /> /* TODO style all this */} />

                    <button type="button"
                            onClick={ addGroup } >
                        {addGroupToEvent ? "Anuluj tworzenie grupy do tego wydarzenia" : "Stwórz grupę do tego wydarzenia"}
                    </button>

                    {addGroupToEvent && (
                        <div>
                            <p className='newGroupPageText'>Nazwa konwersacji: </p>
                            <input id='newGroupPageInput'
                                   type="text"
                                   required
                                   placeholder="Nazwa"
                                   onChange={(event) => {setNewGroupName(event.target.value)}}
                            />

                            <p className='newGroupPageText'>Opis:</p>
                            <textarea
                                id='newGroupPageTextarea'
                                onChange={(event) => {setNewGroupDescription(event.target.value)}}
                            ></textarea>
                        </div>
                    )}

                    <button id='newEventPageButton'>Stwórz wydarzenie</button>
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
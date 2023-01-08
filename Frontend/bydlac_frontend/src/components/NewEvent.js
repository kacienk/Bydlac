import React, {useContext, useEffect, useReducer, useState} from "react";
import userContext from "../context/UserContext";
import {useNavigate} from "react-router-dom";
import CreatableSelect from "react-select/creatable";
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
    const [newSelectedUser, setNewSelectedUser] = useState('');
    const [selectedUsersList, setSelectedUsersList] = useState([]);

    const handleKeyDown = (event) => {
        if (!newSelectedUser)
            return;

        switch (event.key) {
            case 'Enter':
            case 'Tab':
                setSelectedUsersList((prev) => [...prev, newSelectedUser]);
                setNewSelectedUser('');
                event.preventDefault();
        }
    };

    const navigate = useNavigate()

    const newEventSubmitHandler = async (e) => {
        e.preventDefault()

        let response = await fetch(`http://127.0.0.1:8000/api/events/`, {
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
        const data = await response.json()
        const newEventId = data['id']
        userEvents = setUserEvents(userEvents => [...userEvents, data])

        // TODO check this part after Kacper corrects endpoints
        selectedUsersList.map(async (user) => {
            const userIdResponse = await fetch(`http://127.0.0.1:8000/api/users/from-username/?username=${user}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                }
            })
            const userData = await userIdResponse.json()


            let addUserToEventResponse = await fetch(`http://127.0.0.1:8000/api/events/${newEventId}/participants/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                },
                body: JSON.stringify({
                    user: userData.id,
                    group: newEventId,
                    is_moderator: false
                })
            })
        })
        if (response.ok) {
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

                    <p className='newGroupPageText'>Dodaj członków:</p>
                    <div id='newGroupUsers'>
                        <CreatableSelect
                            components={{ DropdownIndicator: null, }}
                            inputValue={newSelectedUser}
                            isClearable
                            isMulti
                            menuIsOpen={false}
                            onChange={(newValue) => setSelectedUsersList(newValue)}
                            onInputChange={(newValue) => setNewSelectedUser(newValue)}
                            onKeyDown={handleKeyDown}
                            placeholder="Wpisz nazwy użytkowników oddzielając je enterem"
                            value={selectedUsersList}
                            getOptionLabel={(user) => user}
                        />
                    </div>

                    <button id='newEventPageButton'>Stwórz konwersację</button>
                </form>
            </div>

            {toggleMaps &&
                <LocationMaps
                    handleMapsPopup={ handleMapsPopup }
                    setLocation={ setNewEventLocation }
                    markerPosition={ {lat: 0, lng: 0} }
                    markerVisibility={ false } /> }
        </div>
    )
}

export default NewEvent;
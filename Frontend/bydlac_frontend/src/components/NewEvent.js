import {useContext, useEffect, useReducer, useState} from "react";
import userContext from "../context/UserContext";
import {useNavigate} from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import {DateTimePicker} from "@mui/x-date-pickers";
import {TextField} from "@mui/material";
import LocationMaps from "./LocationMaps";


const NewEvent = () => {
    const {
        userId,
        userToken,
        setUserEvents
    } = useContext(userContext)
    let {userEvents} = useContext(userContext)

    const initialEvent = {
        name: "",
        description: "",
        max_participants: 1,
        location: "",
        expires: ""
    }
    const reducer = (state, action) => {
        switch (action.type) {
            case 'changeName':
                return {name: action.name}
            case 'changeDescription':
                return {description: action.description}
            case 'changeMaxParticipants':
                return {max_participants: action.max_participants}
            case 'changeLocation':
                return {location: action.location}
            case 'changeExpires':
                return {expires: action.expires}
            default:
                alert("coś się zepsuło w setNewEvent: reducer") // TODO
        }
    }
    const [newEvent, setNewEvent] = useReducer(reducer, initialEvent)
    const [selectedUsers, setSelectedUsers] = useState([])

    const navigate = useNavigate()

    const newEventSubmitHandler = async (e) => {
        e.preventDefault()

        let response = await fetch(`http://127.0.0.1:8000/api/events/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${userToken}`
            },
            body: JSON.stringify(newEvent)
        })
        const data = await response.json()
        const newEventId = data['id']
        userEvents = setUserEvents(userEvents => [...userEvents, data])

        // TODO check this part after Kacper corrects endpoints
        selectedUsers.map(async (user) => {
            let response2 = await fetch(`http://127.0.0.1:8000/api/events/${newEventId}/participants/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                },
                body: JSON.stringify({
                    user: user.id,
                    group: newEventId,
                    is_moderator: false
                })
            })
            if (response.ok && response2.ok) {
                navigate('/event/' + newEventId)
            }
            else
                alert("Błąd podczas procesu tworzenia wydarzenia")
        })
    }

    const [toggleMaps, setToggleMaps] = useState(false)
    const handleMapsPopup = () => {
        setToggleMaps(prevState => !prevState)
    }

    // TODO
    const [tempDate, setTempDate] = useState(Date())

    return (
        <div id='newGroupBox'>
            <form id='newGroupForm' onSubmit={newEventSubmitHandler}>
                <p className='newGroupPageText'>Nazwa wydarzenia: </p>
                <input id='newGroupPageInput'
                       type="text"
                       required
                       placeholder="Nazwa"
                       onChange={(event) => setNewEvent({type: 'changeName', name: event.target.value})}
                />

                <p className='newGroupPageText'>Opis:</p>
                <textarea
                    id='newGroupPageTextarea'
                    onChange={(event) => setNewEvent({type: 'changeDescription', description: event.target.value})}
                ></textarea>

                <p className='newGroupPageText'>Maksymalna liczba uczestników: </p>
                <input id='newGroupPageInput'
                       type="text"
                       required
                       placeholder="Liczba"
                       onChange={(event) => setNewEvent({type: 'changeMaxParticipants', max_participants: event.target.value})}
                />





                <DateTimePicker
                    ampm={false}
                    disablePast={true}
                    onChange={(newValue) => setTempDate(newValue)}
                    value={tempDate}
                    renderInput={(props) => <TextField {...props} /> /* TODO style all this */} />


                <button id='newGroupPageButton'>Stwórz konwersację</button>
            </form>
            <button onClick={ handleMapsPopup } >
                Dodaj lokalizację wydarzenia
            </button>

            {toggleMaps && <LocationMaps /> /*TODO fix the layout*/}
        </div>
    )
}

export default NewEvent;
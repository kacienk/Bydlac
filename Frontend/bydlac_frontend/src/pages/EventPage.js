import React, {useContext, useEffect, useState} from "react";
import User from "../components/User";
import {Link, useNavigate} from "react-router-dom";
import ListHeader from "../components/ListHeader";
import userContext from "../context/UserContext";
import LocationMaps from "../components/LocationMaps";

const EventDetails = () => {
    const {
        userToken,
        userId,
        currentEventId,
        userEvents
    } = useContext(userContext)

    const [event, setEvent] = useState({})
    const [eventParticipants, setEventParticipants] = useState([])
    const [isParticipant, setIsParticipant] = useState(false)
    const [groupIdToCurrentEvent, setGroupIdToCurrentEvent] = useState(null)

    const [trigger, setTrigger] = useState(false)

    useEffect(() => {
        const findCurrentEvent = () => {
            userEvents.find((obj) => {
                if (obj.id === currentEventId)
                    setEvent(obj)
            })
        }

        findCurrentEvent()
    }, [currentEventId, trigger])

    useEffect(() => {
        const getEventParticipants = async () => {
            const eventParticipantsResponse = await fetch(`http://127.0.0.1:8000/api/events/${currentEventId}/participants/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                }
            })
            const eventParticipantsData = await eventParticipantsResponse.json()
            setEventParticipants(eventParticipantsData)
            console.log("getEventParticipants: ", eventParticipantsData)
            console.log("event details: ", event)
        }

        getEventParticipants()
    }, [currentEventId, trigger])

    useEffect(() => {
        const isParticipantChecker = () => {
            const res = eventParticipants.some((participant) => { return participant.id === userId })
            setIsParticipant(res)
        }

        isParticipantChecker()
    })

    useEffect(() => {
        const getGroupToEvent = async () => {
            const response = await fetch(`http://127.0.0.1:8000/api/events/${currentEventId}/group/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                }
            })
            const data = await response.json()
            setGroupIdToCurrentEvent(data['id'])
        }

        getGroupToEvent()
    }, [currentEventId])

    const [toggleMaps, setToggleMaps] = useState(false)
    const handleMapsPopup = () => { setToggleMaps(prevState => !prevState) }

    const navigate = useNavigate()

    const deleteEvent = async () => {
        const deletedResponse = await fetch(`http://127.0.0.1:8000/api/events/${currentEventId}/`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${userToken}`
            }
        })
        if (deletedResponse.ok) {
            alert("usunięto wydarzenie")
        }
        else
            alert(deletedResponse.status)
    }

    const joinEvent = async () => {
        const userJoinedEventResponse = await fetch(`http://127.0.0.1:8000/api/events/${currentEventId}/join/`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${userToken}`
            }
        })

        if (userJoinedEventResponse.ok) {
            setTrigger(prevState => !prevState)
        }
        else
            alert(userJoinedEventResponse.status)
    }

    const leaveEvent = async () => {
        const userLeftEventResponse = await fetch(`http://127.0.0.1:8000/api/events/${currentEventId}/leave/`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${userToken}`
            }
        })

        if (userLeftEventResponse.ok) {
            setTrigger(prevState => !prevState)
        }
        else
            alert(userLeftEventResponse.status)
    }

    return (
        <div>
            <div>
                <h2> {event.name} </h2>

                <h3> Opis: </h3>
                <p> {event.description} </p>

                <h3> Stworzony: </h3>
                <p> {event.created} </p>
                <h3> Kończy się: </h3>
                <p> {event.expires} </p>

                <h3> Lokalizacja: </h3>
                <button onClick={ handleMapsPopup }>
                    Pokaż lokalizację
                </button>

                <h3> Ilość uczestników: </h3>
                <p> {eventParticipants.length} / {event.max_participants} </p>

                <h3> Uczestnicy wydarzenia: </h3>
                <div>
                    { eventParticipants.map(participant =>
                        <User key={participant.id} className="otherPerson" otherUser={participant} />) }
                </div>


                { event.host === userId ? (
                    <button onClick={ deleteEvent }>
                        Usuń wydarzenie
                    </button>
                ) : (isParticipant ?
                    <button onClick={ leaveEvent } >
                        Opuść wydarzenie
                    </button> :
                    <button onClick={ joinEvent } >
                        Dołącz do wydarzenia
                    </button> ) }

                { groupIdToCurrentEvent &&
                    <button onClick={ () => { navigate(`/chat/${groupIdToCurrentEvent}`) } } >
                        Przejdź do konwersacji związanej z tym wydarzeniem
                    </button> }

            </div>

            {toggleMaps &&
                <LocationMaps
                    handleMapsPopup={ handleMapsPopup }
                    setLocation={ null }
                    markerPosition={ event.location }
                    markerVisibility={ true } /> }

        </div>
    )
}

const EventPage = () => {
    return (
        <div className='mainView'>
            <div>
                <div className='usersHeader'>
                    <Link id='logoutContainer' to={'/logout'}>
                        <button className="logoutButton">
                            Wyloguj
                        </button>
                    </Link>
                    <User className='you' favorite={ null }/>
                </div>

                <EventDetails />
            </div>
            <div id='TEMPgroupList'>
                <ListHeader whichToShow={ false }/>
            </div>
        </div>
    )
}


export default EventPage;
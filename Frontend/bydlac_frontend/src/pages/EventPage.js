import React, {useContext, useEffect, useState} from "react";
import User from "../components/User";
import {useNavigate} from "react-router-dom";
import ListHeader from "../components/ListHeader";
import userContext from "../context/UserContext";
import LocationMaps from "../components/LocationMaps";
import UsersHeader from "../components/UsersHeader";
import {format, parseISO} from "date-fns";

import "./EventPage.css";

/**
 * Custom Component which represents detailed information about specific Event
 * @returns {JSX.Element} Elements such as Event name, description, creation date, expiration date, location (in popup),
 * current number of participants vs. maximum number of them, all participants with option to display their account's details,
 * button to join/leave Event and button to go to Conversation Group connected with this Event
 */
const EventDetails = () => {
    const {
        ADDRESS,
        userToken,
        userId,
        currentEventId,
        userEvents,
        changeCurrentGroupId
    } = useContext(userContext)

    const [event, setEvent] = useState({})
    const [eventParticipants, setEventParticipants] = useState([])
    const [isParticipant, setIsParticipant] = useState(false)
    const [groupIdToCurrentEvent, setGroupIdToCurrentEvent] = useState(null)

    const [trigger, setTrigger] = useState(false)

    useEffect(() => {
        /**
         * Function to find current Event based on its ID from backend server
         */
        const findCurrentEvent = () => {
            userEvents.find((obj) => {
                if (obj.id === currentEventId)
                    setEvent(obj)
            })
        }

        findCurrentEvent()
    }, [currentEventId, trigger])

    useEffect(() => {
        /**
         * Function to obtain list of Event Participants from backend server
         */
        const getEventParticipants = async () => {
            const eventParticipantsResponse = await fetch(`${ADDRESS}/events/${currentEventId}/participants/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                }
            })
            const eventParticipantsData = await eventParticipantsResponse.json()
            setEventParticipants(eventParticipantsData)
        }

        if (currentEventId !== null)
            getEventParticipants()
    }, [currentEventId, trigger])

    useEffect(() => {
        /**
         * Function to check whether currently logged-in user is participant of this Event
         */
        const isParticipantChecker = () => {
            const res = eventParticipants.some((participant) => { return participant.id === userId })
            setIsParticipant(res)
        }

        isParticipantChecker()
    })

    useEffect(() => {
        /**
         * Function to obtain Conversation Group connected to this Event (if it exists) from backend server
         * @returns {Promise<void>}
         */
        const getGroupToEvent = async () => {
            const response = await fetch(`${ADDRESS}/events/${currentEventId}/group/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                }
            })
            const data = await response.json()
            setGroupIdToCurrentEvent(data['id'])
        }

        if (currentEventId !== null)
            getGroupToEvent()
    }, [currentEventId])

    const [eventCreatedDate, setEventCreatedDate] = useState(new Date())
    const [eventExpiresDate, setEventExpiresDate] = useState(new Date())

    useEffect(() => {
        const setDates = () => {
            if (event.created) {
                setEventCreatedDate(parseISO(event.created))
                setEventExpiresDate(parseISO(event.expires))
            }
        }

        setDates()
    }, [event])

    const [toggleMaps, setToggleMaps] = useState(false)
    const handleMapsPopup = () => { setToggleMaps(prevState => !prevState) }

    const navigate = useNavigate()

    /**
     * Function to send information about Event deletion to backend server
     */
    const deleteEvent = async () => {
        const deletedResponse = await fetch(`${ADDRESS}/events/${currentEventId}/`, {
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

    /**
     * Function to send information about currently logged-in user joining this Event to backend server
     */
    const joinEvent = async () => {
        const userJoinedEventResponse = await fetch(`${ADDRESS}/events/${currentEventId}/join/`, {
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

    /**
     * Function to send information about currently logged-in user leaving this Event to backend server
     */
    const leaveEvent = async () => {
        const userLeftEventResponse = await fetch(`${ADDRESS}/events/${currentEventId}/leave/`, {
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
        <div id="eventDetailsBox">
            <div id="eventDetailsInnerBox">
                <h2 id="eventDetailsName"> {event.name} </h2>

                <h3 className="eventDetailsH" > Opis: </h3>
                <p className="eventDetailsText" > {event.description} </p>

                <h3 className="eventDetailsH" > Stworzony: </h3>
                <p className="eventDetailsText" > {format(eventCreatedDate, 'dd.MM.y HH:mm')} </p>
                <h3 className="eventDetailsH" > Kończy się: </h3>
                <p className="eventDetailsText" > {format(eventExpiresDate, 'dd.MM.y HH:mm')} </p>

                <h3 className="eventDetailsH" > Lokalizacja: </h3>
                <button className="eventDetailsButton" onClick={ handleMapsPopup }>
                    Pokaż lokalizację
                </button>

                <h3 className="eventDetailsH" > Ilość uczestników: </h3>
                <p className="eventDetailsText" > {eventParticipants.length} / {event.max_participants} </p>

                <h3 className="eventDetailsH" > Uczestnicy wydarzenia: </h3>
                <div id="eventDetailsParticipants">
                    { eventParticipants.map(participant =>
                        <User key={participant.id} className="otherPerson" userId={participant.id} />) }
                </div>


                { event.host === userId ? (
                    <button className="eventDetailsButton" style={{marginBottom: "10px", marginTop: "10px"}} onClick={ deleteEvent }>
                        Usuń wydarzenie
                    </button>
                ) : (isParticipant ?
                    <button className="eventDetailsButton" style={{marginBottom: "10px", marginTop: "10px"}} onClick={ leaveEvent } >
                        Opuść wydarzenie
                    </button> :
                    <button className="eventDetailsButton" style={{marginBottom: "10px", marginTop: "10px"}} onClick={ joinEvent } >
                        Dołącz do wydarzenia
                    </button> ) }

                { groupIdToCurrentEvent &&
                    <button className="eventDetailsButton" style={{marginBottom: "10px"}} onClick={ () => {
                        changeCurrentGroupId(groupIdToCurrentEvent)
                        navigate(`/chat/${groupIdToCurrentEvent}`) } } >
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

/**
 * Custom Component which represents Event view with detailed information (see: {@link EventDetails}) of specific Event
 * @returns {JSX.Element} Complete view containing logout button, currently logged-in user, detailed information of Event
 * and list of all user's Conversation Groups or Events along with button to create new Group or Event
 */
const EventPage = () => {
    return (
        <div className='mainView'>
            <div>
                <UsersHeader />

                <EventDetails />
            </div>

            <ListHeader whichToShow={ false }/>
        </div>
    )
}


export default EventPage;
import Event from "./Event";
import {Link} from "react-router-dom";
import {useContext} from "react";
import userContext from "../context/UserContext";

import "./EventList.css"

/**
 * Custom Component which represents list of Events (see: {@link ./Event.js})
 * @returns {JSX.Element} HTML element with button - link to create new Event and all Event elements
 */
const EventList = () => {
    const {userEvents} = useContext(userContext)

    return (
        <div className="eventList">

            <Link to={'/new/event'}>
                <button id='newEventButton'>Nowe wydarzenie</button>
            </Link>

            { userEvents.map(event => (<Event key={event.id} event={event}/>)) }
        </div>
    )
}

export default EventList;
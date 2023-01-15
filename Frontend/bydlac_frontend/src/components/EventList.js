import Event from "./Event";
import {Link} from "react-router-dom";
import {useContext} from "react";
import userContext from "../context/UserContext";

import "./EventList.css"

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
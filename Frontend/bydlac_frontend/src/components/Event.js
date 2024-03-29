import {useContext} from "react";
import userContext from "../context/UserContext";
import {Link} from "react-router-dom";

import "./Event.css";

/**
 * Custom Component which represents single Event
 * @param event Event's data object obtained from server
 * @returns {JSX.Element} Display Event as HTML button element - when clicked it redirects to page with Event details
 */
const Event = ({event}) => {
    let {changeCurrentEventId} = useContext(userContext)

    const handleClick = (event) => {
        changeCurrentEventId(Number(event.target.value))
    }

    return (
        <Link to={`/event/${event.id}`}>
            <button
                id="eventButton"
                onClick={handleClick}
                value={event.id}>
                {event.name}
            </button>
        </Link>
    )
}

export default Event;
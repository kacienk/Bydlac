import Event from "./Event";
import GetEvents from "../trash/GetEvents";
import "./EventList.css"
import {Link} from "react-router-dom";

const EventList = () => {
    let eventsList = GetEvents()
    //console.log("/EventList.js/ lista Event", eventsList)

    return (
        <div className="eventList">

            <Link to={'/new/event'}>
                <button id='newEventButton'>Nowe wydarzenie</button>
            </Link>

            {
                eventsList.map(event => (<Event key={event.id} event={event}/>))
            }
        </div>
    )
}

export default EventList;
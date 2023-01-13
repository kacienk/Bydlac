import GroupList from "./GroupList";
import EventList from "./EventList";
import {useState} from "react";

const ListHeader = ({whichToShow}) => {
    const [whichListToShow, setWhichListToShow] = useState(whichToShow)

    return (
        <div>
            <button onClick={ () => setWhichListToShow(prevState => !prevState) } >
                {whichListToShow ? "Pokaż wydarzenia" : "Pokaż konwersacje"}
            </button>

            {whichListToShow && <GroupList />}
            {!whichListToShow && <EventList />}
        </div>
    )
}

export default ListHeader;
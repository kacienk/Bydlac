import GroupList from "./GroupList";
import EventList from "./EventList";
import {useState} from "react";

const ListHeader = () => {
    const [whichListToShow, setWhichListToShow] = useState(true)

    return (
        <div>
            <button onClick={ () => setWhichListToShow(prevState => !prevState) } >
                Grupy
            </button>

            <button onClick={ () => setWhichListToShow(prevState => !prevState) } >
                Wydarzenia
            </button>

            {whichListToShow && <GroupList />}
            {!whichListToShow && <EventList />}
        </div>
    )
}

export default ListHeader;
import GroupList from "./GroupList";
import EventList from "./EventList";
import {useState} from "react";

import "./ListHeader.css";

/**
 * Custom Component which represents choice of lists to display (see: {@link GroupList} and {@link EventList})
 * @param whichToShow variable representing which list to show depending on Parent Component
 * @returns {JSX.Element} HTML element - button with functionality to switch between Group List and Event List
 */
const ListHeader = ({whichToShow}) => {
    const [whichListToShow, setWhichListToShow] = useState(whichToShow)

    return (
        <div id="inListHeader">
            <button id="whichListToShowButton"
                    onClick={ () => setWhichListToShow(prevState => !prevState) } >
                {whichListToShow ? "Pokaż wydarzenia" : "Pokaż konwersacje"}
            </button>

            {whichListToShow && <GroupList />}
            {!whichListToShow && <EventList />}
        </div>
    )
}

export default ListHeader;
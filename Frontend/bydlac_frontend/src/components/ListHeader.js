import GroupList from "./GroupList";
import EventList from "./EventList";
import {useState} from "react";

const ListHeader = () => {
    const [showGroupsList, setShowGroupsList] = useState(true)
    const [showFavouritesList, setShowFavouritesList] = useState(false)
    const [showEventsList, setShowEventsList] = useState(false)

    const handleGroupsButton = () => {
        if (showGroupsList === false) {
            if (showFavouritesList === true)
                setShowFavouritesList(current => ! current)
            else
                setShowEventsList(current => !current)
            setShowGroupsList(current => !current)
        }
    }

    const handleFavouritesButton = () => {
        if (showFavouritesList === false) {
            if (showGroupsList === true)
                setShowGroupsList(current => ! current)
            else
                setShowEventsList(current => !current)
            setShowFavouritesList(current => !current)
        }
    }

    const handleEventsButton = () => {
        if (showEventsList === false) {
            if (showFavouritesList === true)
                setShowFavouritesList(current => ! current)
            else
                setShowGroupsList(current => !current)
            setShowEventsList(current => !current)
        }
    }

    return (
        <div>
            <button onClick={handleGroupsButton}>Grupy</button>
            <button onClick={handleFavouritesButton}>Ulubione</button>
            <button onClick={handleEventsButton}>Wydarzenia</button>

            {showGroupsList && <GroupList isFavList={false} />}
            {showFavouritesList && <GroupList isFavList={true} />}
            {showEventsList && <EventList />}
        </div>
    )
}

export default ListHeader;
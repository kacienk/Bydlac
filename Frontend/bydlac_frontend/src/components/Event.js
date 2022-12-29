import {useContext} from "react";
import userContext from "../context/UserContext";
import {Link} from "react-router-dom";
import "./Event.css"

const Event = ({Event}) => {
/*    let {currentGroupId} = useContext(userContext)
    let {changeCurrentGroupId} = useContext(userContext)

    const handleClick = (event) => {
        changeCurrentGroupId(Number(event.target.value))
    }

    return (
        <Link to={`/chat/${currentGroupId}`}>
            <button
                className="groupButton"
                onClick={handleClick}
                value={group.id}>
                Nazwa grupy: {group.name}
            </button>
        </Link>
    )*/
}

export default Event;
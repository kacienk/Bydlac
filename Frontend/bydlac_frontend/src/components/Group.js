import {useContext} from "react";
import userContext from "../context/UserContext";
import {Link} from "react-router-dom";
import "./Group.css"

const Group = ({group}) => {
    //console.log(group.id)

    let {currentGroupId} = useContext(userContext)
    let {changeCurrentGroupId} = useContext(userContext)

    const handleClick = (event) => {
        //console.log("handle", event.target.value)
        changeCurrentGroupId(event.target.value)
        console.log("currgrID", currentGroupId)

    }

    //console.log("group : group", group)
    return (
        <Link to={`/chat/${currentGroupId}`}>
            <button className="groupButton" onClick={handleClick} value={group.id}>Nazwa grupy: {group.name}</button>
        </Link>
    )
}

export default Group;


import Group from "./Group";
import {Link} from "react-router-dom";
import {useContext, useState} from "react";
import userContext from "../context/UserContext";

import "./GroupList.css"

/**
 * Custom Component which represents list of Conversation Groups (see: {@link Group})
 * @returns {JSX.Element} HTML element button - link to create new Group and all Group components
 */
const GroupList = () => {
    const {userGroups} = useContext(userContext)

    //const [isUserGroups, setIsUserGroups] = useState(userGroups.length !== 0)

    return (
        <div className="groupList">
            <Link to={'/new/group'}>
                <button id='newGroupButton'>Nowa konwersacja</button>
            </Link>

            { //isUserGroups &&
                userGroups.map(group => (<Group key={group.id} group={group}/>)) }
        </div>
    )
}

export default GroupList;

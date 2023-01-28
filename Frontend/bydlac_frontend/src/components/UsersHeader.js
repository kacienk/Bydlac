import {Link, useParams} from "react-router-dom";
import User from "./User";
import userContext from "../context/UserContext";
import {useContext, useEffect, useState} from "react";

import "./UsersHeader.css"

/**
 * Custom Component which represents header with log out button, User button (see: {@link User}) and Conversation Group name if it its messages are currently displayed
 * @returns {JSX.Element} element with log out button, User button and Conversation Group name
 */
const UsersHeader = () => {
    const {
        userId,
        userGroups,
        currentGroupId
    } = useContext(userContext)
    const [currentGroup, setCurrentGroup] = useState({})

    const params = useParams()
    const [showGroupName, setShowGroupName] = useState(false)

    useEffect(() => {
        const tempCurrentGroup = userGroups.find((group) => {return group.id === currentGroupId})
        setCurrentGroup(tempCurrentGroup)
        setShowGroupName(Number(params.groupId) === currentGroupId)
    }, [currentGroupId])

    return (
        <div>
            <div className='usersHeader'>
                <Link id='logoutContainer' to={'/logout'}>
                    <button className="logoutButton">Wyloguj</button>
                </Link>

                {showGroupName &&
                    <h3 id="groupNameHeader"> {currentGroup.name} </h3>}

                <User className='you' userId={userId} />
            </div>
        </div>
    )
}

export default UsersHeader;

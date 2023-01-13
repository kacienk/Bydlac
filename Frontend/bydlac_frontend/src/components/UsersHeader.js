import {Link} from "react-router-dom";
import User from "./User";
import userContext from "../context/UserContext";
import {useContext, useEffect, useState} from "react";

const UsersHeader = () => {
    const {
        userId,
        userGroups,
        currentGroupId
    } = useContext(userContext)
    const [currentGroup, setCurrentGroup] = useState({})

    useEffect(() => {
        const tempCurrentGroup = userGroups.find((group) => {return group.id === currentGroupId})
        setCurrentGroup(tempCurrentGroup)
    }, [currentGroupId])

    return (
        <div>
            <div className='usersHeader'>
                <Link id='logoutContainer' to={'/logout'}>
                    <button className="logoutButton">Wyloguj</button>
                </Link>

                <h3> {currentGroup ? currentGroup.name : '' } </h3>

                <User className='you' userId={userId} favorite={null}/>
            </div>
        </div>
    )
}

export default UsersHeader;
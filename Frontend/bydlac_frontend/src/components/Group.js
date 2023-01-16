import {useContext, useEffect, useState} from "react";
import userContext from "../context/UserContext";
import {Link, useNavigate} from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import User from "./User";

import "./Group.css"

const GroupOptions = ({groupId, handlePopup}) => {
    const {ADDRESS, userId, userToken} = useContext(userContext)

    const [group, setGroup] = useState({})

    const [groupMembers, setGroupMembers] = useState([])

    const [toggleGroupDetailsButton, setToggleGroupDetailsButton] = useState(true)
    const [toggleDeleteUsersButton, setToggleDeleteUsersButton] = useState(false)
    const [toggleChangeModeratorsButton, setToggleChangeModeratorsButton] = useState(false)
    const [toggleDeleteGroupButton, setToggleDeleteGroupButton] = useState(false)
    const handleTogglingButtons = (button) => {
        switch (button) {
            case 'groupDetails':
                setToggleGroupDetailsButton(true)
                setToggleDeleteUsersButton(false)
                setToggleChangeModeratorsButton(false)
                setToggleDeleteGroupButton(false)
                return;
            case 'deleteUsers':
                setToggleGroupDetailsButton(false)
                setToggleDeleteUsersButton(true)
                setToggleChangeModeratorsButton(false)
                setToggleDeleteGroupButton(false)
                return;
            case 'changeModerators':
                setToggleGroupDetailsButton(false)
                setToggleDeleteUsersButton(false)
                setToggleChangeModeratorsButton(true)
                setToggleDeleteGroupButton(false)
                return;
            case 'deleteGroup':
                setToggleGroupDetailsButton(false)
                setToggleDeleteUsersButton(false)
                setToggleChangeModeratorsButton(false)
                setToggleDeleteGroupButton(true)
                return;
        }
    }

    const [selectedToDelete, setSelectedToDelete] = useState([])

    useEffect(() => {
        const getGroupDetails = async () => {
            const response = await fetch(`http://192.168.92.21:8000/api/groups/${groupId}/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                }
            })
            const data = await response.json()
            setGroup(data)

            const responseMembers = await fetch(`http://192.168.92.21:8000/api/groups/${groupId}/members/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                }
            })
            const dataMembers = await responseMembers.json()
            setGroupMembers(dataMembers)
        }

        getGroupDetails()
    }, [selectedToDelete])

    const deleteUsers = () => {
        console.log("selectedToDelete: ", selectedToDelete)
        selectedToDelete.map(async (user) => {
            const response = await fetch(`http://192.168.92.21:8000/api/groups/${groupId}/members/${user.user}/`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                }
            })

            if (!response.ok)
                alert(response.status)
        })
        setSelectedToDelete([])
    }

    const changeModerator = async (groupMember) => {
        const changeModeratorResponse = await fetch(`http://192.168.92.21:8000/api/groups/${groupId}/members/${groupMember.user}/`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${userToken}`
            },
            body: JSON.stringify(groupMember)
        })
    }

    const deleteGroup = async () => {
        const deleteGroupResponse = await fetch(`http://192.168.92.21:8000/api/groups/${groupId}/`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${userToken}`
            }
        })
    }

    return (
        <div id="groupOptionsPopupBackground" >
            <div id="groupOptionsPopup">
                <div id="groupOptionsButtonList">
                    <button id="groupOptionsButton" style={{borderRadius: "40px 0 0 0"}}
                            onClick={ () => handleTogglingButtons('groupDetails') }>
                        Dane grupy
                    </button>
                    <button id="groupOptionsButton"
                            onClick={ () => handleTogglingButtons('deleteUsers') }>
                        Usuń uczestników
                    </button>
                    {group.host === userId ?
                        <button id="groupOptionsButton"
                                onClick={ () => handleTogglingButtons('changeModerators') }>
                            Edytuj moderatorów
                        </button> :
                        <button id="groupOptionsButton" style={{borderRadius: "0 0 0 40px"}}
                                onClick={ () => handleTogglingButtons('changeModerators') }>
                            Edytuj moderatorów
                        </button>}

                    { group.host === userId && <button id="groupOptionsButton" style={{borderRadius: "0 0 0 40px"}}
                        onClick={() => handleTogglingButtons('deleteGroup')}>
                        Usuń grupę
                    </button> }
                </div>

                <div id="contentWindow">

                    {toggleGroupDetailsButton && (
                        <div id="groupDetails">
                            <h3> Opis grupy: </h3>
                            <p style={{margin: "unset"}}> {group.description} </p>
                            <h3> Członkowie: </h3>
                            <div id="groupMembersMap">
                                {groupMembers.map(groupMember => (
                                    <User key={groupMember.user} className="otherPerson" userId={groupMember.user} />
                                )) }
                            </div>
                        </div>
                    )}

                    {toggleDeleteUsersButton && (
                        <div id="deleteUsers">
                            <h3> Wybierz użytkowników do usunięcia: </h3>
                            <CreatableSelect
                                required
                                isClearable
                                isMulti
                                options={groupMembers}
                                getOptionLabel={(user) => user.username}
                                getOptionValue={(user) => user.user}
                                onChange={(selected) => setSelectedToDelete(selected)}
                            />
                            <button id="groupOptionsButton" style={{borderRadius: "15px", marginTop: "15px"}}
                                    onClick={ deleteUsers } >
                                Potwierdź
                            </button>
                        </div>
                    )}

                    {toggleChangeModeratorsButton && (
                        <div id="changeModerators">
                            {groupMembers.map(groupMember => (
                                <div className="isModeratorBox" key={ groupMember.user } >
                                    <p className="isModeratorUsername"> { groupMember.username } </p>

                                    {group.host === groupMember.user ? (<p style={{marginTop: "10px", marginBottom: "10PX"}}> HOST </p>) : (
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                defaultChecked={groupMember.is_moderator}
                                                onChange={() => {
                                                    groupMember.is_moderator = !groupMember.is_moderator
                                                    changeModerator(groupMember)
                                                }}/>

                                            <span className="slider"></span>
                                        </label>
                                    )}
                                </div>
                                )) }
                        </div>
                    )}

                    {toggleDeleteGroupButton && (
                        <div id="deleteGroup">
                            <h3> Czy na pewno chcesz usunąć tę grupę? </h3>
                            <button onClick={ deleteGroup } >
                                Potwierdź
                            </button>
                        </div>
                    )}
                </div>

                <button id="closePopupButton"
                        onClick={handlePopup}>
                    X
                </button>
            </div>
        </div>
    )
}

const Group = ({group}) => {
    const {changeCurrentGroupId} = useContext(userContext)

    const [groupOptionsPopup, setGroupOptionsPopup] = useState(false)
    const handlePopup = () => {
        setGroupOptionsPopup((prevState) => !prevState)
    }

    const handleClick = (event) => {
        changeCurrentGroupId(Number(event.target.value))
    }

    return (
        <div id="group">
            <Link to={`/chat/${group.id}`}>
                <button
                    className="groupButton"
                    onClick={handleClick}
                    value={group.id}>
                    {group.name}
                </button>
            </Link>

            <button
                id="groupOptions"
                onClick={handlePopup}>
                    ...
            </button>
            {groupOptionsPopup && <GroupOptions groupId={group.id} handlePopup={handlePopup}/>}
        </div>
    )
}

export default Group;


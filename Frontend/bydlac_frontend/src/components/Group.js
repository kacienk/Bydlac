import {useContext, useEffect, useState} from "react";
import userContext from "../context/UserContext";
import {Link, useNavigate} from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import User from "./User";

import "./Group.css"

/**
 * Custom Component which represents Conversation Group's options: Group's details, option to delete members, option to change moderators, option to delete Group
 * @param groupId Conversation Group ID which details are to be obtained and displayed
 * @param handlePopup auxiliary function to close popup
 * @returns {JSX.Element} Group options popup which contains options described above
 */
const GroupOptions = ({groupId, handlePopup}) => {
    const {ADDRESS, userId, userToken} = useContext(userContext)

    const [group, setGroup] = useState({})
    const [groupMembers, setGroupMembers] = useState([])

    const navigate = useNavigate()

    const [toggleGroupDetailsButton, setToggleGroupDetailsButton] = useState(true)
    const [toggleAddUsersButton, setToggleAddUsersButton] = useState(false)
    const [toggleDeleteUsersButton, setToggleDeleteUsersButton] = useState(false)
    const [toggleChangeModeratorsButton, setToggleChangeModeratorsButton] = useState(false)
    const [toggleDeleteGroupButton, setToggleDeleteGroupButton] = useState(false)
    
    /**
     * Auxiliary function to change displayed HTML elements
     * @param button string containing one of available options from where to choose specific Group option
     */
    const handleTogglingButtons = (button) => {
        switch (button) {
            case 'groupDetails':
                setToggleGroupDetailsButton(true)
                setToggleAddUsersButton(false)
                setToggleDeleteUsersButton(false)
                setToggleChangeModeratorsButton(false)
                setToggleDeleteGroupButton(false)
                return;
            case 'addUsers':
                setToggleGroupDetailsButton(false)
                setToggleAddUsersButton(true)
                setToggleDeleteUsersButton(false)
                setToggleChangeModeratorsButton(false)
                setToggleDeleteGroupButton(false)
                return;
            case 'deleteUsers':
                setToggleGroupDetailsButton(false)
                setToggleAddUsersButton(false)
                setToggleDeleteUsersButton(true)
                setToggleChangeModeratorsButton(false)
                setToggleDeleteGroupButton(false)
                return;
            case 'changeModerators':
                setToggleGroupDetailsButton(false)
                setToggleAddUsersButton(false)
                setToggleDeleteUsersButton(false)
                setToggleChangeModeratorsButton(true)
                setToggleDeleteGroupButton(false)
                return;
            case 'deleteGroup':
                setToggleGroupDetailsButton(false)
                setToggleAddUsersButton(false)
                setToggleDeleteUsersButton(false)
                setToggleChangeModeratorsButton(false)
                setToggleDeleteGroupButton(true)
                return;
        }
    }

    const [selectedToDelete, setSelectedToDelete] = useState([])

    const [newSelectedUser, setNewSelectedUser] = useState('');
    const [selectedUsersList, setSelectedUsersList] = useState([]);

    useEffect(() => {
        /**
         * Function to obtain detailed information about specific Conversation Group and its members
         */
        const getGroupDetails = async () => {
            const response = await fetch(`http://127.0.0.1:8000/api/groups/${groupId}/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                }
            })
            const data = await response.json()
            setGroup(data)

            const responseMembers = await fetch(`http://127.0.0.1:8000/api/groups/${groupId}/members/`, {
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
    }, [selectedToDelete, selectedUsersList])

    const handleKeyDown = (event) => {
        if (!newSelectedUser)
            return;

        switch (event.key) {
            case 'Enter':
            case 'Tab':
                setSelectedUsersList((prev) => [...prev, newSelectedUser]);
                setNewSelectedUser('');
                event.preventDefault();
        }
    };

    /**
     * Function to add (one-by-one) selected Users -
     * meaning sending request to backend server with information about additions
     */
    const addUsers = () => {
        selectedUsersList.map(async (user) => {
            const userIdResponse = await fetch(`http://127.0.0.1:8000/api/users/from-username/?username=${user}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                }
            })
            const userData = await userIdResponse.json()

            const addUserResponse = await fetch(`http://127.0.0.1:8000/api/groups/${groupId}/members/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                },
                body: JSON.stringify({user: userData.id})
            })

            if (!addUserResponse.ok) {
                alert(`Błąd podczas dodawania użytkownika o nicku: ${user}`)
            }
        })
        setSelectedUsersList([])
    }

    /**
     * Function to delete (one-by-one) selected Group Members -
     * meaning sending request to backend server with information about deletions
     */
    const deleteUsers = () => {
        selectedToDelete.map(async (user) => {
            const response = await fetch(`http://127.0.0.1:8000/api/groups/${groupId}/members/${user.user}/`, {
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

    /**
     * Function to change User's moderator status -
     * meaning sending request to backend server with information about change
     * @param groupMember specific User - Group Member
     */
    const changeModerator = async (groupMember) => {
        const changeModeratorResponse = await fetch(`http://127.0.0.1:8000/api/groups/${groupId}/members/${groupMember.user}/`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${userToken}`
            },
            body: JSON.stringify(groupMember)
        })
    }

    /**
     * Function to delete Conversation Group -
     * meaning sending request to backend server with information about Group deletion
     */
    const deleteGroup = async () => {
        const deleteGroupResponse = await fetch(`http://127.0.0.1:8000/api/groups/${groupId}/`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${userToken}`
            }
        })
        if (deleteGroupResponse.ok)
            navigate(`/`)
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
                            onClick={ () => handleTogglingButtons('addUsers') }>
                        Dodaj użytkowników
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

                    {toggleAddUsersButton && (
                        <div id="addUsers">
                            <h3> Dodaj członków: </h3>
                            <div id='newGroupUsers'>
                                <CreatableSelect
                                    components={{ DropdownIndicator: null, }}
                                    inputValue={newSelectedUser}
                                    isClearable
                                    isMulti
                                    menuIsOpen={false}
                                    onChange={(newValue) => setSelectedUsersList(newValue)}
                                    onInputChange={(newValue) => setNewSelectedUser(newValue)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Wpisz nazwy użytkowników oddzielając je enterem"
                                    value={selectedUsersList}
                                    getOptionLabel={(user) => user}
                                />
                            </div>
                            <button id="groupOptionsButton" style={{borderRadius: "15px", marginTop: "15px"}}
                                    onClick={ addUsers } >
                                Potwierdź
                            </button>
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

                                    <div className="blankSpace"></div>

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
                            <button id="groupOptionsButton" onClick={ deleteGroup } >
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

/**
 * Custom Component which represents Conversation Group
 * @param group Conversation Group object obtained from server
 * @returns {JSX.Element} HTML button element representing link to Conversation Group chat with messages and HTML button element allowing to display group's options popup (see: {@link GroupOptions})
 */
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


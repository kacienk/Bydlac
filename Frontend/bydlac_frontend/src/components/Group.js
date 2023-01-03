import {useContext, useEffect, useState} from "react";
import userContext from "../context/UserContext";
import {Link, useNavigate} from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import "./Group.css"

const GroupOptions = ({groupId, handlePopup}) => {
    const {userToken} = useContext(userContext)

    const navigate = useNavigate()

    const [group, setGroup] = useState({})

    const [groupMembers, setGroupMembers] = useState([])

    const [toggleDeleteUsersButton, setToggleDeleteUsersButton] = useState(false)

    const [selectedToDelete, setSelectedToDelete] = useState([])


    useEffect(() => {
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
    }, [selectedToDelete])


    const deleteUsers = () => {
        selectedToDelete.map(async (user) => {
            const response = await fetch(`http://127.0.0.1:8000/api/groups/${groupId}/members/${user.id}/`, {
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


    const deleteGroup = () => {

    }


    return (
        <div id="groupOptionsPopupBackground" >
            <div id="groupOptionsPopup">
                <div id="groupOptionsButtonList">
                    <button
                        onClick={ () => {setToggleDeleteUsersButton(prevState => !prevState)} }>
                        Usuń uczestników
                    </button>
                    <button
                        onClick={ () => {navigate(`/chat/${groupId}/edit/members`) /* TODO only when user is admin? */} }>
                        Edytuj moderatorów
                    </button>
                    <button
                        onClick={ deleteGroup }>
                        Usuń grupę
                    </button>
                </div>

                <div id="contentWindow">
                    <button id="closePopupButton"
                            onClick={handlePopup}>
                        X
                    </button>

                    {!toggleDeleteUsersButton && (
                        <div>
                            <h3> Opis grupy: </h3>
                            <p> {group.description} </p>
                        </div>
                    )}

                    {toggleDeleteUsersButton && (
                        <div>
                            <h3> Wybierz użytkowników do usunięcia: </h3>
                            <CreatableSelect
                                required
                                isClearable
                                isMulti
                                options={groupMembers}
                                getOptionLabel={(user) => user.username}
                                getOptionValue={(user) => user.id}
                                onChange={(selected) => setSelectedToDelete(selected)}
                            />
                            <button onClick={ deleteUsers } >
                                Potwierdź
                            </button>
                        </div>
                    )}
                </div>
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
                    Nazwa grupy: {group.name}
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


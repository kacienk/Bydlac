import CreatableSelect from "react-select/creatable";
import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import userContext from "../context/UserContext";


const NewGroup = () => {
    let {userId} = useContext(userContext)
    let {userGroups} = useContext(userContext)
    const isPrivateOptions = [
        {label: "Prywatna", value: "true"},
        {label: "Publiczna", value: "false"}
    ]

    let [allUsersList, setAllUsersList] = useState([])
    useEffect((() => {
        getAllUsersList()
    }), [])

    const getAllUsersList = async () => {

        let response = await fetch('http://127.0.0.1:8000/api/users/', {
            method: 'GET',
            headers: {"Content-Type": "application/json"}
        })
        let data = await response.json()
        setAllUsersList(data)
    }

    let [newGroupName, setNewGroupName] = useState('')
    let [newGroupIsPrivate, setNewGroupIsPrivate] = useState(true)
    let [newGroupDescription, setNewGroupDescription] = useState('')
    let [selectedUsers, setSelectedUsers] = useState([])
    const navigate = useNavigate()
    const newGroupSubmitHandler = async (event) => {
        event.preventDefault()

        const newGroup = {
            host: userId,
            name: newGroupName,
            description: newGroupDescription,
            is_private: newGroupIsPrivate
        }

        let response = await fetch('http://127.0.0.1:8000/api/groups/create/', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newGroup)
        })

        let response2 = await fetch('http://127.0.0.1:8000/api/users/' + userId + '/groups', {
            method: 'GET',
            headers: {"Content-Type": "application/json"}
        })

        userGroups = await response2.json()

        let newGroupId = Math.max(...userGroups.map(object => object.group)) // TODO make it less dumb
        selectedUsers.map(async (user) => {
            let response3 = await fetch('http://127.0.0.1:8000/api/groups/' + newGroupId + '/add-user/' + user.id, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    user: user.id,
                    group: newGroupId,
                    is_moderator: false
                })
            })
            if (response.ok && response2.ok && response3.ok) {
                navigate('/chat/' + newGroupId)
            }
            else
                alert("Błąd podczas procesu tworzenia konwersacji")
        })
    }


    return (
        <div id='newGroupBox'>
            <form id='newGroupForm' onSubmit={newGroupSubmitHandler}>
                <p className='newGroupPageText'>Nazwa konwersacji: </p>
                <input id='newGroupPageInput'
                       type="text"
                       required
                       placeholder="Nazwa"
                       onChange={(event) => {setNewGroupName(event.target.value)}}
                />

                <p className='newGroupPageText'>Wybierz typ grupy:</p>
                <div id='newGroupIsPrivate'>
                    <CreatableSelect
                        options={isPrivateOptions}
                        defaultValue={isPrivateOptions[0]}
                        onChange={(selected) => {selected.value === "false" ? setNewGroupIsPrivate(false) : setNewGroupIsPrivate(true)}}
                    />
                </div>

                <p className='newGroupPageText'>Opis:</p>
                <textarea
                    id='newGroupPageTextarea'
                    onChange={(event) => {setNewGroupDescription(event.target.value)}}
                ></textarea>

                <p className='newGroupPageText'>Dodaj członków:</p>
                {/* TODO AsyncSelect*/}
                <div id='newGroupUsers'>
                    <CreatableSelect
                        required
                        isClearable
                        isMulti
                        options={allUsersList}
                        getOptionLabel={(user) => user.username}
                        getOptionValue={(user) => user.id}
                        onChange={(selected) => setSelectedUsers(selected)}
                    />
                </div>

                <button id='newGroupPageButton'>Stwórz konwersację</button>
            </form>
        </div>
    )
}

export default NewGroup;
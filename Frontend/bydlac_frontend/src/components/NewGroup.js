import CreatableSelect from "react-select/creatable";
import {useNavigate} from "react-router-dom";
import React, {useContext, useState} from "react";
import userContext from "../context/UserContext";

import "./NewGroup.css";

const NewGroup = () => {
    const {
        ADDRESS,
        userId,
        userToken,
        setUserGroups
    } = useContext(userContext)

    let {userGroups} = useContext(userContext)

    const isPrivateOptions = [
        {label: "Prywatna", value: "true"},
        {label: "Publiczna", value: "false"}
    ]


    let [newGroupName, setNewGroupName] = useState('')
    let [newGroupIsPrivate, setNewGroupIsPrivate] = useState(true)
    let [newGroupDescription, setNewGroupDescription] = useState('')
    const [newSelectedUser, setNewSelectedUser] = useState('');
    const [selectedUsersList, setSelectedUsersList] = useState([]);

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


    const navigate = useNavigate()
    const newGroupSubmitHandler = async (event) => {
        event.preventDefault()

        const newGroup = {
            host: userId,
            name: newGroupName,
            description: newGroupDescription,
            is_private: newGroupIsPrivate
        }

        let createGroupResponse = await fetch(`http://127.0.0.1:8000/api/groups/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${userToken}`
            },
            body: JSON.stringify(newGroup)
        })
        const data = await createGroupResponse.json()
        const newGroupId = data['id']
        userGroups = setUserGroups(userGroups => [...userGroups, data])

        if (!createGroupResponse.ok)
            alert("Błąd podczas procesu tworzenia konwersacji")

        selectedUsersList.map(async (user) => {
            const userIdResponse = await fetch(`http://127.0.0.1:8000/api/users/from-username/?username=${user}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                }
            })
            const userData = await userIdResponse.json()

            let addUserResponse = await fetch(`http://127.0.0.1:8000/api/groups/${newGroupId}/members/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                },
                body: JSON.stringify({
                    user: userData.id,
                    group: newGroupId,
                    is_moderator: false
                })
            })

            if (!addUserResponse.ok) {
                alert(`Błąd podczas dodawania użytkownika o nicku: ${user}`)
            }
        })

        navigate('/chat/' + newGroupId)
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
                        onChange={(selected) =>
                        {selected.value === "false" ? setNewGroupIsPrivate(false) : setNewGroupIsPrivate(true)}}
                    />
                </div>

                <p className='newGroupPageText'>Opis:</p>
                <textarea
                    id='newGroupPageTextarea'
                    onChange={(event) => {setNewGroupDescription(event.target.value)}}
                ></textarea>

                <p className='newGroupPageText'>Dodaj członków:</p>
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

                <button id='newGroupPageButton'>Stwórz konwersację</button>
            </form>
        </div>
    )
}

export default NewGroup;
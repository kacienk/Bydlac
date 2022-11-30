import React, {useContext, useEffect, useState} from "react";
import userContext from "../context/UserContext";
import GetOtherUser from "../utils/GetOtherUser";
import User from "../components/User";
import {Link, useNavigate} from "react-router-dom";
import GroupList from "../components/GroupList";
import CreatableSelect from 'react-select/creatable'
import "./NewGroupPage.css"
import getUserGroups from "../utils/GetUserGroups";
import setUserGroups from "../utils/GetUserGroups";

const NewGroupPage = () => {
    let {userId} = useContext(userContext) //console.log("MainPage currentGroupID: ", currentGroupId)
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
        //console.log("getAllUsersList: data: ", data)
        setAllUsersList(data)
        //console.log("getAllUsersList: allUsersList: ", allUsersList)
    }

    //console.log("NewGroupPage: allUsersList: ", allUsersList)

    let [newGroupName, setNewGroupName] = useState('')
    let [newGroupIsPrivate, setNewGroupIsPrivate] = useState(true)
    let [newGroupDescription, setNewGroupDescription] = useState('')
    let [selectedUsers, setSelectedUsers] = useState([])
    //console.log("selected", selectedUsers)
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



        //console.log("new group response:", response)



        let response2 = await fetch('http://127.0.0.1:8000/api/users/' + userId + '/groups', {
            method: 'GET',
            headers: {"Content-Type": "application/json"}
        })

        let data2 = await response2.json()
        userGroups = data2

        //console.log("usergroups", userGroups)

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
            //console.log("lat response: ", response3)
            if (response.ok && response2.ok && response3.ok) {
                navigate('http://localhost:3000/chat/' + newGroupId)
            }
            else
                alert("Błąd podczas procesu tworzenia konwersacji")
        })
    }
    
    return (
        <div className='mainView'>
            <div id='test'>
                <div>
                    <div className='usersHeader'>
                        <Link id='logoutContainer' to={'/logout'}>
                            <button className="logoutButton">Wyloguj</button>
                        </Link>
                        <User className='you' userId={userId} favorite={null}/>
                    </div>
                </div>

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
            </div>

            <div id='TEMPgroupList'>
                <GroupList/>
            </div>
        </div>
    )
}

export default NewGroupPage;
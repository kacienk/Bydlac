import userContext from "../context/UserContext";
import {useContext, useEffect, useState} from "react";

const GetGroups = () => {
    let {userGroups} = useContext(userContext)

    let [groupsList, setGroupsList] = useState([])

    useEffect((() => {
        getGroupsList(userGroups)
    }), [])

    let getGroupsList = (userGroups) => {
        userGroups.map(async (group) => {
            let response = await fetch('http://127.0.0.1:8000/api/groups/' + group.group, {
                method: 'GET',
                headers: {"Content-Type": "application/json"}
            })

            let data = await response.json()
            setGroupsList(groupsList => [...groupsList, data])
            console.log("/GetGroups.js/ pojedyncze grupy ", data)
            //localStorage.setItem('groupsList/' + data.id, JSON.stringify(data))
        })
    }

    return groupsList;
}

export default GetGroups;
import userContext from "../context/UserContext";
import {useContext, useEffect, useState} from "react";

const GetGroups = () => {
    const {
        userGroups,
        userToken,
        userId
    } = useContext(userContext)

    let [groupsList, setGroupsList] = useState([])

    useEffect((() => {
        getGroupsList(userGroups)
    }), [userId])

    let getGroupsList = (userGroups) => {
        console.log("GetGroups.js -> getGroupsList() -> userGroups: ", userGroups)
        userGroups.map(async (group) => {
            let response = await fetch(`http://127.0.0.1:8000/api/groups/${group.id}/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                }
            })

            let data = await response.json()
            console.log("GetGroups.js -> getGroupsList() -> data: ", data)
            setGroupsList(groupsList => [...groupsList, data])
        })
        console.log("GetGroups.js -> getGroupsList() -> groupsList: ", groupsList)
    }

    return groupsList;
}

export default GetGroups;
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
        userGroups.map(async (group) => {
            let response = await fetch(`http://127.0.0.1:8000/api/groups/${group.id}/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                }
            })

            let data = await response.json()
            setGroupsList(groupsList => [...groupsList, data])
        })
    }

    return groupsList;
}

export default GetGroups;
import {useEffect, useState} from "react";


const GetUserGroups = (userId) => {
    let [userGroups, setUserGroups] = useState([])

    useEffect((() => {
        getUserGroups(userId)
    }), [])

    let getUserGroups = async (userId) => {
        let response = await fetch('http://127.0.0.1:8000/api/users/' + userId + '/groups', {
            method: 'GET',
            headers: {"Content-Type": "application/json"}
        })

        let data = await response.json()
        setUserGroups(data)
    }

    return userGroups;
}

export default GetUserGroups;
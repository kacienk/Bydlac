import getUserGroups from "../utils/GetUserGroups";
import {useContext, useEffect, useState} from "react";
import userContext from "../context/UserContext";


const GetOtherUser = () => {
    let {userId, currentGroupId} = useContext(userContext)
    //console.log("get other user: ", userId, currentGroupId)

    let [otherUserList, setOtherUserList] = useState([])

    useEffect((() => {
        getOtherUserList()
    }), [currentGroupId])

    const getOtherUserList = async () => {
        let response = await fetch('http://127.0.0.1:8000/api/groups/' + currentGroupId + '/members/', {
            method: 'GET',
            headers: {"Content-Type": "application/json"}
        })
        let data = await response.json()
        setOtherUserList(data)
    }

    let otherUser = {'id': 9}

    if (otherUserList.length === 2) {
        otherUserList.map(user => {
            if (user.id !== userId) {
                console.log("rozmowca:", user.id, user.username)
                otherUser = user
            }
        })
    }

    console.log("other user prosze zadzialaj", otherUser)
    return otherUser
}

export default GetOtherUser;
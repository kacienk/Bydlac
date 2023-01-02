import getUserGroups from "../utils/GetUserGroups";
import {useContext, useEffect, useState} from "react";
import userContext from "../context/UserContext";


const GetOtherUser = () => {
    const {userId, currentGroupId, userToken} = useContext(userContext)
    //console.log("get other user: ", userId, currentGroupId)

    let [otherUserList, setOtherUserList] = useState([])

    useEffect((() => {
        if (currentGroupId !== null)
            getOtherUserList()
    }), [currentGroupId])

    const getOtherUserList = async () => {
        let response = await fetch('http://127.0.0.1:8000/api/groups/' + currentGroupId + '/members/', {
            method: 'GET',
            headers: {"Content-Type": "application/json", "Authorization": "Token " + userToken}
        })
        let data = await response.json()
        //console.log("GetOtherUser / getOtherUserList: data: ", data)
        if (data.length !== 0) // Easiest way to get rid of an error XD
            setOtherUserList(data)
    }

    let otherUser = {'id': null}

    if (otherUserList.length === 2) {
        otherUserList.map(user => {
            if (user.id !== userId) {
                //console.log("get other user / rozmowca:", user.id, user.username)
                otherUser = user
            }
        })
    }

    //console.log("get other user / other user prosze zadzialaj", otherUser)
    return otherUser
}

export default GetOtherUser;
import {useContext, useEffect, useState} from "react";
import userContext from "../context/UserContext";

const GetUserGroups = async (userId, userToken) => {
    let response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/groups/`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${userToken}`,
        }
    })

    let data = await response.json()
    console.log("GetUserGroups data: ", data)

    return data
}

export default GetUserGroups;
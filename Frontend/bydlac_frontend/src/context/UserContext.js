import {createContext, useEffect, useState} from "react";

const UserContext = createContext(null);

export default UserContext;

export const UserProvider = ({children}) => {

    const [userToken, setUserToken] = useState(
        localStorage.getItem('userToken') ? JSON.parse(localStorage.getItem('userToken')) : null)

    const [currentUser, setCurrentUser] = useState(
        localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : {})

    const [userId, setUserId] = useState(
        localStorage.getItem('userId') ? JSON.parse(localStorage.getItem('userId')) : null)

    const [userGroups, setUserGroups] = useState([])



    useEffect(() => {
        let isSubscribed = true

        const getUserGroups = async () => {
            let response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/groups/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`,
                }
            })

            let data = await response.json()
            //console.log("getusergroups data: ", data)

            if (isSubscribed)
                 await setUserGroups(data)
            return data
        }


        if (userId !== null) {
            let tempUserGroups = getUserGroups()
            //console.log("tempUserGroups: ", tempUserGroups)
            //console.log("userGroups in if in useEffect: ", userGroups)
        } else
            alert("napraw to")

        return () => {isSubscribed = false}
    }, [userId])



    let [currentGroupId, changeCurrentGroupId] = useState(null)
    let [currentMessage, setCurrentMessage] = useState('')

    //let userGroupsFullData = GetGroups(userGroups) TODO maybe I can fix the problem with refreshing

    let contextData = {
        userToken:userToken,
        setUserToken:setUserToken,

        currentUser:currentUser,
        setCurrentUser:setCurrentUser,

        userId:userId,
        setUserId:setUserId,

        userGroups:userGroups,
        setUserGroups:setUserGroups,
        //userGroupsFullData:userGroupsFullData

        currentGroupId:currentGroupId,
        changeCurrentGroupId:changeCurrentGroupId,

        currentMessage:currentMessage
    }

    return (
        <UserContext.Provider value={contextData}>
            {children}
        </UserContext.Provider>
    )
}

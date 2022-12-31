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
            let tempUserGroups = getUserGroups() // TODO
            //console.log("tempUserGroups: ", tempUserGroups)
            //console.log("userGroups in if in useEffect: ", userGroups)
        } else
            alert("napraw: problem z pobieraniem grup przed pozyskaniem ID usera")

        return () => {isSubscribed = false}
    }, [userId])

    const [userEvents, setUserEvents] = useState([])
    useEffect(() => {
        let isSubscribed = true

        const getUserEvents = async () => {
            let response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/events/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`,
                }
            })

            let data = await response.json()
            console.log("getUserEvents: data: ", data)

            if (isSubscribed)
                await setUserEvents(data)
            return data
        }

        if (userId !== null) {
            let tempUserEvents = getUserEvents() // TODO
            console.log("tempUserEvents: ", tempUserEvents)
            console.log("userEvents in if in useEffect: ", userEvents)
        } else
            alert("napraw: problem z pobieraniem eventów przed pozyskaniem ID usera")
    }, [userId])

    const [currentEventId, changeCurrentEventId] = useState(null)



    let [currentGroupId, changeCurrentGroupId] = useState(null)
    let [currentMessage, changeCurrentMessage] = useState('')


    let contextData = {
        userToken:userToken,
        setUserToken:setUserToken,

        currentUser:currentUser,
        setCurrentUser:setCurrentUser,

        userId:userId,
        setUserId:setUserId,

        userGroups:userGroups,
        setUserGroups:setUserGroups,

        currentGroupId:currentGroupId,
        changeCurrentGroupId:changeCurrentGroupId,

        userEvents:userEvents,
        setUserEvents:setUserEvents,

        currentEventId:currentEventId,
        changeCurrentEventId:changeCurrentEventId,

        currentMessage:currentMessage
    }

    return (
        <UserContext.Provider value={contextData}>
            {children}
        </UserContext.Provider>
    )
}

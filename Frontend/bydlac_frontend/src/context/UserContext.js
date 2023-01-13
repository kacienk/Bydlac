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

    const [currentEventId, changeCurrentEventId] = useState(null)
    const [currentGroupId, changeCurrentGroupId] = useState(null)
    const [currentMessage, changeCurrentMessage] = useState('')

    const [userGroups, setUserGroups] = useState([])
    useEffect(() => {
        let isSubscribed = true

        const getUserGroups = async () => {
            const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/groups/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`,
                }
            })
            const data = await response.json()
            // console.log("Lista grup:", data)

            if (isSubscribed)
                 await setUserGroups(data)
            return data
        }

        const interval = setInterval(() => {
            if (userId !== null)
                getUserGroups()
        }, 1000)

        return () => clearInterval(interval)
    }, []) // TODO maybe fix constant re-rendering? XD

    const [userEvents, setUserEvents] = useState([])
    useEffect(() => {
        let isSubscribed = true

        const getUserEvents = async () => {
            // `http://127.0.0.1:8000/api/users/${userId}/events/`
            let response = await fetch(`http://127.0.0.1:8000/api/events/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`,
                }
            })
            let data = await response.json()

            if (isSubscribed)
                await setUserEvents(data)
        }


        const interval = setInterval(() => {
            if (userId !== null)
                getUserEvents()
        }, 1000)

        return () => clearInterval(interval)
    }, [])

/*    const [currentGroup, setCurrentGroup] = useState({})

    useEffect(() => {
        if (currentGroupId) {
            const tempCurrentGroup = userGroups.find((group) => {return group.id === currentGroupId})
            setCurrentGroup(tempCurrentGroup)
        }

    }, [currentGroupId])*/


    let contextData = {
        userToken:userToken, // Conversation, GroupOptions, InputMessage, NewEvent, NewGroup, EventDetails, MainPage
        setUserToken:setUserToken, // LogIn

        currentUser:currentUser, // User
        setCurrentUser:setCurrentUser, // LogIn

        userId:userId, // GroupOptions, InputMessage, Message, NewEvent, NewGroup, UsersHeader, EventDetails
        setUserId:setUserId, // LogIn

        userGroups:userGroups, // GroupList
        setUserGroups:setUserGroups, // NewGroup

        currentGroupId:currentGroupId, // InputMessage, LogIn, MainPage, ChatPage
        changeCurrentGroupId:changeCurrentGroupId, // Group

        userEvents:userEvents, // EventList, EventDetails
        setUserEvents:setUserEvents, // NewEvent

        currentEventId:currentEventId, // EventDetails
        changeCurrentEventId:changeCurrentEventId, // Event,

        currentMessage:currentMessage
    }

    return (
        <UserContext.Provider value={contextData}>
            {children}
        </UserContext.Provider>
    )
}

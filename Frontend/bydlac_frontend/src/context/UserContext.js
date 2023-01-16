import {createContext, useEffect, useState} from "react";

const UserContext = createContext(null);

export default UserContext;

console.log(process.env)

const ADDRESS = `http://${process.env.REACT_APP_BACKEND_PORT}:${process.env.REACT_APP_BACKEND_PORT}/api`
console.log(ADDRESS)
alert(ADDRESS)

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
            const response = await fetch(`${ADDRESS}/users/${userId}/groups/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`,
                }
            })
            const data = await response.json()

            if (isSubscribed) {
                await setUserGroups(data)
            }
            return data
        }

        const interval = setInterval(() => {
            if (userId !== null)
                getUserGroups()
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const [userEvents, setUserEvents] = useState([])
    useEffect(() => {
        let isSubscribed = true

        const getUserEvents = async () => {
            let response = await fetch(`${ADDRESS}/events/`, {
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

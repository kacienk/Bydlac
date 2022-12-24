import {createContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import getUserGroups from "../utils/GetUserGroups";

const UserContext = createContext();

export default UserContext;

export const UserProvider = ({children}) => {

    let [userId, setUserId] = useState(
        localStorage.getItem('userId') ? JSON.parse(localStorage.getItem('userId')) : null)

    //let [userToken, setUserToken] = useState(null)
    // TODO JWT-decode when Casper is done with tokens in backend

    let [currentGroupId, changeCurrentGroupId] = useState(-1)
    let [currentMessage, setCurrentMessage] = useState('')

    const navigate = useNavigate()

    let logInHandler = async (event) => {
        event.preventDefault()

        let response = await fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                'email' : event.target.email.value,
                'password': event.target.password.value
            })
        })

        let data = await response.json()

        if (response.status === 202) {
            setUserId(data)
            localStorage.setItem('userId', JSON.stringify(data))
            navigate(`/chat/${currentGroupId}`)
        }
        else
            alert("Problem z logowaniem")
    }

    let userGroups = getUserGroups(userId)
    //let userGroupsFullData = GetGroups(userGroups) TODO maybe I can fix the problem with refreshing


    let contextData = {
        userId:userId,
        logInHandler:logInHandler,

        userGroups:userGroups,
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
import './User.css';

import Person1 from './person1.jpg';
import {useContext, useEffect, useState} from "react";
import userContext from "../context/UserContext";


const User = ({className, userId, otherUser}) => {
    let [user, setUser] = useState([])
    const {userToken} = useContext(userContext)

    useEffect(() => {
        getUser(userId)
    }, [])

    let getUser = async (userId) => {
        console.log("USERTOKEN: ", userToken, "USERID: ", userId)
        let response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${userToken}`
            }
        })
        let data = await response.json()
        setUser(data)
    }

    return (
        <div>
            {(className === "you") ?
                <div className="you">
                    <p className="username">
                        {user.username}
                    </p>
                    <img className="profileImage" src={Person1 /* TODO */} alt=''/>
                    {/*<p className="userStatus">
                        Status: {user.created} TODO
                    </p>*/}
                </div>  :
                <div className="otherPerson">
                    <img className="profileImage" src={Person1 /* TODO */} alt=''/>
                    <p className="username">
                        {otherUser.username}
                    </p>
                    {/*<p className="userStatus">
                            Status: {user.created} TODO
                        </p>*/}
                </div> }
        </div>
    );
}

export default User;

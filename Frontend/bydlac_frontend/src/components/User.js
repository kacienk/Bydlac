import './User.css';

import Person1 from './person1.jpg';
import {useEffect, useState} from "react";


const User = ({className, userId, otherUser}) => {
    let [user, setUser] = useState([])

    useEffect(() => {
        getUser(userId)
    }, [])

    let getUser = async (userId) => {
        let response = await fetch('http://127.0.0.1:8000/api/users/' + userId)
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

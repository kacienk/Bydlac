import './User.css';

import Person1 from './person1.jpg';
import {useContext} from "react";
import userContext from "../context/UserContext";


const User = ({className, otherUser}) => {
    const {currentUser} = useContext(userContext)

    return (
        <div>
            {(className === "you") ?
                <div className="you">
                    <p className="username">
                        {currentUser.username}
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

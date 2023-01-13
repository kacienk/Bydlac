import './User.css';

import Person1 from './person1.jpg';
import {useContext, useEffect, useState} from "react";
import userContext from "../context/UserContext";

const UserDetails = ({handlePopup}) => {
    // show photo which doesn't exist,
    // show username
    // show description (and option to edit it),
    // show when the account was created
    // show deleting account

    useEffect(() => {}, [])

    return (
        <div id="groupOptionsPopupBackground" >
            <div id="groupOptionsPopup">

                <div id="contentWindow">
                    <button id="closePopupButton"
                            onClick={handlePopup}>
                        X
                    </button>

                </div>


            </div>
        </div>
    )
}

const User = ({className, user}) => {
    const {currentUser} = useContext(userContext)
    const [userDetailsPopup, setUserDetailsPopup] = useState(false)
    const handlePopup = () => {
        setUserDetailsPopup(prevState => !prevState)
    }

    return (
        <div>
            <button onClick={ handlePopup }>
                {(className === "you") ? (
                    <div className="you">
                        <p className="username">
                            {currentUser.username}
                        </p>
                        <img className="profileImage" src={Person1 /* TODO */} alt=''/>

                    </div> ) : (
                    <div className="otherPerson">
                        <img className="profileImage" src={Person1 /* TODO */} alt=''/>
                        <p className="username">
                            {user.username}
                        </p>

                    </div>) }
            </button>

            { userDetailsPopup && <UserDetails handlePopup={ handlePopup } /> }
        </div>
    );
}

export default User;

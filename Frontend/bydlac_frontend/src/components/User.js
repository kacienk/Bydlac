import {useContext, useEffect, useState} from "react";
import userContext from "../context/UserContext";
import {format, formatDistanceToNowStrict, parseISO} from "date-fns";

import Person1 from './person1.jpg';

import './User.css';

const ADDRESS = `http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api`
const UserDetails = ({handlePopup, user, setReRenderTrigger}) => {
    const {userToken, userId} = useContext(userContext)

    const [toggleEditBio, setToggleEditBio] = useState(false)
    const [newBio, setNewBio] = useState('')
    const editBio = async () => {
        const editBioResponse = await fetch(`${ADDRESS}/users/${user.id}/`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${userToken}`
            },
            body: JSON.stringify({
                bio: newBio,
            })
        })

        if (editBioResponse.ok) {
            setReRenderTrigger(prevState => !prevState)
            setToggleEditBio(prevState => !prevState)
        }
        else
            alert("Wystąpił problem podczas edycji bio, spróbuj jeszcze raz")
    }

    const [userCreatedDate, setUserCreatedDate] = useState(new Date(parseISO(user.created)))
    const [userCreatedInterval, setUserCreatedInterval] = useState(formatDistanceToNowStrict(userCreatedDate, {unit: 'day'}).replace(/days?/, ''))

    return (
        <div id="userDetailsPopupBackground" >
            <div id="userDetailsPopup">
                <button id="closePopupButton"
                        onClick={handlePopup}>
                    X
                </button>

                <div id="contentWindow">
                    <img id="profileImageMedium" src={ Person1 } alt=''/>

                    <h1 id="userDetailsPopupUsername"> { user.username } </h1>

                    {user.bio !== "" ?
                        <div>
                            <h3 id="userDetailsPopupBio"> Bio: </h3>
                            <p id="userDetailsPopupBioContent"> { user.bio } </p>
                        </div> : null}

                    {user.id === userId ?
                        <button id="editBioButton" onClick={() => setToggleEditBio(prevState => !prevState)}>
                            {!toggleEditBio ? "Edytuj bio" : "Anuluj edycję"}
                        </button> : null}

                    {toggleEditBio &&
                        <div id="editBio">
                            <textarea id="editBioTextarea" onChange={ event => setNewBio(event.target.value) }/>
                            <button id="editBioButton" onClick={editBio} >
                                Zatwierdź zmiany
                            </button>
                        </div>}

                    <h3 id="userDetailsPopupCreated"> {user.id === userId ? "Jesteś z nami od:" : "W serwisie od:"} </h3>
                    <p id="userDetailsPopupCreatedContent"> {userCreatedInterval} dni ({format(userCreatedDate, 'dd.MM.y')}) </p>
                </div>
            </div>
        </div>
    )
}

const User = ({className, userId}) => {
    const {userToken} = useContext(userContext)

    const [userDetailsPopup, setUserDetailsPopup] = useState(false)

    const [user, setUser] = useState({})
    const [reRenderTrigger, setReRenderTrigger] = useState(false)
    useEffect(() => {
        const getUser = async () => {
            const getUserResponse = await fetch(`${ADDRESS}/users/${userId}/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                }
            })
            const getUserData = await getUserResponse.json()
            setUser(getUserData)
        }

        getUser()
    }, [reRenderTrigger])

    const handlePopup = () => {
        setUserDetailsPopup(prevState => !prevState)
    }

    return (
        <div>
            <button id="userDetailsButton" onClick={ handlePopup }>
                {(className === "you") ? (
                    <div className="you">
                        <p className="username">
                            {user.username}
                        </p>
                        <img className="profileImage" src={ Person1 } alt=''/>

                    </div> ) : (
                    <div className="otherPerson">
                        <img className="profileImage" src={ Person1 } alt=''/>
                        <p className="username">
                            {user.username}
                        </p>

                    </div>) }
            </button>

            { userDetailsPopup &&
                <UserDetails
                    handlePopup={ handlePopup }
                    user={user}
                    setReRenderTrigger={setReRenderTrigger} /> }
        </div>
    );
}

export default User;

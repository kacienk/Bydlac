import './User.css';

import Person1 from './person1.jpg';
import {useContext, useEffect, useState} from "react";
import userContext from "../context/UserContext";
import {useNavigate} from "react-router-dom";

const UserDetails = ({handlePopup, user, setReRenderTrigger}) => {
    const {userToken, userId} = useContext(userContext)
    const navigate = useNavigate()

    const [toggleEditBio, setToggleEditBio] = useState(false)
    const [newBio, setNewBio] = useState('')
    const editBio = async () => {
        const editBioResponse = await fetch(`http://127.0.0.1:8000/api/users/${user.id}/`, {
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
            alert("nie udało się zmienić bio") // TODO
    }

    return (
        <div id="groupOptionsPopupBackground" >
            <div id="groupOptionsPopup">

                <div id="contentWindow">
                    <button id="closePopupButton"
                            onClick={handlePopup}>
                        X
                    </button>

                    <img className="profileImage" src={ Person1 } alt=''/>

                    <h1> { user.username } </h1>

                    {user.bio !== "" ?
                        <div>
                            <h3> Bio: </h3>
                            <p> { user.bio } </p>
                        </div> : null}

                    {user.id === userId ?
                        <button onClick={() => setToggleEditBio(prevState => !prevState)}>
                            {!toggleEditBio ? "Edytuj bio" : "Anuluj edycję"}
                        </button> : null}

                    {toggleEditBio &&
                        <div>
                            <textarea onChange={ event => setNewBio(event.target.value) }/>
                            <button onClick={editBio} >
                                Zatwierdź zmiany
                            </button>
                        </div>}

                    <h3> {user.id === userId ? "Jesteś z nami od:" : "W serwisie od:"} </h3>
                    <p> {user.created} </p>
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
            const getUserResponse = await fetch(`http://127.0.0.1:8000/api/users/${userId}/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                }
            })
            const getUserData = await getUserResponse.json()
            setUser(getUserData)
            //console.log("In User component getUserData: ", getUserData)
        }

        getUser()
    }, [reRenderTrigger])

    const handlePopup = () => {
        setUserDetailsPopup(prevState => !prevState)
    }

    return (
        <div>
            <button onClick={ handlePopup }>
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

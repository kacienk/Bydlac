import {useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import userContext from "../context/UserContext";
import UsersHeader from "../components/UsersHeader";
import ListHeader from "../components/ListHeader";
import Person1 from "../components/person1.jpg";

const MainPage = () => {
    const {
        userToken,
        currentUser
    } = useContext(userContext)
    const navigate = useNavigate()

    useEffect(() => {
        const navigateMainPage = () => {
            if (!userToken)
                navigate('/login')
        }
        navigateMainPage()
    }, [userToken])

    return (
        <div className='mainView'>
            <div>
                <UsersHeader />

                <h1> Witaj { currentUser.username }! </h1>
                <img className="profileImage" src={ Person1 } alt=''/>

                <p> Aby przejść do konwersacji, wybierz z listy po prawej </p>
            </div>
            <div id='TEMPgroupList'>
                <ListHeader whichToShow={true}/>
            </div>
        </div>
    )
}

export default MainPage;
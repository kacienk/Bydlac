import {useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import userContext from "../context/UserContext";
import UsersHeader from "../components/UsersHeader";
import ListHeader from "../components/ListHeader";

import Person1 from "../components/person1.jpg";

import "./MainPage.css";

/**
 * Custom Component which represents complete view of main page - if User is not logged-in it redirects them to log in page
 * @returns {JSX.Element} welcoming text with prompt to choose Conversation Group or Event or create new ones
 */
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

                <div id="profileInfoBox">
                    <div id="profileInfoInnerBox">
                        <h1 id="helloUserText">
                            Witaj { currentUser.username }!
                        </h1>

                        <img id="profileImageBig" src={ Person1 } alt=''/>

                        <p id="promptText"> Aby przejść do konwersacji, wybierz z listy po prawej </p>
                    </div>
                </div>
            </div>

            <ListHeader whichToShow={true}/>
        </div>
    )
}

export default MainPage;

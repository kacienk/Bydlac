import {useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import userContext from "../context/UserContext";
import UsersHeader from "../components/UsersHeader";
import ListHeader from "../components/ListHeader";

const MainPage = () => {
    const {
        userToken,
        currentGroupId
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
                {/* TODO display here everything tha same like in UserDetails return but not in popup */}
            </div>
            <div id='TEMPgroupList'>
                <ListHeader whichToShow={true}/>
            </div>
        </div>
    )
}

export default MainPage;
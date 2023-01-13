import {useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import userContext from "../context/UserContext";

const MainPage = () => {
    const {
        userToken,
        currentGroupId
    } = useContext(userContext)
    const navigate = useNavigate()

    useEffect(() => {
        const navigateMainPage = () => {
            if (userToken)
                navigate(`/chat/${currentGroupId}`)
            else
                navigate('/login')
        }
        navigateMainPage()
    }, [userToken])

    return (<div></div>)
}

export default MainPage;
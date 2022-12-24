import {Link} from "react-router-dom";
import User from "./User";
import userContext from "../context/UserContext";
import {useContext} from "react";

const UsersHeader = () => {
    let {userId} = useContext(userContext)

    return (
        <div>
            <div className='usersHeader'>
                <Link id='logoutContainer' to={'/logout'}>
                    <button className="logoutButton">Wyloguj</button>
                </Link>
                <User className='you' userId={userId} favorite={null}/>
            </div>
        </div>
    )
}

export default UsersHeader;
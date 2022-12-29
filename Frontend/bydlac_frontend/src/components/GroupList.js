import Group from "./Group";
import "./GroupList.css"
import {Link} from "react-router-dom";
import {useContext} from "react";
import userContext from "../context/UserContext";

const GroupList = (isFavList) => {
    const {userGroups} = useContext(userContext)

    return (
        <div className="groupList">

            <Link to={'/new/group'}>
                <button id='newGroupButton'>Nowa konwersacja</button>
            </Link>

            {isFavList ?
                userGroups.map(group => (<Group key={group.id} group={group}/>)) :
                userGroups.map(group => (/* TODO group.isFavourite &&*/ <Group key={group.id} group={group}/>))
            }
        </div>
    )
}

export default GroupList;
import Group from "./Group";
import GetGroups from "../utils/GetGroups";
import "./GroupList.css"
import {Link} from "react-router-dom";

const GroupList = () => {
    let groupsList = GetGroups()
    //console.log("/GroupsList.js/ lista grup", groupsList)

    return (
        <div className="groupList">
            <p className="groupListText">Konwersacje</p>

            <Link to={'/new/group'}>
                <button id='newGroupButton'>Nowa konwersacja</button>
            </Link>

            {groupsList.map(group => (
                <Group key={group.id} group={group}/>
            ))}
        </div>
    )
}

export default GroupList;
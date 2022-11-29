import Group from "./Group";
import GetGroups from "../utils/GetGroups";
import "./GroupList.css"

const GroupList = () => {
    let groupsList = GetGroups()
    console.log("/GroupsList.js/ lista grup", groupsList)

    return (
        <div className="groupList">
            <p className="groupListText">Group List</p>
            {groupsList.map(group => (
                <Group key={group.id} group={group}/>
            ))}
        </div>
    )
}

export default GroupList;
import UsersHeader from "../components/UsersHeader";
import NewGroup from "../components/NewGroup";
import GroupList from "../components/GroupList";

import "./NewGroupPage.css"


const NewGroupPage = () => {

    return (
        <div className='mainView'>
            <div id='test'>
                <UsersHeader/>

                <NewGroup/>
            </div>

            <div id='TEMPgroupList'>
                <GroupList/>
            </div>
        </div>
    )
}

export default NewGroupPage;
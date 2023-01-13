import UsersHeader from "../components/UsersHeader";
import NewGroup from "../components/NewGroup";
import ListHeader from "../components/ListHeader";
import "./NewGroupPage.css"


const NewGroupPage = () => {

    return (
        <div className='mainView'>
            <div id='test'>
                <UsersHeader/>

                <NewGroup/>
            </div>

            <div id='TEMPgroupList'>
                <ListHeader whichToShow={true} />
            </div>
        </div>
    )
}

export default NewGroupPage;
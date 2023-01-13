import UsersHeader from "../components/UsersHeader";
import NewEvent from "../components/NewEvent";
import ListHeader from "../components/ListHeader";
import "./NewEventPage.css";

const NewEventPage = () => {
    return (
        <div className='mainView'>
            <div id='test'>
                <UsersHeader />

                <NewEvent />
            </div>

            <div id='TEMPgroupList'>
                <ListHeader whichToShow={false} />
            </div>
        </div>
    )
}

export default NewEventPage;
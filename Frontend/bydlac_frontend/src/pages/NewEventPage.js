import UsersHeader from "../components/UsersHeader";
import NewEvent from "../components/NewEvent";
import ListHeader from "../components/ListHeader";

import "./NewEventPage.css";

const NewEventPage = () => {
    return (
        <div className='mainView'>
            <div>
                <UsersHeader />

                <NewEvent />
            </div>

            <ListHeader whichToShow={false} />
        </div>
    )
}

export default NewEventPage;
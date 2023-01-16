import UsersHeader from "../components/UsersHeader";
import NewEvent from "../components/NewEvent";
import ListHeader from "../components/ListHeader";

import "./NewEventPage.css";

/**
 * Custom Component which represents complete view of new Event page
 * @returns {JSX.Element} element responsible for obtaining information about new Event
 */
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

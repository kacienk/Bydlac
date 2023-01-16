import UsersHeader from "../components/UsersHeader";
import NewGroup from "../components/NewGroup";
import ListHeader from "../components/ListHeader";

import "./NewGroupPage.css"

/**
 * Custom Component which represents complete view of new Group page
 * @returns {JSX.Element} element responsible for obtaining information about new Group
 */
const NewGroupPage = () => {

    return (
        <div className='mainView'>
            <div>
                <UsersHeader/>

                <NewGroup/>
            </div>

            <ListHeader whichToShow={true} />
        </div>
    )
}

export default NewGroupPage;
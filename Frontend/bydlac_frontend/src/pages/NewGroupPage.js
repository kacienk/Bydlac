import UsersHeader from "../components/UsersHeader";
import NewGroup from "../components/NewGroup";
import ListHeader from "../components/ListHeader";
import "./NewGroupPage.css"


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
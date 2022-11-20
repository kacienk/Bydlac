import './User.css';

import Person1 from './person1.jpg';

function User(props)
{
    return (
        <div className={props.className}>
            <img className={props.className + 'Image'} src={Person1} alt=''/>
            <p className={props.className + 'Data'}>
                {props.name} {props.surname}
                {/* This has to come from database */}
                {/*TODO Star button for favorite and handling it*/}
            </p>
            <p className={props.className + 'Status'}>
                {props.status}
            </p>
        </div>
    );
}

export default User;

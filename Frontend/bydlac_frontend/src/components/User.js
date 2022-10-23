import './User.css';

import Person1 from './person1.jpg';

function User(props)
{
    return (
        <div className='person1'>
            <img className='person1Image' src={Person1} alt=''/>
            <p className='person1Data'>
                {props.name} {props.surname}
                <br/>
                {props.status}
                {/* This has to come from database */}
            </p>
        </div>
    );
}

export default User;

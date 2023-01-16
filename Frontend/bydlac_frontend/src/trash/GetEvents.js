import userContext from "../context/UserContext";
import {useContext, useEffect, useState} from "react";

const GetEvents = () => {
    const {
        userEvents,
        userToken,
        userId
    } = useContext(userContext)

    let [eventsList, setEventsList] = useState([])

    useEffect((() => {
        getEventsList(userEvents)
    }), [userId])

    let getEventsList = (userEvents) => {
        userEvents.map(async (event) => {
            let response = await fetch(`http://127.0.0.1:8000/api/events/${event.id}/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${userToken}`
                }
            })

            let data = await response.json()
            setEventsList(eventsList => [...eventsList, data])
        })
    }

    return eventsList;
}

export default GetEvents;
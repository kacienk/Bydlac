import {useEffect, useState} from "react";

let [allUsersList, setAllUsersList] = useState([])
useEffect((() => {
    const getAllUsersList = async () => {
        let response = await fetch('http://127.0.0.1:8000/api/users/', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${userToken}`
            }
        })
        let data = await response.json()
        setAllUsersList(data)
    }

    getAllUsersList()
}), [])

{/*<CreatableSelect
                        required
                        isClearable
                        isMulti
                        options={allUsersList}
                        getOptionLabel={(user) => user.username}
                        getOptionValue={(user) => user.id}
                        onChange={(selected) => setSelectedUsers(selected)}
                    />*/}
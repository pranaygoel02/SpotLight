import { useState, useEffect, useCallback } from "react";
import client from "../../appwrite.config";
import { Databases, Storage, ID, Query } from "appwrite";
import { toast } from "react-hot-toast";


function GetUsersLogic() {
    const [users,setUsers] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [showUsers, setShowUsers] = useState(null)
    const [filteredUsers, setFilteredUsers] = useState(null)

    const toggleShowUsers = useCallback(() => {
        setShowUsers(prev => !prev)
    }, [])

    const getUsers = useCallback(async () => {
        setLoading(prev => true)
        try {
            const database = new Databases(client);
            const response = await database.listDocuments(
                process.env.REACT_APP_DATABASE_ID,
                process.env.REACT_APP_USERS_COLLECTION_ID,
                [
                    Query.notEqual('userId', JSON.parse(localStorage.getItem('token')).userId)
                ]
            );
            setUsers(prev => response?.documents);
        }
        catch (err) {
            setError(prev => err.message)
            console.log(err);
            toast.error(err.message)
        }
        finally {
            setLoading(prev => false)
        }
    }, [])

    const filterUsers = useCallback( (e) => {
        const value = e.target.value.toLowerCase();
        const filtered = users.filter(user => {
            return user.name.toLowerCase().includes(value || '') || user.email.toLowerCase().includes(value || '')
        })
        setFilteredUsers(prev => filtered)
    }, [users])

    useEffect(() => {
        getUsers()
    }, [getUsers])

    return {
        users,
        showUsers,
        loading,
        error,
        toggleShowUsers,
        filterUsers,
        filteredUsers
    }
}

export default GetUsersLogic;
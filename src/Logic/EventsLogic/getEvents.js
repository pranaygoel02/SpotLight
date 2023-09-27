import { useState, useEffect, useCallback } from "react";
import client from "../../appwrite.config";
import { Databases, Query } from "appwrite";
import { useSearchParams, useParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function GetEventLogic() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { id } = useParams();
    const {pathname} = useLocation();
    const filter = searchParams.get("filter");
    const [events, setEvents] = useState(null)
    const [eventCount, setEventCount] = useState(null)
    const [privateEvent, setPrivateEvent] = useState(null)
    const [publicEvent, setPublicEvent] = useState(null)
    const [offlineEvent, setOfflineEvent] = useState(null)
    const [onlineEvent, setOnlineEvent] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const buildQuery = useCallback(() => {
        const userQuery = Query.equal('createdBy', JSON.parse(localStorage.getItem('token')).userId) 
        if(filter === 'private' || filter === 'public') return [Query.equal('privacy', filter), userQuery]
        if(filter === 'offline' || filter === 'online') return [Query.equal('medium', filter), userQuery]
        return [
            Query.equal('privacy', filter?.split(',')),
            Query.equal('medium', filter?.split(',')),
            userQuery
        ]
    }, [filter])

    const getEvents = useCallback(async () => {


        try {
            
            setLoading(prev => true)
            const database = new Databases(client);
            const response = await database.listDocuments(
                process.env.REACT_APP_DATABASE_ID,
                process.env.REACT_APP_EVENTS_COLLECTION_ID,
                (filter === null || filter === 'total') ? [
                    Query.equal('createdBy', JSON.parse(localStorage.getItem('token')).userId)
                ] : buildQuery()
            );
            
            setEvents(prev => response?.documents);
            setEventCount(prev => response?.total);
            setPrivateEvent(prev => response?.documents?.filter(event => event.privacy === "private"))
            setPublicEvent(prev => response?.documents?.filter(event => event.privacy === "public"))
            setOfflineEvent(prev => response?.documents?.filter(event => event.medium === "offline"))
            setOnlineEvent(prev => response?.documents?.filter(event => event.medium === "online"))
        }
        catch(err) {
            setError(prev => err.message)
        }
        finally {
            setLoading(prev => false)
        }
    }, [searchParams])

    const getEventById = useCallback(async () => {
        try {
            setLoading(prev => true)
            const database = new Databases(client);
            const response = await database.getDocument(
                process.env.REACT_APP_DATABASE_ID,
                process.env.REACT_APP_EVENTS_COLLECTION_ID,
                id
            );
            
            if(!pathname.includes('dashboard') && response.privacy === 'private') throw new Error('This event is private')
            setEvents(prev => response);
        }
        catch(err) {
            setError(prev => err.message)
            toast.error(err.message)
            navigate(-1)
        }
        finally {
            setLoading(prev => false)
        }
    }, [])

    useEffect(() => {
        if(id) getEventById()
        else getEvents()
    },[getEvents, getEventById])



  return {
    loading, error, events, eventCount, privateEvent, publicEvent, offlineEvent, onlineEvent, filter, id, setSearchParams, searchParams, getEvents
  };
}
export default GetEventLogic;

import { useState, useEffect, useCallback } from "react";
import client from "../../appwrite.config";
import { Databases, Query } from "appwrite";
import { useSearchParams, useParams } from "react-router-dom";

function GetExporeLogic() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();
  const filter = searchParams.get("filter");
  const category = searchParams.get("category"); 
  const [events, setEvents] = useState(null);
  const [eventCount, setEventCount] = useState(null);
  const [publicEvent, setPublicEvent] = useState(null);
  const [offlineEvent, setOfflineEvent] = useState(null);
  const [onlineEvent, setOnlineEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildQuery = useCallback(() => {
    
    
    
    if(category !== null) return [
        Query.equal("category", category),
        Query.equal("privacy", "public")
    ];
    if (filter === "private" || filter === "public")
      return [Query.equal("privacy", "public")];
    return [
      Query.equal("privacy", "public"),
      Query.equal("medium", filter?.split(",")),
    ];
  }, [filter, category, searchParams]);

  const getEvents = useCallback(async () => {
    try {
      
      setError((prev) => null);
      setLoading((prev) => true);
      const database = new Databases(client);
      const response = await database.listDocuments(
        process.env.REACT_APP_DATABASE_ID,
        process.env.REACT_APP_EVENTS_COLLECTION_ID,
        (category === null && (filter === null || filter === "total"))
          ? [Query.equal("privacy", "public")]
          : buildQuery()
      );
      
      setEvents((prev) => response?.documents);
      setEventCount((prev) => response?.total);
      setPublicEvent((prev) =>
        response?.documents?.filter((event) => event.privacy === "public")
      );
      setOfflineEvent((prev) =>
        response?.documents?.filter((event) => event.medium === "offline")
      );
      setOnlineEvent((prev) =>
        response?.documents?.filter((event) => event.medium === "online")
      );
    } catch (err) {
      
      
      
      setError((prev) => err.message);
    } finally {
      setLoading((prev) => false);
    }
  }, [searchParams]);

  const getEventById = useCallback(async () => {
    try {
      setLoading((prev) => true);
      const database = new Databases(client);
      const response = await database.getDocument(
        process.env.REACT_APP_DATABASE_ID,
        process.env.REACT_APP_EVENTS_COLLECTION_ID,
        id
      );
      
      setEvents((prev) => response);
    } catch (err) {
      setError((prev) => err.message);
    } finally {
      setLoading((prev) => false);
    }
  }, []);

  useEffect(() => {
    if (id) getEventById();
    else getEvents();
  }, [getEvents, getEventById]);

  return {
    loading,
    error,
    events,
    eventCount,
    publicEvent,
    offlineEvent,
    onlineEvent,
    filter,
    id,
    setSearchParams,
    searchParams,
    getEvents,
    category
  };
}
export default GetExporeLogic;

import React, { useEffect, useState } from "react";
import GetEventLogic from "../../Logic/EventsLogic/getEvents";
import EventCard from "../../components/EventCard";
import { Link } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import Loading from "../../components/Loading";

function Events() {
  const {
    loading,
    error,
    events,
    eventCount,
    privateEvent,
    publicEvent,
    offlineEvent,
    onlineEvent,
    filter,
    searchParams,
    setSearchParams,
  } = GetEventLogic();

  const [filteredEvents, setFilteredEvents] = useState(null);

  useEffect(() => {
    const filter = searchParams.get("filter");
    const search = searchParams.get("search") ?? "";
    if (filter === "total") {
      setFilteredEvents((prev) => events);
    } else if (filter === "private") {
      setFilteredEvents((prev) => privateEvent);
    } else if (filter === "public") {
      setFilteredEvents((prev) => publicEvent);
    } else if (filter === "offline") {
      setFilteredEvents((prev) => offlineEvent);
    } else if (filter === "online") {
      setFilteredEvents((prev) => onlineEvent);
    }
  }, [events, searchParams]);

  return (
    <div>
      <div className="inline-flex justify-between w-full items-center">
        <h2 className="page-title">Your Events</h2>
        <Link to="/dashboard/create" className="primary-btn">
          <IoAdd />
          Create
        </Link>
      </div>
      <div className="w-full px-6 my-4 rounded-[18px] bg-neutral-200 outline outline-1 outline-neutral-200 flex items-center justify-between">
        <input
          onChange={(e) => {
            e.preventDefault();
            setFilteredEvents((prev) =>
              events?.filter(
                (event) =>
                  event?.title
                    ?.toLowerCase()
                    .includes(e.target.value?.toLowerCase() ?? "") &&
                  (event.medium === filter || event.privacy === filter)
              )
            );
          }}
          type="text"
          placeholder="Search"
          className="w-full bg-transparent py-4 outline-none"
        />
        <select
          defaultValue={filter}
          onChange={(e) => {
            e.preventDefault();
            setSearchParams({ filter: e.target.value });
          }}
          className="w-max bg-transparent py-4 pl-4 outline-none border-l border-neutral-300"
        >
          <option value="total">Total</option>
          <option value="private">Private</option>
          <option value="public">Public</option>
          <option value="offline">Offline</option>
          <option value="online">Online</option>
        </select>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          {error && <p>{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            {!loading && filteredEvents?.length > 0 ? (
              filteredEvents?.map((event, index) => (
                <EventCard key={index} event={event} />
              ))
            ) : (
              <p>No events found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;

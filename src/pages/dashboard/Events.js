import React from "react";
import GetEventLogic from "../../Logic/EventsLogic/getEvents";
import EventCard from "../../components/EventCard";
import { Link } from "react-router-dom";
import { IoAdd } from "react-icons/io5";

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
  } = GetEventLogic();

  return (
    <div>
      <div className="inline-flex justify-between w-full items-center">
        <h2 className="page-title">Your Events</h2>
        <Link to="/dashboard/create" className="primary-btn">
          <IoAdd />
          Create
        </Link>
      </div>
      <div>
        {loading && (
          <div className="w-full h-40 rounded-[18px] bg-neutral-200 outline outline-1 outline-neutral-200 animate-pulse"></div>
        )}
        {error && <p>{error}</p>}
        <div className="grid grid-cols-2 gap-8">
          {!loading && events?.length > 0 ? (
            events?.map((event, index) => (
              <EventCard key={index} event={event} />
            ))
          ) : (
            <p>No events found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Events;

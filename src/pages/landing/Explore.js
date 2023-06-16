import React from "react";
import GetExporeLogic from "../../Logic/Explore/getEvents";
import EventCarousel from "../../components/EventCarousel";
import Loading from "../../components/Loading";
import { categories } from "../../Logic/EventsLogic/categories";

function Explore() {
  const {
    events,
    offlineEvent,
    onlineEvent,
    loading,
    error,
    setSearchParams,
    category,
  } = GetExporeLogic();

  if (loading) return <Loading />;

  return (
    <section className="container py-4 md:py-16">
      <h1 className="pb-12 text-4xl font-bold">Explore the best events happening around you</h1>
      <div className="flex gap-4 mb-8 items-center overflow-auto text-neutral-500">
        {[{ label: "All" }, ...categories]?.map((item, index) => (
          <button
            onClick={(e) => {
              e.preventDefault();
              if (item?.label === "All") setSearchParams((prev) => ({}));
              else
                setSearchParams((prev) => ({ ...prev, category: item?.label }));
            }}
            className={`text-sm ${
              (category === item.label || item.label === "All") &&
              "text-primary"
            }`}
          >
            {item?.label}
          </button>
        ))}
      </div>
      {error ? (
        <div>{error}</div>
      ) : (
        <>
          {events?.length > 0 ? <EventCarousel events={events} title={"All"} /> : <div>No events found</div>}
          {offlineEvent?.length >0 && <EventCarousel events={offlineEvent} title={"Offline"} />}
          {onlineEvent?.length > 0 && <EventCarousel events={onlineEvent} title={"Online"} />}
        </>
      )}
    </section>
  );
}

export default Explore;

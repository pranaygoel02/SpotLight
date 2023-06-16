import React, { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { Link } from "react-router-dom";
import NotFoundEvent from '../../assets/images/eventNotFound.svg'
import GetEventLogic from "../../Logic/EventsLogic/getEvents";
import Loading from "../../components/Loading";

function Dashboard() {
  const [date, setDate] = useState(new Date());
  const {
    loading,
    error,
    eventCount,
    privateEvent,
    publicEvent,
    offlineEvent,
    onlineEvent,
  } = GetEventLogic();

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [date]);

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-xs text-neutral-500 font-poppins">
            {date.toString()}
          </p>
        </div>
        <Link to="create" className="primary-btn">
          <IoAdd />
          Create
        </Link>
      </div>
      <div className="py-8">
        {loading && (
          <Loading />
        )}
        {error && <p>{error}</p>}
        {!loading && eventCount === 0 && 
        <div className="flex flex-col h-[80vh] justify-center items-center gap-8">
          <p className="text-neutral-400 text-xl font-semibold">No events found. Add your first event.</p> 
          <img alt="not found" className="w-[45%] h-max object-contain" src={NotFoundEvent}/>
        </div>
        }
        {!loading && eventCount > 0 && <div className="flex justify-between items-center">
          {
            [
              { label: "Total", count: eventCount },
              { count: privateEvent?.length ?? 0, label: "Private" },
              { count: publicEvent?.length ?? 0, label: "Public" },
              { count: offlineEvent?.length ?? 0, label: "Offline" },
              { count: onlineEvent?.length ?? 0, label: "Online" },
            ]?.map((item, index) => {
              return (
                <Link
                  key={index}
                  to={`events?filter=${item.label.toLowerCase()}`}
                  className={`${
                    index === 0 && "row-span-2"
                  } flex flex-col items-center justify-center text-lg p-4 w-full text-center group ${
                    index > 0 && "border-l"
                  } border-neutral-300`}
                >
                  <h2 className="font-bold text-7xl ">{item?.count}</h2>
                  <p className="text-neutral-600 text-sm font-poppins">
                    {item.label} Events Added
                  </p>
                  <Link className="sidebar-link -translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all" to={`events?filter=${item.label.toLowerCase()}`}>See all</Link>
                </Link>
              );
            })}
        </div>}
      </div>
    </div>
  );
}

export default Dashboard;

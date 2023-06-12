import React, { useEffect, useState } from "react";
import GetEventLogic from "../../Logic/EventsLogic/getEvents";
import { Link } from "react-router-dom";
import {
  MdComputer,
  MdDelete,
  MdEdit,
  MdInsertInvitation,
  MdOutlineCountertops,
} from "react-icons/md";
import { ColorExtractor } from "react-color-extractor";

import CreateMembershipLogic from "../../Logic/Membership/CreateMembership.logic";

import {
  IoClose,
  IoCopy,
  IoLocation,
  IoPersonOutline,
  IoSearch,
  IoWalletOutline,
} from "react-icons/io5";
import { toast } from "react-hot-toast";
import { Databases, Teams } from "appwrite";
import client from "../../appwrite.config";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import GetUsersLogic from "../../Logic/UserLogic.js/GetUsers.logic";

function Event() {
  const { loading, error, events, id } = GetEventLogic();
  console.log(events);

  const {
    users,
    toggleShowUsers,
    showUsers,
    loading: fetchingUsers,
    filterUsers,
    filteredUsers,
  } = GetUsersLogic();

  const [colors, setColors] = useState([]);

  function calculateLightness(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    return (max + min) / 2;
  }

  function compareLightness(color1, color2) {
    const lightness1 = calculateLightness(color1);
    const lightness2 = calculateLightness(color2);

    if (lightness1 < lightness2) {
      return 1;
    } else if (lightness1 > lightness2) {
      return -1;
    } else {
      return 0;
    }
  }

  console.log(colors);

  const navigate = useNavigate();

  const deleteEvent = async () => {
    try {
      const teams = new Teams(client);
      const database = new Databases(client);
      const teamResponse = await teams.delete(events?.teamId);
      console.log(teamResponse);
      const response = await database.deleteDocument(
        process.env.REACT_APP_DATABASE_ID,
        process.env.REACT_APP_EVENTS_COLLECTION_ID,
        id
      );
      toast.success("Event deleted successfully");
      navigate("/dashboard/events?filter=total");
    } catch (error) {
      toast.error("Error deleting event");
    }
  };

  const copyTeamId = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(events?.teamId);
    toast.success("Invitation ID copied to clipboard");
  };

  const deleteEventToast = (e) => {
    e.preventDefault();
    //   title: "Delete Event?",
    //   description: "Are you sure you want to delete this event?",
    //   status: "warning",
    //   duration: 9000,
    //   isClosable: true,
    //   position: "top",
    //   render: () => (
    //     <div className="p-4 rounded-[18px] bg-neutral-200 text-neutral-700">
    //       <div className="flex justify-between items-center">
    //         <p>Are you sure you want to delete this event?</p>
    //         <button
    //           onClick={() => {
    //             deleteEvent();
    //             toast.close();
    //           }}
    //           className="primary-btn"
    //         >
    //           Delete
    //         </button>
    //       </div>
    //     </div>
    //   ),
    // });
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-[18px] overflow-hidden pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Are you sure you want to delete this event?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Once you delete this event, it cannot be recovered.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col border-l border-gray-200">
          <button
            onClick={async () => {
              await deleteEvent();
              toast.dismiss(t.id);
            }}
            className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white focus:outline-none"
          >
            Delete
          </button>
          <button
            onClick={async (e) => {
              e.preventDefault();
              toast.dismiss(t.id);
            }}
            className="w-full border border-transparent rounded-none border-t border-neutral-300 p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:bg-indigo-500 hover:text-white focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  useEffect(() => {
      console.log("Team ID: ", events?.teamId, "SUBSCRIBING TO TEAM");
      const unsubscribe = client.subscribe(
        'teams',
        (response) => {
          console.log("Team RT: ", response);
        }
      );
      return () => unsubscribe();
  });

  const { createMembership, teamMembers, memberCount } = CreateMembershipLogic(
    events?.teamId
  );

  const checkMembership = (userId) => {
    const member = teamMembers?.find((member) => member.userId === userId);
    if (member) {
      if (member.joined) return "Joined";
      return "Pending";
    }
    return "Invite";
  };

  console.log(teamMembers, memberCount);

  if (loading) return <Loading />;

  if (error) return <p>{error}</p>;

  return (
    !loading &&
    events && (
      <div
        className="w-full grid md:grid-cols-4 lg:grid-cols-5 gap-4"
        style={{
          color: `rgb(${colors[5]?.join(",")})`,
        }}
      >
        <section
          className={`py-4 ${
            showUsers
              ? "md:col-span-3 lg:col-span-4"
              : "md:col-span-4 lg:col-span-5"
          } grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all`}
        >
          <div className="relative h-full  lg:col-span-2">
            <div className="absolute top-4 left-4 inline-flex gap-2 flex-wrap">
              <Link
                to={`/dashboard/create?id=${events?.$id}`}
                className="shadow-md primary-btn group overflow-hidden transition-all"
              >
                <MdEdit />
                <p className="transition-all translate-x-[0px] hidden lg:block group-hover:translate-x-0">
                  Edit Event
                </p>
              </Link>
              <button
                onClick={deleteEventToast}
                className="shadow-md primary-btn group overflow-hidden transition-all"
              >
                <MdDelete />
                <p className="transition-all translate-x-[0px]  hidden lg:block group-hover:translate-x-0">
                  Delete Event
                </p>
              </button>
              <button
                onClick={copyTeamId}
                className="shadow-md primary-btn group overflow-hidden transition-all"
              >
                <IoCopy />
                <p className="transition-all translate-x-[0px] hidden lg:block  group-hover:translate-x-0">
                  Copy Invite ID
                </p>
              </button>
              <button
                onClick={toggleShowUsers}
                className="shadow-md primary-btn group overflow-hidden transition-all"
              >
                <MdInsertInvitation />
                <p className="transition-all translate-x-[0px] hidden lg:block group-hover:translate-x-0">
                  Invite Users
                </p>
              </button>
            </div>
            <ColorExtractor
              rgb
              getColors={(colors) =>
                setColors((prev) => colors.sort(compareLightness))
              }
            >
              <img
                className="h-full max-h-[65vh] rounded-[18px] object-cover w-full object-center"
                src={events?.image}
              />
            </ColorExtractor>
          </div>

          <div
            className="p-2 py-3 rounded-[18px] overflow-auto max-h-[65vh] space-y-4"
            style={{
              backgroundColor: `rgb(${colors[4]?.join(",")})`,
            }}
          >
            <div
              className="p-4 flex flex-col gap-4"
              style={{
                color: `rgb(${colors[0]?.join(",")})`,
              }}
            >
              {events?.medium === "offline" && (
                <>
                  <iframe
                    className="w-full h-max outline outline-1 outline-neutral-300 shadow-md rounded-[18px]"
                    src={`https://maps.google.com/maps?q=${events.location[1]},${events.location[2]}&hl=en&output=embed`}
                  ></iframe>
                  <h2 className="text-base inline-block">
                    <IoLocation /> {events?.location[0]}
                  </h2>
                </>
              )}
              {events?.medium === "online" && (
                <h2 className="text-lg inline-flex items-center gap-2">
                  <MdComputer /> Online
                </h2>
              )}
              <h2 className="text-lg inline-flex items-center gap-2">
                <IoWalletOutline />{" "}
                {events?.price > 0 ? `Rs. ${events?.price}` : "Free"}
              </h2>
              <h2 className="text-lg inline-flex items-center gap-2">
                <IoPersonOutline />{" "}
                {memberCount > 0
                  ? `${memberCount - 1} Member(s)`
                  : "No members"}
              </h2>
            </div>
          </div>
          <div
            className="col-span-3 p-4 rounded-[18px]"
            style={{
              backgroundColor: `rgb(${colors[0]?.join(",")})`,
            }}
          >
            <h2 className="text-3xl font-bold">{events?.title}</h2>
            <p className="text-sm text-neutral-600 py-4">
              {events?.description}
            </p>
          </div>
        </section>
        {showUsers && (
          <div className="flex flex-col h-full gap-2 p-4 border-l border-neutral-300 bg-gray-100 shadow lg:shadow-none fixed top-0 right-0 overflow-auto">
            <button
              onClick={toggleShowUsers}
              className="absolute top-6 right-4 z-10"
            >
              <IoClose />
            </button>
            <div className="w-full space-y-4">
              <p className="page-title">Search Users</p>
              <div className="w-full px-3 rounded-[18px] bg-neutral-200 outline outline-1 outline-neutral-200 flex items-center justify-between">
                <input
                  onChange={filterUsers}
                  type="text"
                  placeholder="Search name or email"
                  className="w-full bg-transparent py-2 outline-none"
                />
                <IoSearch />
              </div>
            </div>
            {fetchingUsers ? (
              <Loading />
            ) : (
              <div className="flex flex-col gap-2 overflow-auto">
                {(filteredUsers ?? users)?.map((u) => (
                  <div
                    key={u.$id}
                    className="w-full px-3 rounded-[18px] border-b border-neutral-200  flex items-center justify-between gap-2"
                  >
                    <p
                      className="font-bold p-2 rounded-full flex aspect-square text-center items-center justify-center w-10 outline outline-1 outline-neutral-300"
                      style={{
                        backgroundColor: `rgb(${colors[
                          Math.floor(Math.random() * 5) + 3
                        ]?.join(",")})`,
                        color: `rgb(${colors[
                          Math.floor(Math.random() * 2) + 1
                        ]?.join(",")})`,
                      }}
                    >
                      <span>{u.name.charAt(0)}</span>
                    </p>
                    <div className="mr-auto">
                    <p className="text-sm text-left">{u.name}</p>
                    <p className="text-xs text-neutral-500 text-left">{u.email}</p>
                    </div>
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          const res = await createMembership({
                            eventId: id,
                            teamId: events?.teamId,
                            userId: u.userId,
                            name: u.name,
                            email: u.email,
                          });
                          console.log(res);
                          toast.success(
                            `${u.name} has been invited to the event`
                          );
                        } catch (err) {
                          console.log(err);
                          toast.error(err.message);
                        } finally {
                        }
                      }}
                      className="sidebar-link focus:primary-btn"
                    >
                      {checkMembership(u.userId)}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  );
}

export default Event;

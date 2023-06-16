import React, { useCallback, useEffect, useState } from "react";
import Loading from "../../components/Loading";
import UserList from "../../components/UserList";
import client from "../../appwrite.config";
import { Databases, Query } from "appwrite";
import {
  MdOutlinePersonAdd,
  MdOutlinePersonRemove,
  MdPeopleOutline,
} from "react-icons/md";

function Rsvps() {
  const [rsvps, setRsvps] = useState(null);
  const [simplifiedRsvps, setSimplifiedRsvps] = useState(null);
  const [loadingRsvps, setLoadingRsvps] = useState(false);
  const [eventId, setEventId] = useState(null);

  const userId = JSON.parse(localStorage.getItem("token"))?.userId;

  const getEventRsvps = useCallback(async () => {
    if (userId) {
      try {
        setLoadingRsvps((prev) => true);
        const database = new Databases(client);
        const response = await database.listDocuments(
          process.env.REACT_APP_DATABASE_ID,
          process.env.REACT_APP_RSVP_COLLECTION_ID,
          [Query.equal("ownerUserId", userId), Query.equal("pending", true)]
        );
        
        setRsvps((prev) => response?.documents);
        const groupedData = {};
        response?.documents?.forEach((document) => {
          const key = `${document.eventName}_${document.eventId}`;
          if (!groupedData[key]) {
            groupedData[key] = {
              eventName: document?.eventName,
              eventId: document?.eventId,
              teamId: document?.teamId,
              approvedCount: 0,
              rejectedCount: 0,
              users: [],
            };
          }
          if (document.approved) {
            groupedData[key].approvedCount++;
          } else if (document.rejected) {
            groupedData[key].rejectedCount++;
          }

          const user = {
            documentId: document?.$id,
            teamId: document?.teamId,
            name: document?.userName,
            email: document?.userEmail,
            approved: document?.approved,
            rejected: document?.rejected,
            userId: document?.userId,
            eventName: document?.eventName,
            eventId: document?.eventId,
            membershipId: document?.membershipId,
          };
          groupedData[key].users.push(user);
        });
        
        
        setSimplifiedRsvps((prev) => Object.values(groupedData));
      } catch (err) {
        
      } finally {
        setLoadingRsvps((prev) => false);
      }
    }
  }, [userId]);

  

  useEffect(() => {
    if (userId) getEventRsvps();
  }, [getEventRsvps]);

  if (loadingRsvps) return <Loading />;

  return (
    <>
      {simplifiedRsvps && simplifiedRsvps?.length > 0 ? (
        <div className="flex w-full flex-col py-6 group">
          {simplifiedRsvps?.map((event) => (
            <div className="flex w-full justify-between py-4 border-b-neutral-200 border-b">
              <h3
                className="text-lg font-semibold cursor-pointer"
                onClick={(e) => {
                  e?.preventDefault();
                  setEventId(event?.eventId);
                }}
              >
                {event?.eventName}
              </h3>
              <div className="inline-flex items-center gap-6 select-none">
                <UserCount
                  count={event?.users?.length}
                  icon={<MdPeopleOutline />}
                  title="Total"
                />
                <UserCount
                  count={event?.approvedCount}
                  icon={<MdOutlinePersonAdd />}
                  title="Approved"
                />
                <UserCount
                  count={event?.rejectedCount}
                  icon={<MdOutlinePersonRemove />}
                  title="Rejected"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-neutral-500">You don't have any pending RSVPs yet</p>
      )}
      {eventId && (
        <UserList
          fetchingUsers={loadingRsvps}
          toggleShowUsers={(e) => {
            e?.preventDefault();
            setEventId((prev) => null);
          }}
          users={
            simplifiedRsvps.find((event) => event.eventId === eventId).users
          }
        />
      )}
    </>
  );
}

export default Rsvps;

function UserCount({ count, icon, title }) {
  return (
    <div
      className="flex items-center gap-2 text-lg text-neutral-600"
      title={title}
    >
      {icon}
      <p>{count}</p>
    </div>
  );
}

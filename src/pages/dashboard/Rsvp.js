import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { IoAdd, IoPeopleOutline, IoRemove } from "react-icons/io5";
import GetMembershipLogic from "../../Logic/Membership/GetMembership.logic";
import { RiDeleteBackLine } from "react-icons/ri";
import UserList from "../../components/UserList";
import client from "../../appwrite.config";
import { Databases, Query, Teams } from "appwrite";

function Rsvps() {
  const { loading, error, teams, teamsCount, deleteInvitation } =
    GetMembershipLogic();

  const [teamId, setTeamId] = useState(null);
  const [rsvps, setRsvps] = useState(null);
  const [loadingRsvps, setLoadingRsvps] = useState(false);

  const getEventRsvps = useCallback(async () => {
    if (teamId) {
      try {
        setLoadingRsvps((prev) => true);
        const database = new Databases(client);
        const response = await database.listDocuments(
            process.env.REACT_APP_DATABASE_ID,
            process.env.REACT_APP_RSVP_COLLECTION_ID,
            [
                Query.equals("teamId", teamId),
            ]
        )
        setRsvps((prev) => response?.documents);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingRsvps((prev) => false);
      }
    }
  }, [teamId]);

  useEffect(() => {
    if (teamId) getEventRsvps();
  }, [getEventRsvps]);

  if (loading) return <Loading />;

  return (
    <>
      {error && <p>{error}</p>}
      {teams && teams?.length > 0 ? (
        <div className="flex w-full flex-col py-6 group">
          {teams.map((team) => (
            <div
              key={team?.$id}
              className="flex py-4 justify-between border-b border-neutral-300 group gap-2 items-center"
            >
              <h3
                onClick={(e) => {
                  e?.preventDefault();
                  setTeamId(team?.$id);
                }}
                className="font-semibold cursor-pointer"
              >
                {team.name}
              </h3>
              <button
                onClick={(e) => {
                  e?.preventDefault();
                  setTeamId(team?.$id);
                }}
                className="sidebar-link ml-auto flex gap-2 items-center text-neutral-500 my-0"
              >
                <IoPeopleOutline />
                <p>{team.total} Member(s)</p>
              </button>
              {/* <button
                onClick={deleteInvitation}
                className="primary-btn flex gap-2 items-center text-neutral-500 my-0"
              >
                <IoRemove />
                <p>Delete Invitation</p>
              </button> */}
            </div>
          ))}
        </div>
      ) : (
        <p>You don't have any invites yet</p>
      )}
      {teamId && (
        <UserList
          deleteInvitation={deleteInvitation}
          fetchingUsers={loadingRsvps}
          toggleShowUsers={(e) => {
            e?.preventDefault();
            setTeamId((prev) => null);
          }}
          users={rsvps}
          teamName = {teams.find((team) => team.$id === teamId)?.name}
        />
      )}
    </>
  );
}

export default Rsvps;

import React, { useCallback, useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { IoPeopleOutline } from "react-icons/io5";
import GetMembershipLogic from "../../Logic/Membership/GetMembership.logic";
import UserList from "../../components/UserList";
import client from "../../appwrite.config";
import { Teams } from "appwrite";

function Invites() {
  const { loading, error, teams, deleteInvitation } =
    GetMembershipLogic();

  const [teamId, setTeamId] = useState(null);
  const [memberships, setMemberships] = useState(null);
  const [loadingMemberships, setLoadingMemberships] = useState(false);

  const getTeamMemberships = useCallback(async () => {
    if (teamId) {
      try {
        setLoadingMemberships((prev) => true);
        const teams = new Teams(client);
        const response = await teams.listMemberships(teamId);
        setMemberships((prev) => response?.memberships);
      } catch (err) {
        
      } finally {
        setLoadingMemberships((prev) => false);
      }
    }
  }, [teamId]);

  useEffect(() => {
    if (teamId) getTeamMemberships();
  }, [getTeamMemberships]);

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
        <p className="text-neutral-500">You don't have any invites yet</p>
      )}
      {teamId && (
        <UserList
          deleteInvitation={deleteInvitation}
          fetchingUsers={loadingMemberships}
          toggleShowUsers={(e) => {
            e?.preventDefault();
            setTeamId((prev) => null);
          }}
          users={memberships}
          teamName = {teams.find((team) => team.$id === teamId)?.name}
        />
      )}
    </>
  );
}

export default Invites;

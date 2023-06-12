import React from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { IoAdd, IoPeopleOutline, IoRemove } from "react-icons/io5";
import GetMembershipLogic from "../../Logic/Membership/GetMembership.logic";
import { RiDeleteBackLine } from "react-icons/ri";

function Invites() {
  const { loading, error, teams, teamsCount, deleteInvitation } = GetMembershipLogic();

  return (
    <div>
      <div className="inline-flex justify-between w-full items-center">
        <h2 className="page-title">Your Invites</h2>
        <Link to="/dashboard/create" className="primary-btn">
          <IoAdd />
          Create
        </Link>
      </div>
      {loading && <div className="flex-1"><Loading /></div>}
      {error && <p>{error}</p>}
      {teams && (
        <div className="flex w-full flex-col gap-4 py-6 group">
          {teams.map((team) => (
            <div key={team?.$id} className="flex py-4 justify-between border-y border-neutral-300 group gap-2 items-center">
              <h3 className="font-semibold">{team.name}</h3>
              <button className="sidebar-link ml-auto flex gap-2 items-center text-neutral-500 my-0">
                <IoPeopleOutline />
                <p>{team.total} Member(s)</p>
              </button>
              <button onClick={deleteInvitation} className="primary-btn flex gap-2 items-center text-neutral-500 my-0">
                <IoRemove />
                <p>Delete Invitation</p>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Invites;

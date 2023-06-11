import { useCallback, useEffect, useState } from "react";
import client from "../../appwrite.config";
import { ID, Query, Teams } from "appwrite";

export default function CreateMembershipLogic(teamId) {
  
  const [teamMembers, setTeamMembers] = useState(null);
  const [memberCount, setMemberCount] = useState(null);

  async function createMembership({ eventId, teamId, userId, name, email }) {
    console.log(teamId, userId, email, name);
    const teams = new Teams(client);
    const res = await teams.createMembership(
      teamId,
      [],
      `${process.env.REACT_APP_WEBSITE_URL}/accept-invite/${eventId}`,
      email,
      userId,
      "",
      name
    );
    console.log(res);
    setTeamMembers(prev => [...prev, res]);
    setMemberCount(prev => prev + 1);
    return res;
  }

  const getTeamMembers = useCallback(async (teamId) => {
    try {
      const teams = new Teams(client);
      const res = await teams.listMemberships(teamId);
      console.log(res);
      setMemberCount(prev => res.total);
      setTeamMembers(prev => res.memberships);
    }
    catch(err) {
      console.error(err);
    }
  },[teamId])

  useEffect(() => {
    if(teamId)
      getTeamMembers(teamId);
  },[getTeamMembers, teamId])

  return {
    createMembership, teamMembers, memberCount
  };
}

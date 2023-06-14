import { useCallback, useEffect, useState } from "react";
import client from "../../appwrite.config";
import { ID, Query, Teams, Databases } from "appwrite";
import { useNotifications } from "../../context/notificationContext";

export default function CreateMembershipLogic(teamId) {
  const [teamMembers, setTeamMembers] = useState(null);
  const [memberCount, setMemberCount] = useState(null);
  const { sendNotification } = useNotifications();

  async function createMembership({
    eventId,
    teamId,
    userId,
    name,
    email,
    role,
  }) {
    console.log(teamId, userId, email, name, role);
    if (typeof role !== "string") {
      throw new Error("Role must be a string value");
    }
    const teams = new Teams(client);
    const databases = new Databases(client);
    const res = await teams.createMembership(
      teamId,
      typeof role === "undefined" || typeof role !== "string" ? [] : [role],
      `${process.env.REACT_APP_WEBSITE_URL}/accept-invite/${eventId}`,
      email,
      userId,
      "",
      name
    );
    console.log(res);
    setTeamMembers((prev) => [...prev, res]);
    setMemberCount((prev) => prev + 1);
    return res;
  }

  const getTeamMembers = useCallback(
    async (teamId) => {
      try {
        const teams = new Teams(client);
        const res = await teams.listMemberships(teamId);
        console.log(res);
        setMemberCount((prev) => res.total);
        setTeamMembers((prev) => res.memberships);
      } catch (err) {
        console.error(err);
      }
    },
    [teamId]
  );

  useEffect(() => {
    if (teamId) getTeamMembers(teamId);
  }, [getTeamMembers, teamId]);

  return {
    createMembership,
    teamMembers,
    memberCount,
  };
}

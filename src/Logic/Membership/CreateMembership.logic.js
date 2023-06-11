import client from "../../appwrite.config";
import { ID, Query, Teams } from "appwrite";

export default function CreateMembershipLogic() {
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
    return res;
  }

  // teamId: string, roles: string[], url: string, email?: string, userId?: string, phone?: string, name?: string

  return {
    createMembership,
  };
}

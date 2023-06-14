import { useState } from "react";
import { toast } from "react-hot-toast";
import client from "../../appwrite.config";
import { Databases, ID, Query, Teams } from "appwrite";
import { useNotifications } from "../../context/notificationContext";

export default function RsvpLogic(event) {
  const token = JSON.parse(localStorage.getItem("token"));
  const cookieFallback = JSON.parse(localStorage.getItem("cookieFallback"));
  const spotlightUser = JSON.parse(localStorage.getItem("spotlight-user"));
  console.log("EVENT RSVP : ", event);

  const [adding, setAdding] = useState(false);

  const { sendNotification } = useNotifications();

  const checkUserIsOwner = () => {
    console.log("CHECKING USER IS OWNER", event.createdBy, spotlightUser.$id);
    if (token && cookieFallback && spotlightUser) {
      if (event?.createdBy === spotlightUser.$id) {
        console.log("USER IS OWNER");
        return true;
      }
    }
    return false;
  };

  const addRsvp = async () => {
    const database = new Databases(client);
    const response = await database.createDocument(
      process.env.REACT_APP_DATABASE_ID,
      process.env.REACT_APP_RSVP_COLLECTION_ID,
      ID.unique(),
      {
        eventId: event?.$id,
        userId: spotlightUser?.$id,
        teamId: event?.teamId,
        approved: false,
        rejected: false,
        eventName: event?.title,
        userName: spotlightUser?.name,
        userEmail: spotlightUser?.email,
        ownerUserId: event?.createdBy
      }
    );
    console.log(response);
    return response;
  };

  const getRsvp = async () => {
    const database = new Databases(client);
    const response = await database.listDocuments(
      process.env.REACT_APP_DATABASE_ID,
      process.env.REACT_APP_RSVP_COLLECTION_ID,
      [
        Query.equal("eventId", event?.$id),
        Query.equal("userId", spotlightUser?.$id),
        Query.equal("teamId", event?.teamId),
      ]
    );
    console.log(response);
    return response;
  };

  const approveRsvp = async (user) => {
    const {teamId, userId, name, email, documentId, eventName, eventId} = user;
    try {
      const teams = new Teams(client);
      const res = await teams.createMembership(
        teamId,
        ['attendee'],
        `${process.env.REACT_APP_WEBSITE_URL}/accept-invite/${eventId}`,
        email,
        userId,
        "",
        name
      );
      console.log(res);
      const database = new Databases(client);
      const response = await database.updateDocument(
        process.env.REACT_APP_DATABASE_ID,
        process.env.REACT_APP_RSVP_COLLECTION_ID,
        documentId,
        {
          approved: true,
          membershipId: res.$id,
        }
      );
      console.log(response);
      await sendNotification({
        userId: userId,
        fromUserId: spotlightUser?.$id,
        fromUserName: spotlightUser?.name,
        type: "RSVP_APPROVED",
        message: `Your RSVP to ${eventName}'s event has been approved. Please check your email for an invite to the event`,
      });
      toast.success(`RSVP for ${name} has been approved`);
    }
    catch(err) {
      console.log(err);
      toast.error(err.message);
    }
  }

  const rejectRsvp = async ( user ) => {
    const {teamId, userId, name, email, documentId, eventName, eventId, membershipId} = user;
    console.log(user);
    try {
      const database = new Databases(client);
      let res
      if(membershipId) {
        const teams = new Teams(client);
        res = await teams.deleteMembership(
          teamId,
          membershipId
        );
      }
      console.log(res);
      // const response = await database.updateDocument(
      //   process.env.REACT_APP_DATABASE_ID,
      //   process.env.REACT_APP_RSVP_COLLECTION_ID,
      //   documentId,
      //   {
      //     rejected: true,
      //     approved: false,
      //     pending: false
      //   }
      // );
      // console.log(response);
      res = await database.deleteDocument(
        process.env.REACT_APP_DATABASE_ID,
        process.env.REACT_APP_RSVP_COLLECTION_ID,
        documentId
      )
      await sendNotification({
        userId: userId,
        fromUserId: spotlightUser?.$id,
        fromUserName: spotlightUser?.name,
        type: "RSVP_REJECTED",
        message: `Your RSVP to ${eventName}'s event has been rejected by the owner.`,
      });
      toast.success(`RSVP has been rejected`);
    }
    catch(err) {
      console.log(err);
      toast.error(err.message);
    }
  }
 
  const handleRSVP = async (e) => {
    e.preventDefault();
    if (checkUserIsOwner()) {
      toast.error("You cannot RSVP to your own event");
      return;
    }
    if (!token || !cookieFallback) {
      toast.error("Please login to RSVP");
      return;
    }

    try {
      const getRsvpResponse = await getRsvp();
      console.log(getRsvpResponse);
      if (getRsvpResponse?.documents?.length > 0) {
        if (getRsvpResponse?.documents[0]?.approved === true) {
          toast.error(
            "Your RSVP has already been approved. Please check your email for an invite to the event"
          );
          return;
        } else {
          toast.error(
            "You have already RSVP'd to this event. Please wait for the owner to approve your request"
          );
          return;
        }
      }
      setAdding((prev) => true);
      const response = await addRsvp();
      console.log(response);
      toast.success(
        "RSVP has been send to the event owner. You will be notified when they approve your request."
      );
      await sendNotification({
        userId: event?.createdBy,
        fromUserId: spotlightUser?.$id,
        fromUserName: spotlightUser?.name,
        type: "RSVP",
        message: `${spotlightUser?.name} has RSVP'd to your event ${event?.title}`,
      });
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setAdding((prev) => false);
    }
  };

  return {
    token,
    cookieFallback,
    handleRSVP,
    checkUserIsOwner,
    adding,
    approveRsvp,
    rejectRsvp
  };
}

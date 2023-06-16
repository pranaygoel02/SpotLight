import { useState } from "react";
import { toast } from "react-hot-toast";
import client from "../../appwrite.config";
import { Databases, ID, Query, Teams, Account } from "appwrite";
import { useNotifications } from "../../context/notificationContext";

export default function RsvpLogic(event) {
  const token = JSON.parse(localStorage.getItem("token"));
  const cookieFallback = JSON.parse(localStorage.getItem("cookieFallback"));
  const spotlightUser = JSON.parse(localStorage.getItem("spotlight-user"));
  

  const [adding, setAdding] = useState(false);

  const { sendNotification } = useNotifications();

  const checkUserIsOwner = () => {
    if (token && cookieFallback && spotlightUser) {
      if (event?.createdBy === spotlightUser?.$id) {
        return true;
      }
    }
    return false;
  };

  const addRsvp = async (user) => {
    const database = new Databases(client);
    const response = await database.createDocument(
      process.env.REACT_APP_DATABASE_ID,
      process.env.REACT_APP_RSVP_COLLECTION_ID,
      ID.unique(),
      {
        eventId: event?.$id,
        userId: user?.$id,
        teamId: event?.teamId,
        approved: false,
        rejected: false,
        eventName: event?.title,
        userName: user?.name,
        userEmail: user?.email,
        ownerUserId: event?.createdBy,
        pending: true
      }
    );
    
    return response;
  };

  const getRsvp = async (userId) => {
    const database = new Databases(client);
    const response = await database.listDocuments(
      process.env.REACT_APP_DATABASE_ID,
      process.env.REACT_APP_RSVP_COLLECTION_ID,
      [
        Query.equal("eventId", event?.$id),
        Query.equal("userId", userId),
        Query.equal("teamId", event?.teamId),
      ]
    );
    
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
      
      toast.error(err.message);
    }
  }

  const rejectRsvp = async ( user ) => {
    const {teamId, userId, documentId, eventName, membershipId} = user;
    
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

    if(event?.acceptingRsvp === false) {
      toast.error("RSVP for this event is closed");
      return;
    }

    try {
      const account = new Account(client);
      const userRes = await account.get();
      
      const getRsvpResponse = await getRsvp(userRes?.$id);
      
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
      const response = await addRsvp(userRes);
      
      toast.success(
        "RSVP has been send to the event owner. You will be notified when they approve your request."
      );
      await sendNotification({
        userId: event?.createdBy,
        fromUserId: userRes?.$id,
        fromUserName: userRes?.name,
        type: "RSVP",
        message: `${userRes?.name} has RSVP'd to your event ${event?.title}`,
      });
    } catch (err) {
      
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

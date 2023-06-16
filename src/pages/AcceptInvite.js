import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import client from "../appwrite.config";
import { Teams } from "appwrite";
import { toast } from "react-hot-toast";
import Button from "../components/Button";
import { Databases } from "appwrite";
import Loading from "../components/Loading";
import Ticket from "../components/Ticket";
import { useNotifications } from "../context/notificationContext";

function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const {sendNotification} = useNotifications();
  const teamId = searchParams.get("teamId");
  const userId = searchParams.get("userId");
  const membershipId = searchParams.get("membershipId");
  const secret = searchParams.get("secret");

  

  const [accepting, setAccepting] = useState(false);
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showTicket, setShowTicket] = useState(false);

  useEffect(() => {
    if (secret === null || secret === undefined) {
      navigate("/");
    }
  }, [secret]);

  useEffect(() => {
    const getEventById = async () => {
      try {
        setLoading((prev) => true);
        const database = new Databases(client);
        const response = await database.getDocument(
          process.env.REACT_APP_DATABASE_ID,
          process.env.REACT_APP_EVENTS_COLLECTION_ID,
          eventId
        );
        setEvent((prev) => response);
        const userResponse = await database.getDocument(
          process.env.REACT_APP_DATABASE_ID,
          process.env.REACT_APP_USERS_COLLECTION_ID,
          userId
        )
        setUser((prev) => userResponse);
      } catch (err) {
        
      } finally {
        setLoading((prev) => false);
      }
    };
    if (eventId && secret) {
      getEventById();
    }
  }, [eventId, secret, userId]);

  const acceptInvite = async (e) => {
    e?.preventDefault();
    setAccepting((prev) => true);
    try {
      const teams = new Teams(client);
      const res = await teams.updateMembershipStatus(
        teamId,
        membershipId,
        userId,
        secret
      );
      
      toast.success("Invitation accepted successfully!");
      await sendNotification({
        message: `${res?.userName} accepted your invitation to ${res?.teamName}!`,
        userId: event?.createdBy,
        fromUserId: res?.userId,
        fromUserName: res?.userName
      })
      if (event?.medium === "online") navigate("/");
      else {
        setShowTicket((prev) => true);
        toast.success("Your ticket is ready!");
      }
    } catch (err) {
      
      toast.error(err.message ?? err);
    } finally {
      setAccepting((prev) => false);
    }
  };

  const rejectInvite = async (e) => {
    e?.preventDefault();
    setAccepting((prev) => true);
    try {
      const teams = new Teams(client);
      
      await teams.deleteMembership(teamId, membershipId);
      
      toast.success("Invitation rejected successfully!");
      await sendNotification({
        message: `${user?.name ?? user?.userName ?? user?.email ?? `User with ID ${userId}`} rejected your invitation to ${event?.title}!`,
        userId: event?.createdBy,
        fromUserId: userId,
        fromUserName: user?.name
      })
      navigate("/");
    } catch (err) {
      
      toast.error(err.message ?? err);
    } finally {
      setAccepting((prev) => false);
    }
  };

  if (loading) return <Loading />;

  if (event)
    return (
      <div className="h-screen w-screen relative bg-black">
        <img
          alt="event"
          src={event?.image}
          className="w-full h-full opacity-50 object-cover"
        />
        {showTicket ? (
          <div className="fixed inset-0 w-full h-full my-auto">
            <Ticket
              show={showTicket}
              text={`${process.env.REACT_APP_WEBSITE_URL}/mark-attendance?teamId=${teamId}&membershipId=${membershipId}`}
              event={event}
            />
            <p className="text-lg text-center text-white">We recommend downloading the ticket now.<br/>The QR Code will be scanned to mark attendance of the day of the event.</p>
          </div>
        ) : (
          <div className="fixed overflow-auto left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] flex flex-col gap-4 items-center text-center justify-center p-8 rounded-[18px] bg-white text-black">
            <h2 className="page-title">
              Wohoho! You have an invitation for attending {event?.title}!
            </h2>
            <p>Do you want to accept it?</p>
            <Button
              text={"Accept Invitation"}
              style="my-2"
              cb={acceptInvite}
              loading={accepting}
            />
            {/* <button className="text-red-500" onClick={rejectInvite}>
              Reject Invitation
            </button> */}
          </div>
        )}
      </div>
    );
  return null;
}

export default AcceptInvite;

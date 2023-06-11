import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import client from "../appwrite.config";
import { Teams } from "appwrite";
import { toast } from "react-hot-toast";
import Button from "../components/Button";
import { Databases } from "appwrite";
import Loading from "../components/Loading";

function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { eventId } = useParams();

  const teamId = searchParams.get("teamId");
  const userId = searchParams.get("userId");
  const membershipId = searchParams.get("membershipId");
  const secret = searchParams.get("secret");

  console.log(teamId, userId, membershipId, secret);

  const [accepting, setAccepting] = useState(false);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);

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
      } catch (err) {
        console.log(err);
      } finally {
        setLoading((prev) => false);
      }
    };
    if (eventId && secret) {
      getEventById();
    }
  }, [eventId, secret]);

  const acceptInvite = async (e) => {
    e.preventDefault();
    setAccepting((prev) => true);
    try {
      const teams = new Teams(client);
      const res = await teams.updateMembershipStatus(
        teamId,
        membershipId,
        userId,
        secret
      );
      console.log(res);
      toast.success("Invitation accepted successfully!");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    } finally {
      setAccepting((prev) => false);
    }
  };

  const rejectInvite = async (e) => {
    e.preventDefault();
    setAccepting((prev) => true);
    try {
      const teams = new Teams(client);
      const res = await teams.deleteMembership(teamId, membershipId);
      console.log(res);
      toast.success("Invitation rejected successfully!");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    } finally {
      setAccepting((prev) => false);
    }
  };

  if (loading) return <Loading />;

  if (event)
    return (
      <div className="h-screen w-screen relative bg-black">
        <img
          src={event?.image}
          className="w-full h-full opacity-50 object-cover"
        />
        <div className="fixed overflow-auto left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] flex flex-col gap-4 items-center text-center justify-center p-8 rounded-[18px] bg-white text-black">
          <h2 className="page-title">
            Wohoho! You have an invitation for attending {event?.title}!
          </h2>
          <p>Do you want to accept it?</p>
          <Button
            text={"Accept Invitation"}
            style='my-2'
            cb={acceptInvite}
            loading={accepting}
          />
          <button className="text-red-500" onClick={rejectInvite}>Reject Invitation</button>
        </div>
      </div>
    );
  return null;
}

export default AcceptInvite;

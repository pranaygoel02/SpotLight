import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import client from "../appwrite.config";
import { Teams } from "appwrite";
import { toast } from "react-hot-toast";
import Loading from "../components/Loading";

import {TiTick} from 'react-icons/ti';
import {AiFillCloseCircle} from 'react-icons/ai';
import { MdInfo } from "react-icons/md";

function MarkAttendance() {
  const [searchParams] = useSearchParams();
  
  const teamId = searchParams.get("teamId");
  const membershipId = searchParams.get("membershipId");

  
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
        new: false,
        attended: false,
        invalid: false,
        message: ''
  })

  useEffect(() => {
    if( teamId && membershipId) {
        markAttendance();
    }
    else {
        setState((prev) => (
            {
                ...prev,
                invalid: true,
                message: 'Invalid Ticket'
            }
        ))
    }
  }, [teamId, membershipId]);

  const markAttendance = async () => {
    setLoading((prev) => true);
    try {
      const teams = new Teams(client);
      const getMember = await teams.getMembership(teamId, membershipId);
        if(getMember?.roles.includes('attended')) {  
            setState((prev) => (
                {
                    ...prev,
                    attended: true,
                    message: 'Already marked attendance!'
                }
            ))
            throw new Error('Already marked attendance!');
        }
        
      const res = await teams.updateMembershipRoles(
        teamId,
        membershipId,
        [ ...getMember?.roles ,"attended"]
      );
      
      toast.success("Attendance Marked successfully!");
        setState((prev) => (
            {
                ...prev,
                new: true,
                message: 'Attendance Marked successfully!'
            }
        ))
    } catch (err) {
      
      toast.error(err.message ?? err ?? "Something went wrong!");
        setState((prev) => (
            {
                ...prev,
                invalid: true,
                message: err.message ?? err ?? "Invalid Ticket"
            }
        ))
    } finally {
      setLoading((prev) => false);
    }
  };

  if (loading) return <Loading text={'Marking Attendance'} />;

  return (
        <div className="flex flex-col items-center justify-center font-grostek h-screen gap-8">
            <h1 className="font-bold text-lg ">{state?.message}</h1>
            {
                state?.new && <TiTick className="text-5xl text-green-500" />
            }
            {
                state?.invalid && <AiFillCloseCircle className="text-5xl text-red-500" />
            }
            {
                state?.attended && <MdInfo className="text-5xl text-green-500" />
            }
        </div>
  );
}

export default MarkAttendance;
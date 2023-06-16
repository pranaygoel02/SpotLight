import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import client from "../appwrite.config";
import { Account } from "appwrite";
import { toast } from "react-hot-toast";
import Loading from "../components/Loading";

function VeirfyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (secret === null || secret === undefined) {
      navigate("/");
    }
    if(secret && userId) {
        verifyEmail();
    }
  }, [secret]);

  const verifyEmail = async () => {
    setLoading((prev) => true);
    try {
      const account = new Account(client);
      const res = await account.updateVerification(
        userId,
        secret
      );
      
      toast.success("Email verified successfully!");
      navigate("/dashboard/account");
    } catch (err) {
      
      toast.error(err.message ?? err ?? "Something went wrong!");
      navigate('/')
    } finally {
      setLoading((prev) => false);
    }
  };

  if (loading) return <Loading text={'Verifying Email'} />;

  return null;
}

export default VeirfyEmail;

import React, { useEffect, useState } from "react";
import Avatar from "../../components/Avatar";
import Input from "../../components/Input";
import { MdVerified } from "react-icons/md";
import client from "../../appwrite.config";
import { Account as Ac, Databases, Query } from "appwrite";
import { toast } from "react-hot-toast";
import Button from "../../components/Button";
import { useUser } from "../../context/userContext";

function Account() {
  const [loading, setLoading] = useState(false);
  const [updateFields, setUpdateFields] = useState(false);

  const {userInfo, setUserInfo} = useUser()

  // const user = JSON.parse(localStorage.getItem("spotlight-user"));

  const {
    name: userName,
    email: userEmail,
    phone: userPhone,
    emailVerification,
    phoneVerification,
  } = userInfo;

  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [phone, setPhone] = useState(userPhone);

  const verifyEmail = async (e) => {
    e.preventDefault();
    
    try {
      setLoading((prev) => true);
      const account = new Ac(client);
      const res = await account.createVerification(
        `${process.env.REACT_APP_WEBSITE_URL}/verify-email`
      );
      
      toast.success("Verification email sent");
    } catch (err) {
      console.error(err);
      toast.error(err.messsage);
    } finally {
      setLoading((prev) => false);
    }
  };

  const inputFields = [
    {
      label: "Name",
      type: "text",
      name: "name",
      value: name,
      cb: setName,
      disabled: !updateFields,
      requird: true,
    },
    {
      label: "Email",
      type: "email",
      name: "email",
      value: email,
      cb: setEmail,
      disabled: true,
      rightIcon: emailVerification ? <Verified /> : <Verify cb={verifyEmail} />,
    },
    {
      label: "Phone",
      type: "tel",
      name: "phone",
      value: phone,
      cb: setPhone,
      disabled: true,
      rightIcon: phoneVerification ? <Verified /> : <Verify />,
    },
  ];

  const revalidateFields = () => {
    const user = JSON.parse(localStorage.getItem("spotlight-user"));
    const {
      name: userName,
      email: userEmail,
      phone: userPhone,
    } = user;
    setName((prev) => userName);
    setEmail((prev) => userEmail);
    setPhone((prev) => userPhone);
    setUserInfo(prev => user)
  };

  const handleUpdateFields = async (e) => {
    e.preventDefault();
    try {
      setLoading((prev) => true);
      const account = new Ac(client);
      
      
      if (name !== userName) {
        const res = await account.updateName(name);
        
        const databases = new Databases(client);
        const userDoc = await databases.listDocuments(
          process.env.REACT_APP_DATABASE_ID,
          process.env.REACT_APP_USERS_COLLECTION_ID,
          [Query.equal("userId", userInfo.$id)]
        );
        if (userDoc?.documents?.length > 0) {
          const docRes = await databases.updateDocument(
            process.env.REACT_APP_DATABASE_ID,
            process.env.REACT_APP_USERS_COLLECTION_ID,
            userDoc?.documents[0]?.$id,
            {
              name,
            }
          );
        }
        toast.success("Name updated successfully!");
        
        localStorage.setItem("spotlight-user", JSON.stringify(res));
        revalidateFields();
      }
    } catch (err) {
      
      toast.error(err.message);
    } finally {
      setLoading((prev) => false);
    }
  };

  useEffect(() => {
    if (!updateFields) {
      setName((prev) => userName);
      setEmail((prev) => userEmail);
      setPhone((prev) => userPhone);
    }
  }, [updateFields]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-4 ">
      <Avatar size={"text-3xl"} name={userName} />
      <h1 className="page-title">Hello, {userName}</h1>
      <form
        onSubmit={handleUpdateFields}
        className="flex flex-col gap-4 w-full max-w-[400px]"
      >
        {inputFields?.map((field, index) => (
          <Input key={index} {...field} show={true} />
        ))}
        <button
          className="rounded-[18px] bg-neutral-300 mt-2 p-4 outline outline-1 outline-neutral-300"
          onClick={(e) => {
            e.preventDefault();
            setUpdateFields((prev) => !prev);
          }}
        >
          {updateFields ? "Cancel" : "Edit"}
        </button>
        {updateFields && (
          <Button
            type="submit"
            className="primary-btn"
            style="mt-0"
            text={"Save"}
            disabled={!updateFields}
            loading={loading}
          />
        )}
      </form>
    </div>
  );
}

export default Account;

function Verified() {
  return (
    <p className="bg-green-600 rounded-[18px] p-2 py-1 inline-flex text-white gap-1 items-center">
      <MdVerified /> Verified
    </p>
  );
}

function Verify({ cb }) {
  return (
    <button onClick={cb} className="primary-btn">
      Verify
    </button>
  );
}

import React, { useCallback, useState } from "react";
import { IoClose, IoDownload, IoPerson, IoSearch } from "react-icons/io5";
import Loading from "./Loading";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { MdDownloadForOffline, MdHandshake, MdPeople } from "react-icons/md";
import { useNotifications } from "../context/notificationContext";
import RsvpLogic from "../Logic/Explore/rsvp.logic";
import { Databases, Query } from "appwrite";
import client from "../appwrite.config";
import * as XLSX from "xlsx";

function UserList({
  toggleShowUsers,
  users,
  fetchingUsers,
  createMembership,
  id,
  events,
  checkMembership,
  colors,
  deleteInvitation,
  teamName,
}) {
  const [filteredUsers, setFilteredUsers] = useState(null);
  const { pathname } = useLocation();

  
  
  

  const { sendNotification } = useNotifications();
  const { approveRsvp, rejectRsvp } = RsvpLogic();

  colors = colors ?? [
    [255, 107, 107],
    [255, 159, 67],
    [255, 205, 86],
    [75, 192, 192],
    [54, 162, 235],
    [153, 102, 255],
    [255, 159, 243],
    [255, 99, 132],
    [255, 205, 86],
    [75, 192, 192],
    [54, 162, 235],
    [153, 102, 255],
  ];

  const filterUsers = useCallback(
    (e) => {
      const value = e.target.value.toLowerCase();
      const filtered = users.filter((user) => {
        
        
        
        return (
          (user?.name ?? user?.userName).toLowerCase().includes(value || "") ||
          (user.email ?? user?.userEmail).toLowerCase().includes(value || "") ||
          user?.roles?.join(",").includes(value || "")
        );
      });
      setFilteredUsers((prev) => filtered);
    },
    [users]
  );

  const checkUserIsOwner = (id) => {
    const userId = JSON.parse(localStorage.getItem("spotlight-user"))?.["$id"];
    const user = users?.find((user) => user?.userId === (id ?? userId));
    return user?.roles?.includes("owner") ?? false;
  };

  const checkUserRoles = (id) => {
    const userId = JSON.parse(localStorage.getItem("spotlight-user"))?.["$id"];
    const user = users?.find((user) => user?.userId === (id ?? userId));
    
    
    
    return user?.roles;
  };

  const userMembershipId = (id) => {
    const userId = JSON.parse(localStorage.getItem("spotlight-user"))?.["$id"];
    const user = users.find((user) => user?.userId === (id ?? userId));
    return {
      membershipId: user?.$id,
      teamId: user?.teamId,
      userId: user?.userId,
    };
  };

  const handleInvite = async (user, role) => {
    
    const fromUser = JSON.parse(localStorage.getItem("spotlight-user"));
    try {
      if (typeof createMembership === "function") {
        const res = await createMembership({
          eventId: id,
          teamId: events?.teamId,
          userId: user.userId,
          name: user.name,
          email: user.email,
          role,
        });
        
        toast.success(`${user.name} has been invited to the event`);

        await sendNotification({
          userId: user.userId,
          message: `You have an invitation!\nYou have an invitation to join ${fromUser?.name}'s team for ${events?.title} event as a ${role}. Please check your mail for an invitation link.`,
          fromUserId: fromUser?.$id,
          fromUserName: fromUser?.name,
          link: `${process.env.REACT_APP_WEBSITE_URL}/event/${id}`,
        });
      } else {
        if (user.joined) {
          await deleteInvitation(userMembershipId(user.userId));
          const databases = new Databases(client);
          const res = await databases.listDocuments(
            process.env.REACT_APP_DATABASE_ID,
            process.env.REACT_APP_RSVP_COLLECTION_ID,
            [
              Query.equal("teamId", events?.teamId),
              Query.equal("userId", user?.userId),
            ]
          );
          
          if (res?.documents?.length > 0) {
            const delRes = await databases.deleteDocument(
              process.env.REACT_APP_DATABASE_ID,
              process.env.REACT_APP_RSVP_COLLECTION_ID,
              res?.documents[0]?.$id
            );
            
          }
          toast.success("Invitation deleted");
          await sendNotification({
            userId: user.userId,
            message: `Your invitation to join ${teamName} event as a ${checkUserRoles(
              user?.userId
            ).join("/")} has been revoked by the owner.`,
            fromUserId: fromUser?.$id,
            fromUserName: fromUser?.name,
          });
          toggleShowUsers();
          window.location.reload();
        }
      }
    } catch (err) {
      
      toast.error(err.message);
    } finally {
    }
  };

  const downloadExcel = (data) => {
    const sanitizedData = data?.map((user) => {
      return {
        "Membarship ID": user?.$id,
        "Name": user?.userName,
        "Email": user?.userEmail,
        "User ID": user?.userId,
        "Invited": user?.invited,
        "Joined": user?.joined,
        "Confirm": user?.confirm,
        "Roles": user?.roles?.join(","),
      }
    })
    const worksheet = XLSX.utils.json_to_sheet(sanitizedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, "DataSheet.xlsx");
  };

  return (
    <div className="flex flex-col h-full gap-2 p-4 border-l border-neutral-300 bg-gray-100/95 backdrop-blur shadow lg:shadow-none fixed top-0 right-0 overflow-auto min-w-[25vw]">
      <button onClick={toggleShowUsers} className="absolute top-6 right-4 z-10">
        <IoClose />
      </button>
      <div className="w-full space-y-4">
        <p className="page-title">
          Search {deleteInvitation ? "Members" : "Users"}{" "}
          {checkUserIsOwner() && (
            <button
              onClick={(e) => {
                e?.preventDefault();
                downloadExcel(users);
              }}
              className="primary-btn items-center"
              style={{
                fontSize: "0.6rem",
              }}
            >
              <MdDownloadForOffline className="text-base" /> Download XLSX
            </button>
          )}
        </p>

        <div className="w-full px-3 rounded-[18px] bg-neutral-200 outline outline-1 outline-neutral-200 flex items-center justify-between">
          <input
            onChange={filterUsers}
            type="text"
            placeholder="Search name or email or role"
            className="w-full bg-transparent py-2 outline-none"
          />
          <IoSearch />
        </div>
      </div>
      {fetchingUsers ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-2 overflow-auto h-full">
          {(filteredUsers ?? users)?.map((u) => (
            <div
              key={u.$id ?? u?.userId}
              className="w-full px-3 pb-2 border-b border-neutral-200  flex items-center justify-between gap-2"
            >
              <p
                className="font-bold p-2 rounded-full flex aspect-square text-center items-center justify-center w-10 outline outline-1 outline-neutral-300"
                style={{
                  backgroundColor: `rgb(${colors[
                    Math.floor(Math.random() * 5) + 3
                  ]?.join(",")})`,
                  color: `rgb(${colors[Math.floor(Math.random() * 2) + 1]?.join(
                    ","
                  )})`,
                }}
              >
                <span>{(u?.name ?? u?.userName)?.charAt(0)}</span>
              </p>
              <div className="mr-auto">
                <p className="text-sm text-left">{u?.name ?? u?.userName}</p>
                <p className="text-xs text-neutral-500 text-left">
                  {u?.email ?? u?.userEmail}
                </p>
              </div>
              {checkUserRoles(u?.userId)?.map((role) => {
                if (role === "owner")
                  return (
                    <IoPerson
                      title="Owner"
                      className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-600 text-neutral-100 rounded-full text-3xl flex"
                    />
                  );
                if (role === "collaborator")
                  return (
                    <MdHandshake
                      title="Collaborator"
                      className="p-2 bg-gradient-to-br from-primary/80 to-primary text-neutral-100 rounded-full text-3xl flex"
                    />
                  );
                if (role === "volunteer")
                  return (
                    <MdPeople
                      title="Volunteer"
                      className="p-2 bg-gradient-to-br from-accent/80 to-accent text-neutral-100 rounded-full text-3xl flex"
                    />
                  );
                return null;
              })}
              {
                <button
                  disabled={checkUserIsOwner(u?.userId)}
                  style={{
                    display:
                      checkUserIsOwner(u?.userId) || pathname.includes("rsvp")
                        ? "none"
                        : "block",
                  }}
                  onClick={async (e) => {
                    e?.preventDefault();
                    
                    toast.custom((t) =>
                      typeof createMembership === "function" ? (
                        <form
                          onSubmit={async (e) => {
                            e?.preventDefault();
                            const form = e.target;
                            const formData = Object.fromEntries(
                              new FormData(form)
                            );
                            
                            await handleInvite(u, formData.role);
                            toast.dismiss(t.id);
                          }}
                          className={`${
                            t.visible ? "animate-enter" : "animate-leave"
                          } max-w-md w-full bg-white shadow-lg rounded-[18px] overflow-hidden pointer-events-auto grid grid-cols-3`}
                        >
                          <div className="flex-1 col-span-2 p-4 w-full">
                            <div className="flex">
                              <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  What role would you like to assign to this
                                  user?
                                </p>
                                <select name="role">
                                  <option value={"collaborator"}>
                                    Collaborator
                                  </option>
                                  <option value={"volunteer"}>Volunteer</option>
                                  <option value={"attendee"}>Attendee</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col border-l border-gray-200">
                            <button
                              type="submit"
                              className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium text-primary hover:bg-primary hover:text-white focus:outline-none"
                            >
                              Invite
                            </button>
                            <button
                              onClick={async (e) => {
                                e?.preventDefault();
                                toast.dismiss(t.id);
                              }}
                              className="w-full border border-transparent rounded-none border-t border-neutral-300 p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:bg-indigo-500 hover:text-white focus:outline-none"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div
                          className={`${
                            t.visible ? "animate-enter" : "animate-leave"
                          } max-w-md w-full bg-white shadow-lg rounded-[18px] overflow-hidden pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                        >
                          <div className="flex-1 w-0 p-4">
                            <div className="flex items-start">
                              <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  Are you sure you want to delete this invite?
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  Once you delete this, it cannot be recovered.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col border-l border-gray-200">
                            <button
                              onClick={async () => {
                                await handleInvite(u);
                                toast.dismiss(t.id);
                              }}
                              className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white focus:outline-none"
                            >
                              Delete
                            </button>
                            <button
                              onClick={async () => {
                                e?.preventDefault();
                                toast.dismiss(t.id);
                              }}
                              className="w-full border border-transparent rounded-none border-t border-neutral-300 p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:bg-indigo-500 hover:text-white focus:outline-none"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )
                    );
                  }}
                  className="sidebar-link focus:primary-btn"
                >
                  {typeof checkMembership === "function"
                    ? checkMembership(u?.userId)
                    : checkUserIsOwner(u?.userId)
                    ? // <IoPerson
                      //   title="Owner"
                      //   className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-600 text-neutral-100 rounded-full text-3xl flex"
                      // />
                      null
                    : checkUserIsOwner() && (
                        <> {u.joined ? "Delete" : "Pending"}</>
                      )}
                </button>
              }
              {pathname.includes("rsvp") && (
                <div className="inline-flex gap-1 items-center">
                  <button
                    disabled={u?.approved}
                    onClick={async (e) => {
                      e?.preventDefault();
                      await approveRsvp(u);
                    }}
                    className="sidebar-link focus:primary-btn disabled:bg-green-500 disabled:text-white disabled:cursor-not-allowed"
                  >
                    Approve{u?.approved ? "d" : ""}
                  </button>
                  <button
                    onClick={async (e) => {
                      e?.preventDefault();
                      await rejectRsvp(u);
                    }}
                    className="sidebar-link focus:primary-btn"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
          {deleteInvitation && !checkUserIsOwner() && (
            <button
              onClick={async (e) => {
                e?.preventDefault();
                try {
                  const { teamId, membershipId, userId } = userMembershipId();
                  await deleteInvitation({ teamId, membershipId });
                  toast.success("Invitation deleted");
                  const user = JSON.parse(
                    localStorage.getItem("spotlight-user")
                  );
                  const databases = new Databases(client);
                  const res = await databases.listDocuments(
                    process.env.REACT_APP_DATABASE_ID,
                    process.env.REACT_APP_RSVP_COLLECTION_ID,
                    [
                      Query.equal("teamId", teamId),
                      Query.equal("userId", userId),
                    ]
                  );
                  
                  if (res?.documents?.length > 0) {
                    const delRes = await databases.deleteDocument(
                      process.env.REACT_APP_DATABASE_ID,
                      process.env.REACT_APP_RSVP_COLLECTION_ID,
                      res?.documents[0]?.$id
                    );
                    
                  }
                  const owner = users?.find((u) =>
                    u?.roles?.includes("owner")
                  )?.userId;
                  await sendNotification({
                    userId: owner,
                    message: `${user?.name} has rejected your invitation to join ${teamName}}`,
                    fromUserId: user?.$id,
                    fromUserName: user?.name,
                  });
                  toggleShowUsers();
                  window.location.reload();
                } catch (err) {
                  toast.error(err.message);
                }
              }}
              className="sticky mt-auto bottom-0 left-0 w-full p-4 text-center bg-red-600 text-white shadow-sm rounded-[18px]"
            >
              Reject Invitation
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default UserList;

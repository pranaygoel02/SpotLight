import React, { useCallback, useEffect, useState } from "react";
import {
  IoArrowBack,
  IoCalendarClearOutline,
  IoHome,
  IoHomeOutline,
  IoLogOut,
  IoLogOutOutline,
  IoNotifications,
  IoNotificationsOutline,
  IoPeople,
  IoPeopleOutline,
  IoPersonOutline,
  IoTicketOutline,
} from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import LogoutLogic from "../Logic/UserLogic.js/Logout.logic";
import client from "../appwrite.config";
import { Account } from "appwrite";
import { MdEventBusy, MdRsvp } from "react-icons/md";
import { useNotifications } from "../context/notificationContext";

function Sidebar() {
  const { logout } = LogoutLogic();
  const [userInfo, setUserInfo] = useState(null);

  const { toggleNotificationBar, unreadNotifications } = useNotifications();

  const getUserInfo = useCallback(async () => {
    try {
      const account = new Account(client);
      const res = await account.get();
      console.log(res);
      localStorage.setItem("spotlight-user", JSON.stringify(res));
      setUserInfo((prev) => res);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return (
    <div className="flex flex-col p-4 border-r border-neutral-200 gap-2 ">
      <Link className="sidebar-link" to="/">
        Logo
      </Link>
      <Link className="sidebar-link" to="">
        <IoHomeOutline /> Home
      </Link>
      <NavLink className="sidebar-link" to="events?filter=total">
        <IoCalendarClearOutline /> Events
      </NavLink>
      <NavLink className="sidebar-link" to="invities">
        <IoTicketOutline /> Invities
      </NavLink>
      <NavLink className="sidebar-link" to="rsvp">
        <IoPeopleOutline /> RSVPs
      </NavLink>
      <button className="sidebar-link" onClick={toggleNotificationBar}>
        <div className="relative">
        <IoNotificationsOutline />
        {unreadNotifications > 0 && <p className="absolute -top-3 p-2 aspect-square -right-2 bg-primary text-white rounded-full text-[10px] text-center w-2 h-2 flex items-center justify-center"><span className="w-max h-max">{unreadNotifications > 9 ? `9+` : unreadNotifications}</span></p>}
        </div>Notifications
      </button>
      <div className="mt-auto flex flex-col">
        <NavLink
          title={userInfo?.email}
          className="sidebar-link inline-flex items-center gap-1"
          to="account"
        >
          {userInfo ? (
            <>
              <IoPersonOutline /> {userInfo?.name?.split(" ")[0]}
            </>
          ) : (
            "Account"
          )}
        </NavLink>
        <button className="sidebar-link" onClick={logout}>
          <IoLogOutOutline /> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;

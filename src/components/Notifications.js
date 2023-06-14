import React from "react";
import { useNotifications } from "../context/notificationContext";
import NotificationCard from "./NotificationCard";
import { MdClose } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import Loading from "./Loading";

function Notifications() {
  const { show, toggleNotificationBar, notifications, unreadNotifications } = useNotifications();

  console.log('Notifications >>>>>> ',notifications);

  return show ? <div className={` overflow-y-auto transition-all border-r border-neutral-200`}>
    <h2 className="sticky bg-gray-100 top-0 p-4 z-10 px-2 page-title w-full border-neutral-200 border-b inline-flex gap-2 items-center "><button onClick={toggleNotificationBar}><IoArrowBack className="text-neutral-800"/></button> Notifications</h2>
    {notifications?.length <= 0 ? <Loading /> :  
    <div className="overflow-auto p-4 px-2 flex flex-col gap-2 bg-gray-200 h-full w-full">
      {
        notifications?.map((notification) => (
          <NotificationCard key={notification.$id} {...notification} />
        ))
      }
    </div>}
  </div> : null;
}

export default Notifications;

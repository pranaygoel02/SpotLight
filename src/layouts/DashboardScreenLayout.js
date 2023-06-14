import React from "react";
import { IoAdd } from "react-icons/io5";
import { Link } from "react-router-dom";

function DashboardScreenLayout({children, title}) {
  return (
    <div>
      <div className="inline-flex justify-between w-full items-center">
        <h2 className="page-title">{title}</h2>
        <Link to="/dashboard/create" className="primary-btn">
          <IoAdd />
          Create
        </Link>
      </div>
      {children}
    </div>
  );
}

export default DashboardScreenLayout;

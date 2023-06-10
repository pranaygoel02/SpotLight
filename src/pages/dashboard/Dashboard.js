import React, { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { Link } from "react-router-dom";

function Dashboard() {
  
  const[date,setDate] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000);
    return () => {
      clearInterval(timer)
    }
  }, [date]);
  
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-sm text-neutral-500 font-poppins">{date.toGMTString()}</p>
        </div>
        <Link to='create' className="primary-btn">
          <IoAdd />
          Create
        </Link>
      </div>
      
    </div>
  );
}

export default Dashboard;

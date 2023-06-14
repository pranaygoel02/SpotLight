import React from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import { Link } from "react-router-dom";

function BackBtn({to}) {
  return (
    <Link
      to={to}
      className="flex gap-1 font-bold items-center group  w-max rounded-[18px] transition-all duration-500"
    >
      <MdOutlineArrowBack
        className=" rounded-full  group-hover:p-1 group-hover:text-black"
        size={24}
      />
      <p className="text-gray-100 relative text-transparent group-hover:text-black translate-x-16 group-hover:translate-x-0 group-hover:block transition-all">
        Go back
      </p>
    </Link>
  );
}

export default BackBtn;

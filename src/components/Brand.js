import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/images/logo.svg";
import Logo2 from "../assets/images/logo_color.svg";

function Brand({ size, color }) {
  const { pathname } = useLocation();

  return (
    <Link
      title="Home"
      className={`font-extrabold gap-2 capitalize inline-flex text-xl items-center ${color} text-${size}xl ${pathname.includes('dashboard') && 'text-primary'} font-poppins`}
      to={"/"}
    >
      <img className="w-8" src={pathname.includes('dashboard') ? Logo2 : Logo} />
      <span className={pathname.includes('dashboard') ? 'hidden' : 'block'}>SpotLight</span>
    </Link>
  );
}

export default Brand;

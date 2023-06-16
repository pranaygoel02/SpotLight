import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/images/logo.svg";
import Logo2 from "../assets/images/logo_color.svg";

function Brand({ size }) {
  const { pathname } = useLocation();

  return (
    <Link
      title="Home"
      className={`font-extrabold gap-2 capitalize inline-flex text-xl items-center ${(pathname.includes('dashboard') || pathname.includes('auth')) && 'text-primary'} font-poppins`}
      to={"/"}
    >
      <img alt="Logo" className={size ?? "w-8"} src={(pathname.includes('dashboard') || pathname.includes('auth')) ? Logo2 : Logo} />
      <span className={(pathname.includes('dashboard') || pathname.includes('auth')) ? 'hidden' : 'block'}>SpotLight</span>
    </Link>
  );
}

export default Brand;

import { useEffect, useState } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import Button from "./Button";
import LogoutLogic from "../Logic/UserLogic.js/Logout.logic";

function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);

  

  const [navData, setNavData] = useState([]);

  let token = localStorage.getItem("token");

  useEffect(() => {
  console.log(token);
   setNavData((prev) => [
        {
          title: "Dashboard",
          link: "/dashboard",
          show: token ? true : false,
        },
        {
          title: "Login",
          link: "/auth/login",
          show: token ? false : true,
        },
        {
          title: "Signup",
          link: "/auth/signup",
          show: token ? false : true,
        },
      ]);
  }, [token]);

  const { logout } = LogoutLogic();

  return (
    <div className="app">
      <nav className=" text-black">
        <div className="container">
          <div className="flex mx-auto justify-between ">
            {/* Primary menu and logo */}
            <div className="flex items-center justify-between w-full gap-16 my-8">
              {/* logo */}
              <div>
                <a href="/" className="flex gap-1 font-bold items-center ">
                  <span>Logo</span>
                </a>
              </div>
              {/* primary */}
              <div className="hidden lg:flex gap-8 ">
                {navData?.map(
                  (item, index) =>
                    item.show && (
                      <NavLink
                        onClick={() => setToggleMenu((prev) => false)}
                        key={index}
                        to={item.link}
                        className="hover:text-accent"
                      >
                        {item.title}
                      </NavLink>
                    )
                )}
                {/* <Button text="Logout" cb={logout} /> */}
                {token && <button onClick={logout}>Logout</button>}
              </div>
            </div>
            {/* secondary */}
            <div className="flex gap-6">
              {/* Mobile navigation toggle */}
              <div className="lg:hidden flex items-center">
                <button onClick={() => setToggleMenu(!toggleMenu)}>
                  <RiMenu3Line size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* mobile navigation */}
        <div
          className={`fixed z-40 w-full bg-white overflow-hidden flex flex-col lg:hidden gap-12  origin-top duration-700 ${
            !toggleMenu ? "h-0" : "h-full"
          }`}
        >
          <div className="px-8">
            <div className="flex flex-col gap-8 tracking-wider">
              {navData?.map(
                (item, index) =>
                  item.show && (
                    <NavLink
                      onClick={() => setToggleMenu((prev) => false)}
                      key={index}
                      to={item.link}
                      className="hover:text-accent"
                    >
                      {item.title}
                    </NavLink>
                  )
              )}
              {token && <button onClick={logout}>Logout</button>}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;

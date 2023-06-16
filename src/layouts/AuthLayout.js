import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import BackBtn from "../components/BackBtn";
import Brand from "../components/Brand";
import Splash from "../assets/images/pattern1.jpg";

function AuthLayout() {
  const { pathname } = useLocation();
  const token = localStorage.getItem("token");
  const button = {
    text: pathname.includes("login") ? "Sign Up" : "Login",
    link: pathname.includes("login") ? "/auth/signup" : "/auth/login",
  };
  const pageTitle = pathname.includes("login")
    ? "Sign in"
    : "Create an account";
  return (
    <div className="p-4 min-h-screen grid md:grid-cols-2 text-black">
      <div>
        {!token && <BackBtn to={"/"} />}
        <div className="flex flex-col items-center md:items-start md:h-full justify-center p-8 md:p-16 gap-4">
          <Brand size={"w-16 md:hidden"} />
          <h2 className="text-3xl font-bold">{pageTitle}</h2>
          <Outlet />
          {!token && (
            <p>
              {pageTitle === "Sign in" ? (
                <>
                  New to SpotLight? Create an account{" "}
                  <Link className="underline text-primary" to={button?.link}>
                    here
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link className="text-primary underline" to={button.link}>
                    Login
                  </Link>
                </>
              )}
            </p>
          )}
        </div>
      </div>
      <div
        className="rounded-[18px] hidden md:block relative p-4 bg-red-700"
        style={{
          backgroundImage: `url(${Splash})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "hue-rotate(125deg)",
        }}
      >
        {!token && (
          <Link
            to={button.link}
            className="absolute bg-black text-white p-4 py-2 rounded-[18px] top-4 right-4"
          >
            {button.text}
          </Link>
        )}
        <img alt="blank" src={""} />
      </div>
    </div>
  );
}

export default AuthLayout;

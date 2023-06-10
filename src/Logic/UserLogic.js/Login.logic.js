import { useState } from "react";

import client from "../../appwrite.config";
import { Account } from "appwrite";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function LoginLogic() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validateMessage, setValidateMessage] = useState(null);
  const [signingin, setSigningin] = useState(false);

  const navigate = useNavigate();

  const inputs = [
    {
      label: "Email",
      placeholder: "example@email.com",
      value: email,
      cb: setEmail,
      type: "email",
    },
    {
      label: "Password",
      placeholder: "Please pick a strong password",
      value: password,
      cb: setPassword,
      inputMode: "text",
      keyboard: "default",
      type: !showPass ? "password" : "text",
      rightIcon: (
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowPass((prev) => !prev);
          }}
        >
          {showPass ? (
            <AiOutlineEye size={24} />
          ) : (
            <AiOutlineEyeInvisible size={24} />
          )}
        </button>
      ),
    },
  ];

  const loginUser = async (e) => {
    e.preventDefault();
    setSigningin((prev) => true);
    setValidateMessage((prev) => null);
    console.log("Signing you up", email, password);

    const account = new Account(client);

    try {
      const loggedInResponse = await account.createEmailSession(
        email,
        password
      );
      console.log(loggedInResponse);
      localStorage.setItem("token", JSON.stringify(loggedInResponse));
      toast.success("Logged in successfully");
      const accountDetails = await account.get();
      console.log(accountDetails);
      if (accountDetails.phoneVerification)
        navigate("/dashboard", { replace: true });
      else if (
        accountDetails.phone.length === 0 ||
        accountDetails.phone === null ||
        accountDetails.phone === undefined
      )
        navigate("/auth/phone", {
          replace: true,
          state: { ...loggedInResponse, email, password },
        });
      else {
        const sendOTPResponse = await account.createPhoneVerification();
        console.log(sendOTPResponse);
        toast.success("OTP sent to your phone.");
        navigate("/splash/otp", {
          state: {
            ...sendOTPResponse,
            email,
            password,
            phone: accountDetails.phone,
          },
          replace: true,
        });
      }
    } catch (error) {
      console.log(error, error.message);
      setValidateMessage((prev) => error.message);
      toast.error(error.message);
    } finally {
      setSigningin((prev) => false);
    }
  };

  return {
    inputs,
    validateMessage,
    signingin,
    setSigningin,
    setValidateMessage,
    showPass,
    setShowPass,
    email,
    setEmail,
    password,
    setPassword,
    loginUser,
  };
}

export default LoginLogic;

import { useEffect, useState } from "react";

import { Client, Account, ID, Locale } from "appwrite";
import client from "../../appwrite.config.js";
import { toast } from "react-hot-toast";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

function PhoneLogic() {
  const [phone, setPhone] = useState("");
  const [validateMessage, setValidateMessage] = useState(null);
  const [signingin, setSigningin] = useState(false);
  const [phoneCode, setPhoneCode] = useState(null);

  const { state } = useLocation();
  console.log('====================================');
  console.log(state);
  console.log('====================================');
  const navigate = useNavigate();

  const { email, password, countryCode } = state;
  console.log("Router >>>>>> ", email, password, countryCode);

  

  useEffect(() => {
    const getPhoneCode = async () => {
      const locale = new Locale(client);
      try {
        const localesResponse = await locale.listCountriesPhones();
        setPhoneCode(
          (prev) =>
            localesResponse?.phones?.filter(
              (country) =>
                country.countryCode.toLowerCase() === countryCode.toLowerCase()
            )[0]?.code
        );
      } catch (error) {
        console.log(error);
      }
    };
    if (countryCode && countryCode.length > 0) getPhoneCode();
  }, [countryCode]);

  console.log("Phone Code >>>>> ", phoneCode);

  const inputs = [
    {
      label: "Phone Number",
      placeholder: "1234567890",
      value: phone,
      cb: setPhone,
      type: "number",
      required: true,
    },
  ];

  const updatePhoneNumber = async (e) => {
    e.preventDefault();
    setSigningin((prev) => true);
    setValidateMessage((prev) => null);
    console.log("Phone ", phone);

    const account = new Account(client);

    try {
      const phoneUpdateResponse = await account.updatePhone(
        `${phoneCode}${phone}`,
        password
      );
      console.log(phoneUpdateResponse);
      const sendOTPResponse = await account.createPhoneVerification();
      console.log(sendOTPResponse);
      toast.success("Phone number updated successfully. Please Check for OTP.");
      navigate("/auth/otp", {
        replace: true,
        state: {
          ...sendOTPResponse,
          email,
          password,
          phone: `${phoneCode}${phone}`,
        },
      });
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
    updatePhoneNumber,
    phoneCode,
  };
}

export default PhoneLogic;

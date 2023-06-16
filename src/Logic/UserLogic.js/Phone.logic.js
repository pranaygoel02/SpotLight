import { useEffect, useState } from "react"
import { Account, Locale } from "appwrite";
import client from "../../appwrite.config.js";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

function PhoneLogic() {
  const [phone, setPhone] = useState("");
  const [validateMessage, setValidateMessage] = useState(null);
  const [signingin, setSigningin] = useState(false);
  const [phoneCode, setPhoneCode] = useState(null);

  const { state } = useLocation();
  
  
  
  const navigate = useNavigate();

  const { email, password, countryCode } = state;
  

  

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
        
      }
    };
    if (countryCode && countryCode.length > 0) getPhoneCode();
  }, [countryCode]);

  

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
    e?.preventDefault();
    setSigningin((prev) => true);
    setValidateMessage((prev) => null);
    

    const account = new Account(client);

    try {
      const phoneUpdateResponse = await account.updatePhone(
        `${phoneCode}${phone}`,
        password
      );
      
      const sendOTPResponse = await account.createPhoneVerification();
      
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

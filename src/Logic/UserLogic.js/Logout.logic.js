import { Client, Account } from "appwrite";
import client from "../../appwrite.config.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";


function LogoutLogic() {

    const navigate = useNavigate();

    const logout = async (e) => {
    e.preventDefault();

    const account = new Account(client);

    try {
      const logoutResponse = await account.deleteSessions();
      console.log(logoutResponse);
      localStorage.removeItem("token");
      localStorage.removeItem("spotlight-user");
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return { logout };
}

export default LogoutLogic;

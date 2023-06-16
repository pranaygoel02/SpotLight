import { Account } from "appwrite";
import client from "../../appwrite.config.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";


function LogoutLogic() {

    const navigate = useNavigate();

    const logout = async (e) => {
    e?.preventDefault();

    const account = new Account(client);

    try {
      await account.deleteSessions();
      
      localStorage.removeItem("token");
      localStorage.removeItem("spotlight-user");
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      
      toast.error(error.message);
    }
  };
  return { logout };
}

export default LogoutLogic;

import {useContext, useEffect} from "react";
import {AuthContext} from "../auth/authcontext.tsx";
import {useNavigate} from "react-router-dom";


export default function LogoutPage() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    logout();
    navigate("/")
  }, []);

  return null;
}

import {useContext} from "react";
import {AuthContext} from "../../auth/authcontext";
import {Outlet} from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout.tsx";


export default function Dashboard() {
  const { user } = useContext(AuthContext);
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

import { Navigate, Outlet } from "react-router-dom"
import {isAuthenticated} from "../utils/auth" 


function PrivateRoute({ allowedRoute }) {
  const authAdmin = isAuthenticated();
  if (!authAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}

export default PrivateRoute

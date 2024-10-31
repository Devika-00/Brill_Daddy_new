import { FC } from "react";
import { useAppSelector } from "../Redux/Store";
import { Navigate, Outlet } from "react-router-dom";


const PublicRouteUser = () => {
    const { isAuthenticated } = useAppSelector((state) => state.UserSlice );
    if (isAuthenticated) {
      return isAuthenticated ? <Navigate to={"/"} replace /> : <Outlet />;
    }
    return <Outlet/>
  }

  export default PublicRouteUser;  
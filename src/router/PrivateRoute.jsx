import { Navigate, Outlet } from "react-router-dom";
import { checkUserLogin } from "../api/authApi";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";

export default function PrivateRoute() {
  const { data, isLoading } = useQuery({
    queryKey: ['authCheck'],
    queryFn: checkUserLogin,
    retry: false
  })

  if(isLoading) {
    return <Loading />
  }

  return data?.data.success ? <Outlet/> : <Navigate to="/login" replace />
}
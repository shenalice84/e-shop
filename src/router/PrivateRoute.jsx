import { Navigate, Outlet } from "react-router-dom";
import { checkUserLogin } from "../api/authApi";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";

export default function PrivateRoute() {
  const { data, isLoading } = useQuery({
    queryKey: ["authCheck"],
    queryFn: checkUserLogin,
    retry: false,
  });

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(255,255,255,0.3)",
          zIndex: 999,
        }}
      >
        <Loading />
      </div>
    );
  }

  return data?.data.success ? <Outlet /> : <Navigate to="/login" replace />;
}

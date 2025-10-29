import { Outlet } from "react-router-dom";
import Toast from "../components/Toast";
import Header from "../components/common/header";
import Footer from "../components/common/footer";

export function FrontLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <Toast></Toast>
    </>
  );
}

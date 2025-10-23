import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Toast from "../components/Toast";
const routes = [
  { path: "/", name: "首頁" },
  { path: "/products", name: "產品列表" },
  { path: "/cart", name: "購物車" },
];

export function FrontLayout() {
  return (
    <>
      <nav
        className="navbar bg-dark border-bottom border-body"
        data-bs-theme="dark"
      >
        <div className="container">
          <ul className="navbar-nav flex-row gap-5 fs-5">
            {routes.map((route) => {
              return (
                <li className="nav-item" key={route.name}>
                  <NavLink className="nav-link" to={route.path}>
                    {route.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
      <Outlet />
      <Toast></Toast>
    </>
  );
}

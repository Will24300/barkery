import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../../context/HookContext";

export default function Sidebar({
  activeSection,
  setActiveSection,
  isOpen,
  closeSidebar,
}) {
  const navigate = useNavigate();
  const { logout } = useUser();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") || "overview";
      setActiveSection(hash);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <aside
      className={`fixed top-0 left-0 z-40  h-[calc(100vh)] w-64 p-4 bg-white shadow-lg shadow-amber-800 transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0 md:relative md:block`}
    >
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <nav>
        <ul className="space-y-2">
          <li className="py-2 pl-4 bg-gradient-to-r from-yellow-700 via-orange-900 to-yellow-700 bg-[length:200%_100%] bg-left animate-[gradient-x_5s_ease-in-out_infinite] rounded cursor-pointer text-white">
            <NavLink
              to="/admin/dashboard#overview"
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? "font-semibold" : "text-white"
              }
            >
              Overview
            </NavLink>
          </li>
          <li className="py-2 pl-4">
            <NavLink
              to="/admin/dashboard#products"
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? "text-yellow-800 font-semibold" : ""
              }
            >
              Products
            </NavLink>
          </li>
          <li className="py-2 pl-4">
            <NavLink
              to="/admin/dashboard#orders"
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? "text-yellow-800 font-semibold" : ""
              }
            >
              Orders
            </NavLink>
          </li>
          <li className="py-2 pl-4">
            <NavLink
              to="/admin/dashboard#users"
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? "text-yellow-800 font-semibold" : ""
              }
            >
              Users
            </NavLink>
          </li>
          <li className="pl-4 mt-4">
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="hover:text-yellow-300 cursor-pointer"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

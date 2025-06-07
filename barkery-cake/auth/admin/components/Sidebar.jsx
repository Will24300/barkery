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

    const handleNavClick = (section) => {
      setActiveSection(section);
      window.location.hash = section;
      closeSidebar();
    };

  return (
    <aside
      className={`fixed top-0 left-0 z-40  h-[calc(100vh)] w-64 p-4 bg-white shadow-lg shadow-amber-800 transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0 md:relative md:block`}
    >
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <nav>
        <ul className="space-y-2">
          <li className={`py-2 pl-4 cursor-pointer bg-gradient-to-r ${activeSection === "mainboard" ? "from-yellow-700 via-orange-900 to-yellow-700 bg-[length:200%_100%] bg-left animate-[gradient-x_5s_ease-in-out_infinite] rounded cursor-pointer text-white" : "bg-white text-black"}`}>
            <button
              onClick={() => handleNavClick("mainboard")}
              className={`w-full text-left cursor-pointer ${
                activeSection === "mainboard"
                  ? "text-white font-semibold"
                  : ""
              }`}
            >
              Mainboard
            </button>
          </li>

          <li className={`py-2 pl-4 cursor-pointer ${activeSection === "categories" ? "bg-gradient-to-r from-yellow-700 via-orange-900 to-yellow-700 bg-[length:200%_100%] bg-left animate-[gradient-x_5s_ease-in-out_infinite] rounded cursor-pointer text-white" : "bg-white text-black"}`}>
            <button
              onClick={() => handleNavClick("categories")}
              className={`w-full text-left cursor-pointer ${
                activeSection === "categories"
                  ? "text-white font-semibold"
                  : ""
              }`}
            >
              Categories
            </button>
          </li>
          <li className={`py-2 pl-4 cursor-pointer ${activeSection === "products" ? "bg-gradient-to-r from-yellow-700 via-orange-900 to-yellow-700 bg-[length:200%_100%] bg-left animate-[gradient-x_5s_ease-in-out_infinite] rounded cursor-pointer text-white" : "bg-white text-black"}`}>
            <button
              onClick={() => handleNavClick("products")}
              className={`w-full text-left cursor-pointer ${
                activeSection === "products"
                  ? "text-white font-semibold"
                  : ""
              }`}
            >
              Products
            </button>
          </li>
          <li className={`py-2 pl-4 cursor-pointer ${activeSection === "orders" ? "bg-gradient-to-r from-yellow-700 via-orange-900 to-yellow-700 bg-[length:200%_100%] bg-left animate-[gradient-x_5s_ease-in-out_infinite] rounded cursor-pointer text-white" : "bg-white text-black"}`}>
            <button
              onClick={() => handleNavClick("orders")}
              className={`w-full text-left cursor-pointer ${
                activeSection === "orders"
                  ? "text-white font-semibold"
                  : ""
              }`}
            >
              Orders
            </button>
          </li>
          <li className={`py-2 pl-4 cursor-pointer ${activeSection === "users" ? "bg-gradient-to-r from-yellow-700 via-orange-900 to-yellow-700 bg-[length:200%_100%] bg-left animate-[gradient-x_5s_ease-in-out_infinite] rounded cursor-pointer text-white" : "bg-white text-black"}`}>
            <button
              onClick={() => handleNavClick("users")}
              className={`w-full text-left cursor-pointer ${
                activeSection === "users" ? "text-white font-semibold" : ""
              }`}
            >
              Users
            </button>
          </li>
          <li className={`pl-4 mt-4 cursor-pointer ${activeSection === "logout" ? "bg-gradient-to-r from-yellow-700 via-orange-900 to-yellow-700 bg-[length:200%_100%] bg-left animate-[gradient-x_5s_ease-in-out_infinite] rounded cursor-pointer text-white" : "bg-white text-black"}`}>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="hover:text-yellow-300 cursor-pointer "
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

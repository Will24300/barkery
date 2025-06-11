import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/HookContext";

const Sidebar = ({
  activeSection,
  setActiveSection,
  isOpen,
  closeSidebar,
  userRole = "admin", // Default to admin for backward compatibility
}) => {
  const navigate = useNavigate();
  const { logout } = useUser();

  const handleNavClick = (section) => {
    setActiveSection(section);
    window.location.hash = section;
    closeSidebar();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      id: "orders",
      label: "Orders",
      roles: ["admin", "delivery"],
      icon: (
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
  ];

  // Admin-only items
  if (userRole === "admin") {
    navItems.unshift(
      {
        id: "mainboard",
        label: "Mainboard",
        roles: ["admin"],
        icon: (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        ),
      },
      {
        id: "categories",
        label: "Categories",
        roles: ["admin"],
        icon: (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
        ),
      },
      {
        id: "products",
        label: "Products",
        roles: ["admin"],
        icon: (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        ),
      },
      {
        id: "users",
        label: "Users",
        roles: ["admin"],
        icon: (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ),
      }
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 p-4 bg-white shadow-lg shadow-amber-800 transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        md:relative md:flex-shrink-0`}
      >
        <h2 className="text-2xl font-bold mb-6">
          {userRole === "admin" ? "Admin" : "Delivery"} Dashboard
        </h2>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li
                key={item.id}
                className={`py-2 pl-4 cursor-pointer ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-yellow-700 via-orange-900 to-yellow-700 bg-[length:200%_100%] bg-left animate-[gradient-x_5s_ease-in-out_infinite] rounded text-white"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                <button
                  onClick={() => handleNavClick(item.id)}
                  className="w-full text-left flex items-center"
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
            <li className="border-t border-gray-200 my-2"></li>
            <li
              className={`py-2 pl-4 cursor-pointer ${
                activeSection === "logout"
                  ? "bg-gradient-to-r from-yellow-700 via-orange-900 to-yellow-700 bg-[length:200%_100%] bg-left animate-[gradient-x_5s_ease-in-out_infinite] rounded text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center text-red-600 hover:text-red-800"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

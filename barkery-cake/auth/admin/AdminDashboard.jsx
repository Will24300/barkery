import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../context/HookContext";

const AdminDashboard = () => {
  const { userDetails, logout } = useUser();
  const [activeSection, setActiveSection] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") || "overview";
      setActiveSection(hash);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "products":
        return <div>Products Management</div>;
      case "orders":
        return <div>Orders Management</div>;
      case "users":
        return <div>Users Management</div>;
      case "overview":
      default:
        return <div>Admin Overview</div>;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <nav>
          <ul>
            <li>
              <NavLink
                to="/admin/dashboard#overview"
                className={({ isActive }) =>
                  isActive ? "text-yellow-300" : "hover:text-yellow-300"
                }
              >
                Overview
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dashboard#products"
                className={({ isActive }) =>
                  isActive ? "text-yellow-300" : "hover:text-yellow-300"
                }
              >
                Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dashboard#orders"
                className={({ isActive }) =>
                  isActive ? "text-yellow-300" : "hover:text-yellow-300"
                }
              >
                Orders
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dashboard#users"
                className={({ isActive }) =>
                  isActive ? "text-yellow-300" : "hover:text-yellow-300"
                }
              >
                Users
              </NavLink>
            </li>
            <li>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="text-white hover:text-yellow-300 mt-4"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1>
          Welcome, {userDetails?.email} (Role: {userDetails?.role})
        </h1>
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminDashboard;

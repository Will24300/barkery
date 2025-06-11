import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/HookContext";
import Sidebar from "../shared/components/Sidebar";
import OrdersTab from "../admin/components/OrdersTab";

const DeliveryDashboard = () => {
  const [activeSection, setActiveSection] = useState("orders");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userDetails, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Set initial active section from URL hash if present
    const hash = window.location.hash.substring(1);
    if (hash) {
      setActiveSection(hash);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "orders":
        return <OrdersTab />;
      default:
        return <OrdersTab />;
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        closeSidebar={closeSidebar}
        userRole="delivery"
      />

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Top bar */}
        <header className="bg-white shadow-sm z-10 sticky top-0">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={toggleSidebar}
              className="md:hidden text-gray-600 hover:text-gray-900"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {userDetails?.email} (Delivery)
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="bg-[#933C24] text-white py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6">{renderSection()}</main>
      </div>
    </div>
  );
};

export default DeliveryDashboard;

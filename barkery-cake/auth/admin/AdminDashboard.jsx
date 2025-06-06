import React, { useState , useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { useUser } from "../../context/HookContext";
import AdminMainBoard from "./components/Mainboard";
import ProductsTab from "./components/ProductsTab";
import OrdersTab from "./components/OrdersTab";
import UsersTab from "./components/UsersTab";
import NotAuthorized from "../NotAuthorized";

const AdminDashboard = () => {
  const { userDetails } = useUser();
  const [activeSection, setActiveSection] = useState("mainboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle initial hash on component mount
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setActiveSection(hash);
    }
  }, []);

   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
   const closeSidebar = () => setSidebarOpen(false);

   const renderSection = () => {
     switch (activeSection) {
       case "products":
         return <ProductsTab />;
       case "orders":
         return <OrdersTab />;
       case "users":
         return <UsersTab />;
       case "mainboard":
       default:
         return <AdminMainBoard />;
     }
   };

  return (
    <div className="flex min-h-screen relative overflow-hidden ">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden "
          onClick={toggleSidebar}
        />
      )}

      {/* Burger Icon */}
      <button
        onClick={toggleSidebar}
        className="absolute top-0 left-5 z-40 md:hidden bg-white cursor-pointer"
      >
        {sidebarOpen ? (
          <svg
            data-slot="icon"
            className="h-8 w-8 text-yellow-900 font-semibold "
            fill="none"
            stroke-width="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            ></path>
          </svg>
        ) : (
          <svg
            className="h-8 w-8 text-yellow-900"
            data-slot="icon"
            fill="none"
            stroke-width="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            ></path>
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        setActiveSection={setActiveSection}
        activeSection={activeSection}
        closeSidebar={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out p-6 ${
          sidebarOpen ? "md:ml-64" : ""
        }`}
      >
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminDashboard;

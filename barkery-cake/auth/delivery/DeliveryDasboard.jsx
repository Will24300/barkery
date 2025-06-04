import React from "react";
import { useUser } from "../../context/HookContext";
import { useNavigate } from "react-router-dom";

const DeliveryDashboard = () => {
  const { userDetails, logout } = useUser();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1>Delivery Dashboard</h1>
      <p>
        Welcome, {userDetails?.email} (Role: {userDetails?.role})
      </p>
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="bg-[#933C24] text-white py-2 px-4 rounded mt-4"
      >
        Logout
      </button>
    </div>
  );
};

export default DeliveryDashboard;

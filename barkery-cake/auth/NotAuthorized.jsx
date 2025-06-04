import React from "react";
import { NavLink } from "react-router-dom";

const NotAuthorized = () => {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">Not Authorized</h1>
      <p>You do not have permission to access this page.</p>
      <NavLink to="/login" className="text-blue-500 underline">
        Go to Login
      </NavLink>
    </div>
  );
};

export default NotAuthorized;

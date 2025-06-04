import React from "react";
import { NavLink } from "react-router-dom";

const NotAuthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="px-6 py-8">
          <div className="text-center">
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
              Not Authorized
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You do not have permission to access this page.
            </p>
          </div>
          <div className="mt-6 text-center">
            <NavLink
              to="/login"
              className="inline-block px-6 py-2 text-sm font-medium leading-6 text-white transition duration-150 ease-in-out bg-yellow-900 border border-transparent rounded-md hover:bg-yellow-800 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700"
            >
              Go to Login
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;

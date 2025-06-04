import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phonenumber: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/register", formData);
      toast.success(response.data.message || "Registration successful!");
      navigate("/login");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "An error occurred during registration.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="border-white bg-gradient-to-r from-[#933C24] via-[#845a4e] to-[#933C24]">
      <div className="h-screen grid justify-center items-center relative">
        <div className="absolute top-7 left-2 text-white font-semibold">
          Or Go back to {"<-"}{" "}
          <NavLink to="/" className="text-yellow-300 font-semibold">
            Home page
          </NavLink>
        </div>
        <div className="mt-8 px-2">
          <form
            onSubmit={handleSubmit}
            className="shadow-md w-pixel-basic-width2 rounded pb-2 bg-white"
          >
            <div className="px-2">
              <div className="py-3 text-center">
                <h1 className="text-xl text-[#933C24] font-semibold">
                  Sign up
                </h1>
              </div>
              {/* ... rest of your form inputs ... */}
              <div className="px-2 mb-1 col-span-2">
                <button
                  className="text-white rounded w-full duration-300 px-2 py-2 mt-6 border-white bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 hover:white hover:scale-105 cursor-pointer"
                  type="submit"
                >
                  Sign up
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

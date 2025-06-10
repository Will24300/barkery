import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useUser } from "../../context/HookContext";
import axios from "axios";

const Login = () => {
  const [errorLogin, setErrorLogin] = useState("");
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const { setAuth, setUserDetails } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/auth/login", values);

      if (response.status === 200) {
        const { message, user, token } = response.data;
        console.log("Login response:", response.data);

        // Store token in localStorage
        localStorage.setItem("authToken", token);

        // Update context with the complete user object from the response
        setAuth(true);
        setUserDetails(user);

        Swal.fire({
          title: "Success!",
          text: message,
          icon: "success",
        });

        // Navigate based on role
        switch (user.role.toLowerCase()) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "customer":
            navigate("/");
            break;
          case "delivery":
            navigate("/delivery/dashboard");
            break;
          default:
            navigate("/not-authorized");
        }
      } else {
        setErrorLogin("Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorLogin(
        err.response?.data?.Error || "An error occurred during login"
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-yellow-700 via-orange-900 to-yellow-700 bg-[length:200%_100%] bg-left animate-[gradient-x_5s_ease-in-out_infinite]">
      <div className="h-screen grid justify-center items-center relative">
        <div className="absolute top-7 left-2 text-white font-semibold">
          Or Go back to {"<-"}{" "}
          <NavLink to="/" className="text-yellow-300 font-semibold">
            Home page
          </NavLink>
        </div>
        <div className="mt-8 px-2 flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="shadow-md w-pixel-basic-width2 rounded pb-2 bg-white"
          >
            <div className="px-2">
              <div className="py-3 text-center">
                <h1 className="text-xl font-medium">Login</h1>
                {errorLogin && (
                  <div className="bg-red-200 w-frame-width rounded m-auto">
                    <h1>{errorLogin}</h1>
                  </div>
                )}
              </div>
              <div className="px-2 mb-2">
                <input
                  type="email"
                  placeholder="Email..."
                  onChange={(e) =>
                    setValues({ ...values, email: e.target.value })
                  }
                  className="w-full border-[1px] border-gray-400 focus:border-[#933C24] focus:outline-none h-10 px-3 rounded-sm"
                />
              </div>
              <div className="px-2 mb-2">
                <input
                  type="password"
                  placeholder="Password..."
                  onChange={(e) =>
                    setValues({ ...values, password: e.target.value })
                  }
                  className="w-full border-[1px] border-gray-400 focus:border-[#933C24] focus:outline-none h-10 px-3 rounded-sm"
                />
              </div>
              <div className="px-2 mb-1">
                <button
                  className="text-white rounded w-full duration-300 px-2 py-2 mt-6 border-white bg-gradient-to-r bg-[#933C24] cursor-pointer hover:scale-105"
                  type="submit"
                >
                  Sign in
                </button>
              </div>
              <div className="py-2 text-center md:text-left md:grid grid-cols-2 px-4">
                <span>
                  <NavLink to="/forgot-password">Forgot password?</NavLink>
                </span>
                <span>
                  Not yet registered?{" "}
                  <NavLink className="text-blue-500" to="/signup">
                    Signup
                  </NavLink>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

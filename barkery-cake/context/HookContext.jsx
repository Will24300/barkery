import React, { useState, useEffect, createContext } from "react";
import axios from "axios";

const UserContext = createContext();

const HookContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/users"); // Adjust API route if needed

        if (response.data.results) {
          setAuth(true);
          setUserDetails(response.data.results);
        } else {
          setAuth(false);
        }
      } catch (error) {
        setAuth(false);
        setMessage("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const contextData = {
    auth,
    setAuth,
    userDetails,
    setUserDetails,
    message,
    setMessage,
    loading,
    setLoading,
  };

  return (
    <UserContext.Provider value={contextData}>{children}</UserContext.Provider>
  );
};

export { HookContextProvider, UserContext };

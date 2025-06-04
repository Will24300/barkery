import React, { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UserContext = createContext();

const HookContextProvider = ({ children }) => {
  // Auth state
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cart state (unchanged)
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("barkeryCart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("barkeryCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Auth functions
  const verifyToken = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setAuth(false);
      setUserDetails(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      // Verify token with backend
      const response = await axios.get("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true, // Send cookies for verifyUser middleware
      });

      if (response.data.valid) {
        setAuth(true);
        setUserDetails({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        });
      } else {
        localStorage.removeItem("authToken");
        setAuth(false);
        setUserDetails(null);
      }
    } catch (error) {
      console.error("Token verification error:", error);
      localStorage.removeItem("authToken");
      setAuth(false);
      setUserDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("authToken");
      setAuth(false);
      setUserDetails(null);
      setMessage("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      setMessage("Failed to logout");
    }
  };

  const checkPermission = (allowedRoles) => {
    return userDetails && allowedRoles.includes(userDetails.role.toLowerCase());
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const contextData = {
    // Auth
    auth,
    setAuth,
    userDetails,
    setUserDetails,
    message,
    setMessage,
    loading,
    setLoading,
    logout,
    checkPermission,

    // Cart (unchanged)
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
  };

  return (
    <UserContext.Provider value={contextData}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { HookContextProvider, UserContext };

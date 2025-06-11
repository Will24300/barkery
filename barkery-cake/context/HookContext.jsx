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

  // Data state
  const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, fetch essential data that we know exists
        const [categoriesRes, productsRes] = await Promise.all([
          axios
            .get("/api/categories")
            .catch(() => ({ data: { categories: [] } })),
          axios.get("/api/products").catch(() => ({ data: { products: [] } })),
        ]);

        // Set the essential data
        setCategories(categoriesRes?.data?.categories || []);
        setProducts(productsRes?.data?.products || []);

        // Set loading to false for the main app since we have the essential data
        setLoading(false);

        // Then try to fetch user-specific data if authenticated
        if (auth) {
          try {
            const [ordersRes, usersRes] = await Promise.all([
              axios
                .get("/api/orders/all", {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "authToken"
                    )}`,
                  },
                  withCredentials: true,
                })
                .catch(() => ({ data: { orders: [] } })),

              axios
                .get("/api/users/all", {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "authToken"
                    )}`,
                  },
                  withCredentials: true,
                })
                .catch(() => ({ data: { users: [] } })),
            ]);

            setOrders(ordersRes?.data?.orders || []);
            setUsers(usersRes?.data?.users || []);
          } catch (error) {
            console.error("Error fetching user data:", error);
            setOrders([]);
            setUsers([]);
          }
        }
      } catch (error) {
        console.error("Error fetching essential data:", error);
        setCategories([]);
        setProducts([]);
        setLoading(false);
      }
    };

    fetchData();
  }, [auth]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("barkeryCart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        localStorage.removeItem("barkeryCart");
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("barkeryCart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === (item.product_id || item.id)
      );

      if (existingItem) {
        const updatedItems = prevItems.map((cartItem) =>
          cartItem.id === (item.product_id || item.id)
            ? {
                ...cartItem,
                quantity: cartItem.quantity + (item.quantity || 1),
              }
            : cartItem
        );
        return updatedItems;
      }

      return [
        ...prevItems,
        {
          id: item.product_id || item.id, // Prefer product_id, fallback to id
          name: item.name,
          price: parseFloat(item.price),
          image: item.image_url || item.image,
          quantity: item.quantity || 1,
        },
      ];
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
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.data.valid && response.data.user) {
        setAuth(true);
        setUserDetails({
          id: response.data.user.id,
          email: response.data.user.email,
          role: response.data.user.role?.toLowerCase(),
          firstName: response.data.user.firstName || "",
          lastName: response.data.user.lastName || "",
          phone: response.data.user.phone || "",
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
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    categories,
    setCategories,
    products,
    setProducts,
    orders,
    setOrders,
    users,
    setUsers,
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

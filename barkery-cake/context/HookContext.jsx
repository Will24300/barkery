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
        const [categoriesRes, productsRes, ordersRes, usersRes] =
          await Promise.all([
            axios.get("/api/categories"),
            axios.get("/api/products"),
            axios.get("/api/orders", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              withCredentials: true,
            }),
            axios.get("/api/users", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              withCredentials: true,
            }),
          ]);
        setCategories(categoriesRes.data.categories);
        setProducts(productsRes.data.products);
        setOrders(ordersRes.data.orders);
        setUsers(usersRes.data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("barkeryCart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      const validCartItems = parsedCart.filter((item) =>
        products.some((p) => p.product_id === item.id)
      );
      setCartItems(validCartItems);
      localStorage.setItem("barkeryCart", JSON.stringify(validCartItems));
    }
  }, [products]);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("barkeryCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    const product = products.find((p) => p.product_id === item.id);
    if (!product) {
      console.error(`Product with ID ${item.id} not found`);
      return;
    }
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [
        ...prevItems,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
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
      setAuth(false);
      setUserDetails(null);
      setLoading(false);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const response = await axios.get("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      if (response.data.valid) {
        setAuth(true);
        setUserDetails({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role.toLowerCase(),
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          phone: decoded.phone,
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

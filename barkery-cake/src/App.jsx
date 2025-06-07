import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import AdminDashboard from "../auth/admin/AdminDashboard";
import DeliveryDashboard from "../auth/delivery/DeliveryDasboard";
import NotAuthorized from "../auth/NotAuthorized";
import { HookContextProvider, useUser } from "../context/HookContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import OrderConfirmation from "./pages/OrderConfirmation";
import Checkout from "./pages/Checkout";

const ProtectedRoute = ({ allowedRoles }) => {
  const { userDetails, loading, checkPermission } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userDetails || !checkPermission(allowedRoles)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
};

const App = () => {
  return (
    <HookContextProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/forgot-password"
            element={<div>Forgot Password Page</div>}
          />
          <Route path="/not-authorized" element={<NotAuthorized />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["delivery"]} />}>
            <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/not-authorized" replace />} />
        </Routes>
      </Router>
    </HookContextProvider>
  );
};

export default App;

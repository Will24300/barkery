import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const orderId = state?.orderId || "N/A";

  const handleContinueShopping = () => {
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
      <p className="text-lg mb-4">
        Your order (ID: {orderId}) has been successfully placed.
      </p>
      <p className="text-gray-600 mb-6">
        A confirmation email has been sent to your provided email address.
      </p>
      <button
        onClick={handleContinueShopping}
        className="bg-[#933C24] text-white px-6 py-2 rounded hover:bg-[#7a3120] transition-colors cursor-pointer"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderConfirmation;

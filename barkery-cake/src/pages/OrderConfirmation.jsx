import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const orderId = state?.orderId || "N/A";

  const handleContinueShopping = () => {
    navigate("/");
  };

    const scrollToServices = () => {
      navigate("/");
      setTimeout(() => {
        const servicesSection = document.getElementById("services");
        if (servicesSection) {
          const offset = 0;
          const sectionPosition =
            servicesSection.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: sectionPosition - offset,
            behavior: "smooth",
          });
        }
      }, 100);
    };
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="flex items-center justify-center">
        <svg
          className="w-12 h-12 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="text-3xl font-bold ml-4">Thank You for Your Order!</h1>
      </div>
      <p className="text-lg mb-4">
        Your order  has been successfully placed.
      </p>
      <p className="text-gray-600 mb-6">
        A confirmation email has been sent to your provided email address.
      </p>
      <button
        onClick={scrollToServices}
        className="bg-[#933C24] text-white px-6 py-2 rounded hover:bg-[#7a3120] transition-colors cursor-pointer"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderConfirmation;

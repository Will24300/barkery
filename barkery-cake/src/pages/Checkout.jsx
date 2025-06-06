import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/HookContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = () => {
  const { userDetails, cartItems, getCartTotal, setCartItems } = useUser();
  const navigate = useNavigate();

  // Initialize form state with userDetails if available
  const [formData, setFormData] = useState({
    name: userDetails?.name || "",
    email: userDetails?.email || "",
    phone: "",
    address: "",
    paymentMethod: "cod",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare order data
      const orderData = {
        user_id: userDetails?.id || null, // Use null if not logged in
        total_amount: getCartTotal(),
        status: "pending",
        delivery_address: formData.address,
        order_items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price_at_purchase: item.price,
          product_image_url: item.image,
        })),
      };

      // Simulate API call to save order
      // You'll need to replace this with your actual backend API endpoint
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userDetails && {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          }),
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        // Clear cart
        setCartItems([]);
        localStorage.setItem("barkeryCart", JSON.stringify([]));

        // Show success message
        toast.success("Order placed successfully! Confirmation email sent.");

        // Navigate to confirmation page
        navigate("/order-confirmation", {
          state: { orderId: result.order_id },
        });
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center mb-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div>
                <h3 className="text-sm font-semibold">{item.name}</h3>
                <p className="text-gray-600">
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${(getCartTotal() || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#933C24] focus:ring-[#933C24]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#933C24] focus:ring-[#933C24]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#933C24] focus:ring-[#933C24]"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#933C24] focus:ring-[#933C24]"
                  rows="4"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#933C24] focus:ring-[#933C24]"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Cash on Delivery
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="pickup"
                    checked={formData.paymentMethod === "pickup"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#933C24] focus:ring-[#933C24]"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Pickup in Store
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#933C24] text-white py-3 rounded-lg hover:bg-[#7a3120] transition-colors ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

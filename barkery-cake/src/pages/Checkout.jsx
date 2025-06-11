import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/HookContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Checkout = () => {
  const { userDetails, cartItems, getCartTotal, setCartItems, products } =
    useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: userDetails?.firstName || "",
    lastName: userDetails?.lastName || "",
    email: userDetails?.email || "",
    phone: userDetails?.phone || "",
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

    // Basic form validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Validate cart items
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      setIsSubmitting(false);
      return;
    }

    // Validate product IDs
    const invalidItems = cartItems.filter(
      (item) => !products.some((p) => p.id === item.id)
    );
    if (invalidItems.length > 0) {
      toast.error(
        `Invalid products in cart: ${invalidItems
          .map((item) => item.name)
          .join(", ")}`
      );
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare order data
      const orderData = {
        user_id: userDetails?.id || null,
        total_amount: getCartTotal(),
        status: "pending",
        delivery_address: formData.address,
        customer_email: formData.email,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        order_items: cartItems.map((item) => {
          const product = products.find((p) => p.id === item.id);
          return {
            product_id: item.id,
            quantity: item.quantity,
            price_at_purchase: item.price,
            product_image_url: product.image_url,
            product_name: item.name,
          };
        }),
      };

      console.log("Sending order data:", orderData);

      // API call
      const response = await axios.post(
        "http://localhost:8082/api/orders",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            ...(userDetails && {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }),
          },
          withCredentials: true,
        }
      );

      setCartItems([]);
      localStorage.setItem("barkeryCart", JSON.stringify([]));
      toast.success("Order placed successfully! Confirmation email sent.");
      navigate("/order-confirmation", {
        state: { orderId: response.data.order_id },
      });
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        error.response?.data?.Error ||
          "Failed to place order. Please try again."
      );
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
      <div className="flex items-center gap-4 py-2">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <span>
          <Link to="/cart" className="text-[#933C24] font-semibold">
            Back to Cart
          </Link>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center mb-4">
              <img
                src={`http://localhost:8082${item.image}`}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div>
                <h3 className="text-sm font-semibold">{item.name}</h3>
                <p className="text-gray-600">
                  ${(item.price || 0).toFixed(2)} x {item.quantity}
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

        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full border-[1px] border-gray-400 focus:border-[#933C24] focus:outline-none h-10 px-3 rounded-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full border-[1px] border-gray-400 focus:border-[#933C24] focus:outline-none h-10 px-3 rounded-sm"
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
                    className="w-full border-[1px] border-gray-400 focus:border-[#933C24] focus:outline-none h-10 px-3 rounded-sm"
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
                    className="w-full border-[1px] border-gray-400 focus:border-[#933C24] focus:outline-none h-10 px-3 rounded-sm"
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
                  className="w-full border-[1px] border-gray-400 focus:border-[#933C24] focus:outline-none px-3 rounded-sm"
                  rows="4"
                  required
                />
              </div>
            </div>

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

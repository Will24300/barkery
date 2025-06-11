import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/HookContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Checkout = () => {
  const {
    userDetails,
    cartItems,
    getCartTotal,
    setCartItems,
    products,
    loading,
  } = useUser();
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
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // Check if products are loaded
  useEffect(() => {
    if (products.length > 0) {
      setIsLoadingProducts(false);
      setProductsError(null);
    } else if (!loading) {
      // If products are not loaded but loading is complete, there was an error
      setProductsError(
        "Failed to load products. Please refresh the page or try again later."
      );
      setIsLoadingProducts(false);
    }
  }, [products, loading]);

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
    console.log("Validating cart items...");
    console.log("Cart items:", JSON.parse(JSON.stringify(cartItems)));
    console.log("Available products:", JSON.parse(JSON.stringify(products)));

    const invalidItems = [];

    // Check each cart item against the products list
    cartItems.forEach((item) => {
      const product = products.find((p) => {
        // Check both id and product_id for matching
        return p.product_id == item.id || p.id == item.id;
      });

      if (!product) {
        console.error("Product not found for item:", item);
        invalidItems.push(item);
      } else {
        console.log(`Found matching product for item ${item.id}:`, product);
      }
    });

    if (invalidItems.length > 0) {
      const errorMessage = `Invalid products in cart: ${invalidItems
        .map((item) => item.name)
        .join(", ")}`;
      console.error(errorMessage);
      toast.error(errorMessage);
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare order data with consistent product_id usage
      const orderData = {
        user_id: userDetails?.id || null,
        total_amount: getCartTotal(),
        status: "pending",
        delivery_address: formData.address,
        order_items: cartItems.map((item) => {
          // Find the full product to get the correct product_id
          const product = products.find(
            (p) => p.product_id == item.id || p.id == item.id
          );

          return {
            product_id: product ? product.product_id : item.id,
            quantity: item.quantity,
            price_at_purchase: parseFloat(item.price),
            product_image_url: product?.image_url || item.image,
            product_name: item.name,
          };
        }),
      };

      console.log("Submitting order data:", orderData);

      // Log the exact request being sent
      console.log("Sending request to:", "/api/orders");
      console.log("Request headers:", {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      });
      console.log("Request payload:", orderData);

      // API call
      const response = await axios.post("/api/orders", orderData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

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

  if (isLoadingProducts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#933C24] mx-auto"></div>
          <p className="mt-4 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <p className="text-red-600 font-medium">{productsError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#933C24] text-white rounded hover:bg-[#7a3120] transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

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

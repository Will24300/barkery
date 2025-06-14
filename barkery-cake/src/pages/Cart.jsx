import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/HookContext";
import { ToastContainer, toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart: removeFromCartFunc,
    updateQuantity,
    getCartTotal,
    userDetails,
  } = useUser();

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

  const checkPermission = () => {
    if (userDetails) {
      navigate("/checkout");
    } else {
      document.getElementById("my_modal_3").showModal();
    }
  };

  const removeFromCart = (itemId) => {
    const itemToRemove = cartItems.find(
      (item) => item.id === itemId || item.product_id === itemId
    );
    if (itemToRemove) {
      removeFromCartFunc(itemToRemove.id);
      toast.error("Item removed from cart!");
    }
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    const itemToUpdate = cartItems.find(
      (item) => item.id === itemId || item.product_id === itemId
    );
    if (itemToUpdate) {
      updateQuantity(itemToUpdate.id, newQuantity);
      if (newQuantity > itemToUpdate.quantity) {
        toast.success("Quantity increased!");
      } else {
        toast.warning("Quantity decreased!");
      }
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
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <span>
          <Link to="/" className="text-[#933C24] font-semibold">
            Back to Home
          </Link>
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl mb-4">Your cart is empty</h2>
          <button
            onClick={scrollToServices}
            className="bg-[#933C24] text-white px-6 py-2 rounded hover:bg-[#7a3120] transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center border-b border-gray-200 py-6"
              >
                <img
                  src={`http://localhost:8082${item.image}`}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1 px-4">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">
                    ${(item.price || 0).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center mt-4 md:mt-0">
                  <button
                    onClick={() =>
                      updateItemQuantity(
                        item.id,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                    className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                  >
                    <FaMinus className="text-sm" />
                  </button>
                  <span className="mx-4">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateItemQuantity(item.id, item.quantity + 1)
                    }
                    className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                  >
                    <FaPlus className="text-sm" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${(getCartTotal() || 0).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${(getCartTotal() || 0).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={checkPermission}
                className="block w-full bg-[#933C24] text-white py-3 rounded-lg hover:bg-[#7a3120] transition-colors cursor-pointer text-center"
              >
                Proceed to Checkout
              </button>
              <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>
                  <h3 className="font-bold text-lg">Login Required</h3>
                  <p className="py-4">Please log in to proceed to checkout.</p>
                  <div className="modal-action">
                    <form method="dialog" className="w-full">
                      <button
                        className="btn bg-[#933C24] text-white w-full cursor-pointer"
                        onClick={() => navigate("/login")}
                      >
                        Go to Login
                      </button>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

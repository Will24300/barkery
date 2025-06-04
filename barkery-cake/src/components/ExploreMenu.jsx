import { useContext, useState } from "react";
import { data } from "../data/data";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import bg2 from "../assets/bg2.png";
import { useUser } from "../../context/HookContext";
import { ToastContainer, toast } from "react-toastify";

export default function ExploreMenu() {
  const { addToCart, updateQuantity, removeFromCart, cartItems } = useUser();
  const [isActiveIndex, setIsActiveIndex] = useState(0);
  const [clickedItems, setClickedItems] = useState({});
  const [localQuantities, setLocalQuantities] = useState({});

  const items = ["Cake", "Muffins", "Croissant", "Bread", "Tart", "Favorite"];
  const categorie = data.categories[isActiveIndex].products;

  const handleToggle = (index) => {
    setIsActiveIndex(isActiveIndex === index ? 0 : index);
  };

  const handleAddClick = (itemId) => {
    setClickedItems((prev) => ({ ...prev, [itemId]: true }));
    setLocalQuantities((prev) => ({ ...prev, [itemId]: prev[itemId] || 1 }));
  };

  const handlePlusClick = (itemId) => {
    setLocalQuantities((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleMinusClick = (itemId) => {
    setLocalQuantities((prev) => {
      const currentQuantity = prev[itemId] || 0;
      if (currentQuantity <= 1) {
        return { ...prev, [itemId]: 0 };
      }
      return { ...prev, [itemId]: currentQuantity - 1 };
    });
    setClickedItems((prev) => {
      const currentQuantity = localQuantities[itemId] || 0;
      if (currentQuantity <= 1) {
        return { ...prev, [itemId]: false };
      }
      return prev;
    });
  };

  const handleAddToCart = (item) => {
    const quantity = localQuantities[item.id] || 1;
    const itemInCart = cartItems.find((cartItem) => cartItem.id === item.id);
    if (itemInCart) {
      updateQuantity(item.id, itemInCart.quantity + quantity);
    } else {
      addToCart({ ...item, quantity });
      toast.success("Item added to cart!");
    }
  };

  return (
    <>
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
      <section
        id="services"
        className="w-[90%] md:w-[85%] mx-auto my-10 md:my-20"
      >
        <h2 className="text-3xl sm:text-4xl md:text-[50px] font-sansita font-semibold text-center mb-6 md:mb-10">
          Explore More
        </h2>
        <ul className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-10">
          {items.map((item, index) => (
            <li
              key={index}
              className={
                isActiveIndex === index
                  ? "border-b-3 list-menu-style"
                  : "list-menu-style"
              }
              onClick={() => handleToggle(index)}
            >
              {item}
            </li>
          ))}
        </ul>
        <hr className="text-[#D9D9D9] mb-20" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 place-items-center">
          {categorie.map((item, index) => (
            <div
              className="w-[250px] h-[350px] rounded-t flex flex-col shadow relative"
              key={index}
            >
              <div
                className="h-4/5 bg-center bg-cover rounded-t cursor-pointer hover:scale-102 duration-150"
                style={{ backgroundImage: `url(${item.image})` }}
              ></div>
              <div
                className={
                  clickedItems[item.id] && localQuantities[item.id] > 0
                    ? "w-[80px] rounded-2xl bg-white absolute top-[45%] left-2 p-1 flex justify-between items-center"
                    : "hidden"
                }
              >
                <span
                  onClick={() => handleMinusClick(item.id)}
                  className="bg-red-300 text-red-600 text-[16px] p-1 rounded-2xl cursor-pointer"
                >
                  <FiMinus />
                </span>
                <span className="px-1">{localQuantities[item.id] || 0}</span>
                <span
                  onClick={() => handlePlusClick(item.id)}
                  className="bg-green-200 text-green-800 p-1 rounded-2xl cursor-pointer"
                >
                  <GoPlus />
                </span>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold mt-2">{item.name}</h2>
                  {!clickedItems[item.id] && (
                    <span
                      onClick={() => handleAddClick(item.id)}
                      className="bg-[#933C24] text-white rounded-full h-5 w-5 flex justify-center items-center pb-1 cursor-pointer"
                    >
                      +
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-[#5D5D5D] my-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-[#933C24] font-semibold">${item.price}</p>
                  {clickedItems[item.id] && localQuantities[item.id] > 0 && (
                    <button
                      className="bg-[#933C24] text-white py-1 px-6 cursor-pointer rounded"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div
        className="h-[50vh] sm:h-[55vh] bg-center bg-cover mb-12 md:mb-20 flex flex-col justify-center items-center px-4"
        style={{ backgroundImage: `url(${bg2})` }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-[40px] font-sansita text-white w-full md:w-3/4 lg:w-[25%] text-center leading-snug">
          About us
        </h2>
        <p className="text-[#B9B9B9] text-sm sm:text-base md:text-[17px] w-full md:w-2/3 lg:w-[25%] text-center my-3 sm:my-4 md:my-5">
          Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
          lorem. Morbi convallis.
        </p>
        <button className="bg-[#933C24] text-white font-semibold py-2 px-6 sm:px-8 rounded cursor-pointer hover:bg-[#7a3120] transition-colors">
          Read More
        </button>
      </div>
    </>
  );
}

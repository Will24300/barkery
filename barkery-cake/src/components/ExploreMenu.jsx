import { useState, useEffect } from "react";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import bg2 from "../assets/bg2.png";
import { useUser } from "../../context/HookContext";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

export default function ExploreMenu() {
  const { addToCart, cartItems } = useUser();
  const [isActiveIndex, setIsActiveIndex] = useState(0);
  const [clickedItems, setClickedItems] = useState({});
  const [localQuantities, setLocalQuantities] = useState({});
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          axios.get("/api/categories"),
          axios.get("/api/products"),
        ]);
        setCategories(categoriesRes.data.categories);
        setProducts(productsRes.data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load categories and products");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = categories.length
    ? products.filter(
        (product) => product.category_name === categories[isActiveIndex]?.name
      )
    : [];

  const handleToggle = (index) => {
    setIsActiveIndex(index);
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
    const quantity = localQuantities[item.product_id] || 1;
    const itemInCart = cartItems.find(
      (cartItem) => cartItem.id === item.product_id
    );
    if (itemInCart) {
      toast.warning("Item already in cart!");
    } else {
      addToCart({
        id: item.product_id,
        name: item.name,
        price: item.total_price,
        image: item.image_url,
        quantity,
      });
      toast.success("Item added to cart!");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

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
          {categories.map((category, index) => (
            <li
              key={category.category_id}
              className={
                isActiveIndex === index
                  ? "border-b-3 list-menu-style"
                  : "list-menu-style"
              }
              onClick={() => handleToggle(index)}
            >
              {category.name}
            </li>
          ))}
        </ul>
        <hr className="text-[#D9D9D9] mb-20" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 place-items-center">
          {filteredProducts.map((item) => (
            <div
              className="w-[250px] h-[350px] rounded-t flex flex-col shadow relative"
              key={item.product_id}
            >
              <div
                className="h-4/5 bg-center bg-cover rounded-t cursor-pointer hover:scale-102 duration-150"
                style={{ backgroundImage: `url(${item.image_url})` }}
              ></div>
              <div
                className={
                  clickedItems[item.product_id] &&
                  localQuantities[item.product_id] > 0
                    ? "w-[80px] rounded-2xl bg-white absolute top-[45%] left-2 p-1 flex justify-between items-center"
                    : "hidden"
                }
              >
                <span
                  onClick={() => handleMinusClick(item.product_id)}
                  className="bg-red-300 text-red-600 text-[16px] p-1 rounded-2xl cursor-pointer"
                >
                  <FiMinus />
                </span>
                <span className="px-1">
                  {localQuantities[item.product_id] || 0}
                </span>
                <span
                  onClick={() => handlePlusClick(item.product_id)}
                  className="bg-green-200 text-green-800 p-1 rounded-2xl cursor-pointer"
                >
                  <GoPlus />
                </span>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold mt-2">{item.name}</h2>
                  {!clickedItems[item.product_id] && (
                    <span
                      onClick={() => handleAddClick(item.product_id)}
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
                  <p className="text-[#933C24] font-semibold">
                    ${item.total_price.toFixed(2)}
                  </p>
                  {clickedItems[item.product_id] &&
                    localQuantities[item.product_id] > 0 && (
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

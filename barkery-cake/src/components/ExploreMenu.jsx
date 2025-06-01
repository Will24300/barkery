import { useState } from "react";
import { data } from "../data/data";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import bg2 from "../assets/bg2.png";

export default function ExploreMenu() {
  const items = ["Cake", "Muffins", "Croissant", "Bread", "Tart", "Favorite"];
  const [isActiveIndex, setIsActiveIndex] = useState(0);
  const [counters, setCounters] = useState({});

  const categorie = data.categories[isActiveIndex].products;

  const updateCounter = (id) => {
    setCounters((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const updateCounterDecrease = (id) => {
    setCounters((prev) => ({ ...prev, [id]: prev[id] - 1 }));
  };

  const handleToggle = (index) => {
    setIsActiveIndex(isActiveIndex === index ? 0 : index);
  };

  return (
    <>
      <section id="explore" className="w-[85%] mx-auto my-20">
        <h2 className="text-[50px] font-sansita font-semibold text-center mb-10">
          Explore More
        </h2>
        <ul className="flex justify-center items-center gap-10">
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
                className="h-4/5 bg-center bg-cover rounded-t  cursor-pointer hover:scale-102 duration-150"
                style={{ backgroundImage: `url(${item.image})` }}
              ></div>
              <div
                className={
                  counters[item.id] > 0
                    ? "w-[80px] rounded-2xl bg-white absolute top-[45%] left-2 p-1  flex justify-between items-center "
                    : "hidden"
                }
              >
                <span
                  onClick={() => updateCounterDecrease(item.id)}
                  className="bg-red-300 text-red-600 text-[16px] p-1 rounded-2xl cursor-pointer"
                >
                  <FiMinus />
                </span>
                <span className="px-1">{counters[item.id] || 0}</span>

                <span
                  onClick={() => updateCounter(item.id)}
                  className="bg-green-200 text-green-800 p-1 rounded-2xl cursor-pointer"
                >
                  <GoPlus />
                </span>
              </div>
              <div className="p-4">
                <h2 className="font-semibold mt-2 ">{item.name}</h2>
                <p className="text-[13px] text-[#5D5D5D] my-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-[#933C24] font-semibold">${item.price}</p>
                  <button
                    className="bg-[#933C24] text-white py-1 px-6 cursor-pointer rounded"
                    onClick={() => updateCounter(item.id)}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div
        className="h-[55vh] bg-center bg-cover mb-20 flex flex-col justify-center items-center"
        style={{ backgroundImage: `url(${bg2})` }}
      >
        <h2 className="text-[40px] font-sansita text-white w-[25%] text-center leading-13">
          About us
        </h2>
        <p className="text-[#B9B9B9] text-[17px] w-[25%] text-center my-5">
          Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
          lorem. Morbi convallis.
        </p>
        <button className="bg-[#933C24] text-white font-smibold py-2 px-8 rounded cursor-pointer ">
          Read More
        </button>
      </div>
    </>
  );
}

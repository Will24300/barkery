import { useState } from "react";
import { data } from "../data/data";

export default function ExploreMenu() {
  const items = ["Cake", "Muffins", "Croissant", "Bread", "Tart", "Favorite"];
  const [isActiveIndex, setIsActiveIndex] = useState(0);
  const [counters, setCounters] = useState({});
  const categorie = data.categories[isActiveIndex].products;

  const updateCounter = (id) => {
    setCounters((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
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
                className="h-4/5 bg-center bg-cover rounded-t  "
                style={{ backgroundImage: `url(${item.image})` }}
              ></div>
              <div
                className={
                  counters[item.id] > 0
                    ? "w-[80px] rounded-2xl bg-white absolute top-[45%] left-2 p-1  flex justify-between items-center "
                    : "hidden"
                }
              >
                <span className="bg-red-300 text-red-600 text-[16px] px-2 rounded-2xl cursor-pointer">
                  -
                </span>
                <span className="px-1">{counters[item.id] || 0}</span>
                <span className="bg-green-200 text-green-800 px-2 rounded-2xl cursor-pointer">
                  +
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
    </>
  );
}

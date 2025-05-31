import { useState } from "react";
import bg from "../assets/bg.png";
import logo from "../assets/logo.png";
import { FaShoppingCart } from "react-icons/fa";

export default function Navbar() {
  const [active, setActive] = useState(0);
  const menus = ["Home", "Blog", "Contact Us", "Services"];

  const handleToggle = (index) => {
    setActive(active === index ? null : index);
  };
  return (
    <>
      <nav
        className="h-screen bg-no-repeat  mb-10 text-white px-20 py-5"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="flex justify-between items-center">
          <img src={logo} alt="logo" height={99} width={87} />
          <ul className="flex justify-center gap-10">
            {menus.map((item, index) => (
              <li
                key={index}
                onClick={() => handleToggle(index)}
                className={
                  active === index ? "list-style-active" : "list-style"
                }
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="flex gap-10">
            <div className=" px-2 py-1 relative">
              <FaShoppingCart className="text-3xl cursor-pointer" />
              <span className=" bg-red-700 rounded h-[6px] w-[6px] absolute top-0 right-0 "></span>
            </div>
            <button className="bg-[#933C24] font-smibold py-1 px-8 rounded cursor-pointer">
              Login
            </button>
          </div>
        </div>
        <div className="mt-25">
          <h2 className="text-[#E9BD8C] text-[24px] font-semibold">
            Delicious Cafe
          </h2>
          <h1 className="text-[74px] font-sansita leading-22 mb-10">
            Sweet Treats,
            <br /> Perfect Eats
          </h1>
          <div className=" flex gap-3">
            <button className="bg-[#933C24] font-smibold py-2 px-8 rounded cursor-pointer">
              Shop Now
            </button>
            <button className="text-[#E9BD8C] bg-transparent font-smibold py-2 px-8 rounded cursor-pointer">
              Learn More
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

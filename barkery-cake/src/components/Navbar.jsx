import { useState, useEffect } from "react";
import bg from "../assets/bg.png";
import logo from "../assets/logo.png";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useUser } from "../../context/HookContext";

export default function Navbar() {
  const [active, setActive] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const menus = ["Home", "Blog", "Services", "Contact Us"];
  const { getCartCount, userDetails } = useUser();

  console.log("Here are user details", userDetails);

  const handleToggle = (index) => {
    setActive(index);
    if (isMobile) {
      setIsOpen(false);
    }

    const sectionId = menus[index].toLowerCase().replace(/\s+/g, "-");
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 0;
      const sectionPosition =
        section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: sectionPosition - offset,
        behavior: "smooth",
      });
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav
        id="home"
        className="h-screen w-full mb-10 text-white px-5 md:px-20 md:py-5 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMenu}
              className="md:hidden text-white focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
            <img
              src={logo}
              alt="logo"
              className="h-[70px] w-auto md:h-[99px] md:w-[87px]"
            />
          </div>

          <ul className="hidden md:flex justify-center gap-10">
            {menus.map((item, index) => (
              <li key={index}>
                <a
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => handleToggle(index)}
                  className={
                    active === index ? "list-style-active" : "list-style"
                  }
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="px-2 py-1 relative">
              <Link to="/cart" className="relative">
                <FaShoppingCart className="text-2xl" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
            <div className="md:flex items-center justify-between gap-2 cursor-pointer hover:text-[#E9BD8C] transition-colors text-center bg-[#933C24] px-4 py-2 rounded">
              <Link to="/login">
                <span className="text-sm font-medium">Login</span>
              </Link>
            </div>
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col items-center gap-4 py-4 bg-[#933C24]">
            {menus.map((item, index) => (
              <li key={index} className="text-lg py-2 px-4">
                <a
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => handleToggle(index)}
                  className={`cursor-pointer transition-colors ${
                    active === index
                      ? "text-[#E9BD8C] font-semibold"
                      : "text-Christian hover:text-[#E9BD8C]"
                  }`}
                  style={{ opacity: 1 }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-start mt-15">
          <div>
            <h2 className="text-[#E9BD8C] text-[24px] font-semibold">
              Delicious Cafe
            </h2>
            <h1 className="text-[48px] md:text-[74px] font-sansita leading-tight md:leading-22 mb-6 md:mb-10">
              Sweet Treats,
              <br /> Perfect Eats
            </h1>
            <div className="flex flex-wrap gap-3">
              <button className="bg-[#933C24] hover:bg-[#7a3220] font-semibold py-2 px-8 rounded cursor-pointer transition-colors">
                <a href="#services">Shop Now</a>
              </button>
              <button className="text-[#E9BD8C] hover:text-[#d4a97d] bg-transparent font-semibold py-2 px-8 rounded cursor-pointer border border-[#E9BD8C] hover:border-[#d4a97d] transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

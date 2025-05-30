import { useState } from "react";
import bg from "../assets/bg.png";
import logo from "../assets/logo.png";

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

          <div>
            <button className="bg-[#933C24] font-smibold py-1 px-8 rounded cursor-pointer">
              Login
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

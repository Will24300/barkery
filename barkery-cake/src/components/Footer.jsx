import bg from "../assets/bg3.png";
import logo from "../assets/logo.png";
import facebook from "../assets/facebook.png";
import pinterest from "../assets/pinterest.png";
import whatsapp from "../assets/whatsapp.png";
import instagram from "../assets/insta.png";
import photo1 from "../assets/recent1.png";
import photo2 from "../assets/recent2.png";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="px-4 sm:px-8 md:px-15 py-5 md:py-7"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center pb-6 md:pb-8 gap-4 sm:gap-0">
        <img
          src={logo}
          alt="Logo"
          className="h-[50px] sm:h-[70px] md:h-[99px] w-auto"
        />
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 sm:pr-10">
          <h2 className="text-[#E9BD8D] font-semibold text-lg sm:text-xl md:text-[22px]">
            Follow us
          </h2>
          <div className="flex gap-3 sm:gap-5">
            {[facebook, pinterest, whatsapp, instagram].map((icon, index) => (
              <img
                key={index}
                src={icon}
                alt={["facebook", "pinterest", "whatsapp", "instagram"][index]}
                width={24}
                height={24}
                className="w-6 h-6 sm:w-8 sm:h-8 cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>

      <hr className="text-[#E9BD8D] opacity-30 my-4 md:my-0" />

      <div className="flex flex-col md:flex-row justify-between gap-8 py-6 md:py-8">
        <div className="text-center md:text-left">
          <h2 className="text-[#E9BD8D] font-semibold text-2xl md:text-[30px] mb-2 md:mb-3">
            About Us
          </h2>
          <ul className="text-white">
            {[
              "(250) 791-954372",
              "volonterwicha123@gmail.com",
              "South 13th street",
              "Kigali Rwanda",
            ].map((item, index) => (
              <li
                key={index}
                className={`leading-7 md:leading-8 text-sm md:text-[17px] ${
                  index === 0 ? "font-semibold" : ""
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h2 className="text-[#E9BD8D] font-semibold text-2xl md:text-[30px] mb-2 md:mb-3">
            Explore
          </h2>
          <ul className="text-white">
            {["home", "Blog", "Contact Us", "Services"].map((item, index) => (
              <li
                key={index}
                className="leading-7 md:leading-8 text-sm md:text-[17px] font-semibold capitalize cursor-pointer hover:text-[#E9BD8D] transition-colors"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden md:block md:ml-10 lg:ml-60">
          <h2 className="text-[#E9BD8D] font-semibold text-2xl md:text-[30px] mb-3 md:mb-5 text-center md:text-left">
            Recent News
          </h2>
          <div className="text-white space-y-4">
            {[photo1, photo2].map((photo, index) => (
              <div key={index} className="flex gap-3 items-center">
                <img
                  src={photo}
                  alt="recent order"
                  className="w-16 h-14 sm:w-20 sm:h-[67px]"
                />
                <div>
                  <p className="text-[#E9BD8C] text-xs sm:text-sm md:text-[15px]">
                    June 2,2025
                  </p>
                  <p className="text-sm sm:text-base md:text-[18px]">
                    Puff pastry bliss.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-[#737373] text-xs sm:text-sm text-center font-semibold pt-4 md:pt-0">
        © 2025 Volonte & Salomon. All rights reserved
      </p>
    </footer>
  );
}

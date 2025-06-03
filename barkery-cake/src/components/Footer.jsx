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
      className="px-15 py-7"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="flex justify-between items-center pb-8">
        <img
          src={logo}
          alt="Logo"
          className="h-[70px] w-auto md:h-[99px] md:w-[87px]"
        />
        <div className="flex justify-center items-center gap-5 pr-10">
          <h2 className="text-[#E9BD8D] font-semibold text-[22px] mr-10">
            Follow us
          </h2>
          <img
            src={facebook}
            alt="facebook"
            width={32}
            height={32}
            className="cursor-pointer"
          />
          <img
            src={pinterest}
            alt="pinterest"
            width={32}
            height={32}
            className="cursor-pointer"
          />
          <img
            src={whatsapp}
            alt="whatsapp"
            width={32}
            height={32}
            className="cursor-pointer"
          />
          <img
            src={instagram}
            alt="instagram"
            width={32}
            height={32}
            className="cursor-pointer"
          />
        </div>
      </div>
      <hr className="text-[#E9BD8D] opacity-30" />
      <div className="flex justify-between  py-8">
        <div>
          <h2 className="text-[#E9BD8D] font-semibold text-[30px] mb-3">
            About Us
          </h2>
          <ul className="text-white">
            <li className="leading-8 text-[17px] font-semibold">
              (250) 791-954372
            </li>
            <li className="leading-8 text-[17px] ">
              volonterwicha123@gmail.com
            </li>
            <li className="leading-8 text-[17px] ">South 13th street</li>
            <li className="leading-8 text-[17px] ">Kigali Rwanda</li>
          </ul>
        </div>
        <div>
          <h2 className="text-[#E9BD8D] font-semibold text-[30px] mb-3">
            Explore
          </h2>
          <ul className="text-white">
            <li className="leading-8 text-[17px] font-semibold">home</li>
            <li className="leading-8 text-[17px] font-semibold">Blog</li>
            <li className="leading-8 text-[17px] font-semibold">Contact Us</li>
            <li className="leading-8 text-[17px] font-semibold">Services</li>
          </ul>
        </div>
        <div className="ml-60">
          <h2 className="text-[#E9BD8D] font-semibold text-[30px] mb-5">
            Recent News
          </h2>
          <div className="text-white ">
            <div className="flex gap-3 mb-3">
              <img src={photo1} alt="recent order" width={80} height={67} />
              <div>
                <p className="text-[#E9BD8C] text-[15px]">June 2,2025</p>
                <p className="text-[18px]">Puff pastry bliss.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <img src={photo2} alt="recent order" width={80} height={67} />
              <div className="">
                <p className="text-[#E9BD8C] text-[15px]">June 2,2025</p>
                <p className="text-[18px]">Puff pastry bliss.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-[#737373] text-center font-semibold">
        © 2025 Volonte & Salomon. All rights reserved
      </p>
    </footer>
  );
}

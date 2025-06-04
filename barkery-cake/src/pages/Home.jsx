import ExploreMenu from "../components/ExploreMenu";
import FeaturedTreats from "../components/FeaturedTreats";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Products from "../components/Products";
import { useContext } from "react";
import { UserContext } from "../../context/HookContext";

export default function Home() {
  const { setAuth, setUserDetails } = useContext(UserContext);
  return (
    <>
      <div id="home">
        <Navbar setAuth={setAuth} setUserDetails={setUserDetails} />
      </div>
      <div id="blog" className="min-h-screen">
        <Products />
      </div>
      <div id="services" className="min-h-screen">
        <ExploreMenu />
      </div>
      <div id="featured-treats" className="min-h-screen">
        <FeaturedTreats />
      </div>
      <div id="contact-us">
        <Footer />
      </div>
    </>
  );
}

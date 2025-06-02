import ExploreMenu from "../components/ExploreMenu";
import FeaturedTreats from "../components/FeaturedTreats";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Products from "../components/Products";
import { useContext } from "react";
import { UserContext } from "../context/HookContext";


export default function Home() {
  const { setAuth, setUserDetails } = useContext(UserContext);
  return (
    <>
      <Navbar setAuth={setAuth} setUserDetails={setUserDetails} />
      <Products />
      <ExploreMenu />
      <FeaturedTreats />
      <Footer />
    </>
  );
}

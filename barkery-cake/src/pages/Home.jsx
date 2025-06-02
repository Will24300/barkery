import ExploreMenu from "../components/ExploreMenu";
import FeaturedTreats from "../components/FeaturedTreats";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Products from "../components/Products";

export default function Home() {
  return (
    <>
      <Navbar />
      <Products />
      <ExploreMenu />
      <FeaturedTreats />
      <Footer />
    </>
  );
}

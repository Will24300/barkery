import { products } from "../data/data";
import bg from "../assets/productBg.png";
import bg1 from "../assets/bg1.png";

export default function Products() {
  return (
    <>
      <section className="w-[85%] mx-auto text-center mb-30">
        <h2 className="font-sansita font-semibold text-[#111111] text-[35px] mb-15 mt-15">
          Top Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 place-items-center text-white">
          {products.map((product) => (
            <div
              key={product.id}
              className="h-[320px] w-[280px] rounded-2xl p-5"
              style={{ backgroundImage: `url(${bg})` }}
            >
              <img
                src={product.img}
                alt={product.name}
                className={
                  product.id === 2 || product.id === 3
                    ? "w-[200px] mx-auto mb-4 "
                    : "w-[170px] mx-auto "
                }
              />
              <div className="flex flex-col  items-start">
                <h2 className="font-medium text-[24px] mb-4">
                  {product.price}
                </h2>
                <div className="flex justify-between items-center">
                  <h2 className=" text-[22px] w-[70%] text-start">
                    {product.name}
                  </h2>
                  <button
                    id="#explore"
                    className="bg-[#933C24] text-white px-4 py-1 rounded cursor-pointer"
                  >
                    <a href="#services">Check</a>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div
        className="h-[55vh] bg-center bg-cover mb-20 flex flex-col justify-center items-center"
        style={{ backgroundImage: `url(${bg1})` }}
      >
        <h2 className="text-[40px] font-sansita text-[#933C24] w-[25%] text-center leading-13">
          20% Off&nbsp; Your First Order
        </h2>
        <p className="text-[#5D5D5D] text-[17px] w-[25%] text-center my-5">
          Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibenjgg.
        </p>
        <button className="bg-[#933C24] text-white font-smibold py-2 px-8 rounded cursor-pointer ">
          Learn More
        </button>
      </div>
    </>
  );
}

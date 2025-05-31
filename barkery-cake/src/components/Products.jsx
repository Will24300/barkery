import { products } from "../data/data";
import bg from "../assets/productBg.png";

export default function Products() {
  return (
    <>
      <section className="w-[85%] mx-auto text-center mb-10">
        <h2 className="font-sansita font-semibold text-[#111111] text-[35px] mb-15 mt-15">
          Top Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 place-items-center text-white">
          {products.map((product) => (
            <div
              className="h-[320px] w-[280px] rounded-2xl p-5"
              style={{ backgroundImage: `url(${bg})` }}
            >
              <img
                src={product.img}
                alt={product.name}
                className="w-[170px] mx-auto"
              />
              <div className="flex flex-col  items-start">
                <h2 className="font-medium text-[24px] mb-4">
                  {product.price}
                </h2>
                <div className="flex justify-between items-center">
                  <h2 className=" text-[22px] w-[70%] text-start">
                    {product.name}
                  </h2>
                  <button className="bg-[#933C24] text-white px-4 py-1 rounded cursor-pointer">
                    Check
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

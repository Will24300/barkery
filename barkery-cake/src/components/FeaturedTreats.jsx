import { featuredTreat } from "../data/data";

export default function FeaturedTreats() {
  return (
    <>
      <section id="blog" className="w-[85%] mx-auto text-center mb-30">
        <h2 className="font-sansita font-semibold text-[#111111] text-[30px] md:text-[32px] lg:text-[35px] mb-15 mt-15">
          Top Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 place-items-center text-white">
          {featuredTreat.map((item) => (
            <div
              key={item.id}
              className=" w-[230px] md:w-[260px]  lg:w-[300px] flex flex-col text-black"
            >
              <img src={item.img} alt={item.name} />
              <div className="flex justify-between px-7 pt-2">
                <h2 className="text-[18px] md:text-[20px] lg:text-[24px] font-semibold">
                  {item.name}
                </h2>
                <p className="text-[18px] md:text-[20px] lg:text-[24px] font-semibold">
                  {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

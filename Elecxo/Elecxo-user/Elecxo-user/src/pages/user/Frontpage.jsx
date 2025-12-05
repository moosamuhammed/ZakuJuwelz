import React from "react";
import Categories from "../../components/cards/Categories"; // Ensure the filename matches
import ProductCard from "../../Layout/user/ProductCard";
import adds from "../../../public/adds.png"
import Footer from "../../../Footer";

function Frontpage() {
  return (
    <div >
      <Categories />
      <div className="w-100% flex justify-center my-4">
  <img
    src={adds}
    alt="Banner"
    className="w-full  h-auto object-contain rounded-2xl"
  />
</div>

      <ProductCard />
      <Footer />
    </div>
  );
}

export default Frontpage;

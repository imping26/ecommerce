import React, { useEffect, useState } from "react";

export const RecommendList = () => {
  const [recommendedList, setRecommendedList] = useState<any[]>([]);
  useEffect(() => {
    const fetchRecommendedProductsList = async () => {
      const response = await fetch("https://dummyjson.com/products");
      const data = await response.json();
      const recommendList = data.products.sort(
        (a: any, b: any) => b.rating - a.rating
      );
      setRecommendedList(recommendList.slice(0, 6)); //only show 6 items
    };
    fetchRecommendedProductsList();
  }, []);

  return (
    <div className="mt-5">
      <div className="pb-4">
        <h2 className="text-lg font-semibold">Things you might like</h2>
      </div>
      <div className="grid grid-cols-12 gap-3 ">
        {recommendedList.map((product) => {
          return (
            <div className="col-span-4" key={product.id}>
              <img src={product.images} alt={product.title} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

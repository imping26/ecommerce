import React, { useEffect, useState } from "react";
import { useFilter } from "./FilterContext";
import { Tally3 } from "lucide-react";
import axios from "axios";
import { BookCard } from "./BookCard";
import { RecommendList } from "./RecommendList";
import { RecentViewProduct } from "./RecentViewProduct";

export const MainContent = () => {
  const { searchQuery, selectedCategory, minPrice, maxPrice, keyword } =
    useFilter();

  const [products, setProducts] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [recentViewProduct, setRecentViewProduct] = useState<any[]>([]);
  const itemsPerPage = 12;

  useEffect(() => {
    // @ts-ignore
    const recentViewItem = JSON.parse(localStorage.getItem("recentViews")) || [];
    setRecentViewProduct(recentViewItem);
  }, []);

  useEffect(() => {
    let url = `https://dummyjson.com/products?limit=${itemsPerPage}&skip=${
      (currentPage - 1) * itemsPerPage
    }`;

    if (keyword) {
      url = `https://dummyjson.com/products/search?q=${keyword}`;
    }

    axios
      .get(url)
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [currentPage, keyword]);

  const getFilteredProducts = () => {
    let filteredProducts = products;
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (products) => products.category === selectedCategory
      );
    }

    if (minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (products) => products.price >= minPrice
      );
    }

    if (maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (products) => products.price <= maxPrice
      );
    }

    if (searchQuery) {
      filteredProducts = filteredProducts.filter((products) =>
        products.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (filter) {
      case "expensive":
        return filteredProducts.sort((a, b) => b.price - a.price);
      case "cheap":
        return filteredProducts.sort((a, b) => a.price - b.price);
      case "popular":
        return filteredProducts.sort((a, b) => b.rating - a.rating);
      default:
        return filteredProducts;
    }
  };

  const filterProducts = getFilteredProducts();

  const totalProducts = 100;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPaginationButton = () => {
    const buttons: number[] = [];

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    //handle first page (1 or 2)
    if (currentPage - 2 < 1) {
      endPage = Math.min(totalPages, endPage + (2 - currentPage - 1));
    }
    //handle near last page
    if (currentPage + 2 > totalPages) {
      startPage = Math.max(1, startPage - (currentPage + 2 - totalPages));
    }

    for (let page = startPage; page <= endPage; page++) {
      buttons.push(page);
    }

    return buttons;
  };

  const handleRecentView = (item: { id: string | number }) => {
    // @ts-ignore
    let recentItem = JSON.parse(localStorage.getItem("recentViews")) || [];

    recentItem = [...recentItem, item];

    recentItem = recentItem.filter(
      // @ts-ignore
      (i, index, self) => index === self.findIndex((t) => t.id === i.id)
    );

    if (recentItem.length > 6) {
      recentItem.shift();
    }

    localStorage.setItem("recentViews", JSON.stringify(recentItem));
    setRecentViewProduct(recentItem);
  };

  return (
    <>
      <section className="w-[70%] p-5 flex border-r">
        <div className="mb-5">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="relative mb-5 mt-5">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="border px-4 py-2 rounded-full flex items-center"
              >
                <Tally3 className="mr-2" />
                {filter === "all"
                  ? "Filter"
                  : filter.charAt(0).toLowerCase() + filter.slice(1)}
              </button>

              {dropdownOpen && (
                <div className="absolute bg-white border border-gray-300 rounded mt-2 w-full sm:w-40">
                  <button
                    onClick={() => setFilter("cheap")}
                    className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                  >
                    Cheap
                  </button>
                  <button
                    onClick={() => setFilter("expensive")}
                    className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                  >
                    Expensive
                  </button>
                  <button
                    onClick={() => setFilter("popular")}
                    className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                  >
                    Popular
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* product items */}
          <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {filterProducts.map((product) => {
              return (
                <BookCard
                  key={product.id}
                  allItem={product}
                  id={product.id}
                  image={product.thumbnail}
                  price={product.price}
                  title={product.title}
                  recentViewHandle={handleRecentView}
                />
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-5">
            <button
              className="border px-4 py-2 mx-2 rounded-full"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <div className="flex flex-wrap justify-center">
              {getPaginationButton().map((page) => {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`border px-4 py-2 mx-1 rounded-full ${
                      page === currentPage ? "bg-black text-white" : ""
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              className="border px-4 py-2 mx-2 rounded-full"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>
      <section className="w-[30%] p-3">
        <RecommendList />
        <RecentViewProduct data={recentViewProduct} />
      </section>
    </>
  );
};

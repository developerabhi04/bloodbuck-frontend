import React, { useEffect, useMemo, useState } from "react";
import { Add, Remove } from "@mui/icons-material";
import { Skeleton, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlices";
import { fetchCategories } from "../../redux/slices/categorySlices";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ProductCard from "./ProductCard";

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    category: searchParams.get("category") ? [searchParams.get("category")] : [],
    color: [],
    priceRange: [0, 1000],
    sort: "",
  });
  const [filterUI, setFilterUI] = useState({ category: true, color: false, price: false });

  const { products, loading: prodLoading } = useSelector((state) => state.products);
  const { categories, loading: catLoading } = useSelector((state) => state.categories);

  // derive color options
  const { colorOptions } = useMemo(() => {
    const map = {};
    products.forEach((prod) => {
      prod.colors?.forEach((col) => {
        if (col.colorName && !map[col.colorName]) {
          map[col.colorName] = col.colorImage?.url || col.photos?.[0]?.url || "";
        }
      });
    });
    return { colorOptions: Object.entries(map).map(([name, url]) => ({ name, url })) };
  }, [products]);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const toggleGroup = (key) => setFilterUI((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleCheckbox = (e, key) => {
    const { value, checked } = e.target;
    setFilters((prev) => {
      const setVals = new Set(prev[key]);
      checked ? setVals.add(value) : setVals.delete(value);
      return { ...prev, [key]: Array.from(setVals) };
    });
  };

  const handlePrice = (e) => {
    setFilters((prev) => ({ ...prev, priceRange: [prev.priceRange[0], +e.target.value] }));
  };

  const handleSort = (e) => setFilters((prev) => ({ ...prev, sort: e.target.value }));

  return (
    <>
      <Helmet>
        <title>Our Products – Your Store</title>
        <meta name="description" content="Browse our products with advanced filters." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <section className="bg-gray-50 pt-24 md:pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:space-x-6">

          {/* Sidebar - always visible */}
          <aside className="w-full md:w-1/4 lg:w-1/5 mb-6 md:mb-0">
            <div className="bg-white p-6 rounded-lg shadow sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>

              {/* Category */}
              <div className="mb-6">
                <button
                  onClick={() => toggleGroup("category")}
                  className="w-full flex justify-between items-center text-gray-800 font-medium mb-2"
                >
                  Category {filterUI.category ? <Remove /> : <Add />}
                </button>
                {filterUI.category && (
                  <ul className="space-y-2">
                    {catLoading
                      ? [1, 2].map((i) => <Skeleton key={i} height={24} />)
                      : categories.map((cat) => (
                        <label key={cat._id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            value={cat._id}
                            checked={filters.category.includes(cat._id)}
                            onChange={(e) => handleCheckbox(e, "category")}
                            className="form-checkbox h-4 w-4 text-blue-600"
                          />
                          <span className="text-gray-700">{cat.name}</span>
                        </label>
                      ))}
                  </ul>
                )}
              </div>

              {/* Color */}
              <div className="mb-6">
                <button
                  onClick={() => toggleGroup("color")}
                  className="w-full flex justify-between items-center text-gray-800 font-medium mb-2"
                >
                  Color {filterUI.color ? <Remove /> : <Add />}
                </button>
                {filterUI.color && (
                  <ul className="space-y-2">
                    {colorOptions.length === 0 ? (
                      <p className="text-gray-500">No colors</p>
                    ) : (
                      colorOptions.map((col) => (
                        <label key={col.name} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            value={col.name}
                            checked={filters.color.includes(col.name)}
                            onChange={(e) => handleCheckbox(e, "color")}
                            className="form-checkbox h-4 w-4 text-blue-600"
                          />
                          <div
                            className="w-5 h-5 rounded-full border"
                            style={{ backgroundImage: `url(${col.url})`, backgroundSize: 'cover' }}
                          />
                          <span className="text-gray-700">{col.name}</span>
                        </label>
                      ))
                    )}
                  </ul>
                )}
              </div>

              {/* Price */}
              <div>
                <button
                  onClick={() => toggleGroup("price")}
                  className="w-full flex justify-between items-center text-gray-800 font-medium mb-2"
                >
                  Price {filterUI.price ? <Remove /> : <Add />}
                </button>
                {filterUI.price && (
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={filters.priceRange[1]}
                      onChange={handlePrice}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            {/* Sort Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 px-2 md:px-0">
              <h3 className="text-lg font-semibold mb-2 sm:mb-0">All Items</h3>
              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-gray-700">Sort by:</label>
                <select
                  id="sort"
                  value={filters.sort}
                  onChange={handleSort}
                  className="form-select block w-40 border-gray-300 rounded-md"
                >
                  <option value="">Featured</option>
                  <option value="createdAt">New Arrivals</option>
                  <option value="averageRating">Top Rated</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="price">Price: Low to High</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {prodLoading ? (
              <Stack spacing={4} className="px-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" height={200} />
                ))}
              </Stack>
            ) : products.length === 0 ? (
              <p className="text-center text-gray-500">No products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2 md:px-0">
                {products.map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Products;

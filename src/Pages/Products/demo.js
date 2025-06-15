import { useEffect, useMemo, useState } from "react";
import { Close, Tune, Star, Remove, Add } from "@mui/icons-material";
import { Skeleton, Stack, Drawer, IconButton } from "@mui/material";
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
    brand: [],
    rating: [],
    priceRange: [0, 1000],
    sort: "",
  });
  const [filterUI, setFilterUI] = useState({
    category: true,
    color: true,
    brand: true,
    rating: true,
    price: true,
  });
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const { products, loading: prodLoading } = useSelector((state) => state.products);
  const { categories, loading: catLoading } = useSelector((state) => state.categories);

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

  const clearAllFilters = () => {
    setFilters({
      keyword: "",
      category: [],
      color: [],
      brand: [],
      rating: [],
      priceRange: [0, 100000],
      sort: "",
    });
  };

  const hasFilters =
    filters.category.length ||
    filters.color.length ||
    filters.brand.length ||
    filters.rating.length ||
    filters.priceRange[1] !== 100000;

  const FilterSection = (
    <div className="w-full max-w-xs p-6 space-y-6 bg-white">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Filters</h2>
          <IconButton onClick={() => setMobileDrawerOpen(false)} className="md:hidden">
            <Close />
          </IconButton>
        </div>

        <button
          onClick={clearAllFilters}
          className="w-full py-2 mb-4 text-sm rounded bg-gray-800 text-white hover:bg-gray-700"
        >
          Clear All Filters
        </button>

        {/* Category */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-700">Category</h3>
            <button onClick={() => toggleGroup("category")} className="text-sm text-blue-600">
              {filterUI.category ? <Remove /> : <Add />}
            </button>
          </div>
          {filterUI.category &&
            (catLoading
              ? [1, 2].map((i) => <Skeleton key={i} height={14} />)
              : categories.map((cat) => (
                <label key={cat._id} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    value={cat.name}
                    checked={filters.category.includes(cat.name)}
                    onChange={(e) => handleCheckbox(e, "category")}
                    className="form-checkbox h-4 w-4 text-indigo-600"
                  />
                  <span className="text-sm text-gray-800">{cat.name}</span>
                </label>
              )))}
        </div>

        {/* Color */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-700">Color</h3>
            <button onClick={() => toggleGroup("color")} className="text-sm text-blue-600">
              {filterUI.color ? <Remove /> : <Add />}
            </button>
          </div>
          {filterUI.color &&
            colorOptions.map((col) => (
              <label key={col.name} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  value={col.name}
                  checked={filters.color.includes(col.name)}
                  onChange={(e) => handleCheckbox(e, "color")}
                  className="form-checkbox h-4 w-4 text-indigo-600"
                />
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundImage: `url(${col.url})`, backgroundSize: "cover" }}
                />
                <span className="text-sm text-gray-800">{col.name}</span>
              </label>
            ))}
        </div>



        {/* Rating */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-700">Rating</h3>
            <button onClick={() => toggleGroup("rating")} className="text-sm text-blue-600">
              {filterUI.rating ? <Remove /> : <Add />}
            </button>
          </div>
          {filterUI.rating &&
            [5, 4, 3, 2, 1].map((rate) => (
              <label key={rate} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  value={String(rate)}
                  checked={filters.rating.includes(String(rate))}
                  onChange={(e) => handleCheckbox(e, "rating")}
                  className="form-checkbox h-4 w-4 text-indigo-600"
                />
                <div className="flex text-yellow-500">
                  {Array(rate)
                    .fill(0)
                    .map((_, idx) => (
                      <Star key={idx} fontSize="small" />
                    ))}
                </div>
              </label>
            ))}
        </div>

        {/* Price */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-700">Price</h3>
            <button onClick={() => toggleGroup("price")} className="text-sm text-blue-600">
              {filterUI.price ? <Remove /> : <Add />}
            </button>
          </div>
          {filterUI.price && (
            <>
              <input
                type="range"
                min="0"
                max="100000"
                value={filters.priceRange[1]}
                onChange={handlePrice}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>₹{filters.priceRange[0]}</span>
                <span>₹{filters.priceRange[1]}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Our Products – Your Store</title>
        <meta name="description" content="Browse our products with advanced filters." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <section className="bg-white pt-32 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6 md:hidden">
            <h3 className="text-2xl font-bold text-gray-900">All Products</h3>
            <IconButton onClick={() => setMobileDrawerOpen(true)}>
              <Tune />
            </IconButton>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="hidden md:block w-full max-w-xs border-r border-gray-200 sticky top-24 self-start h-fit">
              {FilterSection}
            </div>

            {/* Drawer */}
            <Drawer anchor="left" open={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)}>
              {FilterSection}
            </Drawer>

            <div className="flex-1 ml-0 md:ml-8">
              <div className="hidden md:flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">All Products</h3>
                <select
                  id="sort"
                  value={filters.sort}
                  onChange={handleSort}
                  className="text-sm border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Featured</option>
                  <option value="createdAt">New Arrivals</option>
                  <option value="averageRating">Top Rated</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="price">Price: Low to High</option>
                </select>
              </div>

              {hasFilters && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {filters.category.map((cat) => (
                    <span key={cat} className="bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded-full flex items-center">
                      Category: {cat}
                      <Close
                        className="ml-1 text-xs cursor-pointer"
                        onClick={() => handleCheckbox({ target: { value: cat, checked: false } }, "category")}
                      />
                    </span>
                  ))}
                  {filters.color.map((col) => (
                    <span key={col} className="bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded-full flex items-center">
                      Color: {col}
                      <Close
                        className="ml-1 text-xs cursor-pointer"
                        onClick={() => handleCheckbox({ target: { value: col, checked: false } }, "color")}
                      />
                    </span>
                  ))}
                  {filters.brand.map((b) => (
                    <span key={b} className="bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded-full flex items-center">
                      Brand: {b}
                      <Close
                        className="ml-1 text-xs cursor-pointer"
                        onClick={() => handleCheckbox({ target: { value: b, checked: false } }, "brand")}
                      />
                    </span>
                  ))}
                  {filters.rating.map((r) => (
                    <span key={r} className="bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded-full flex items-center">
                      Rating: {r}+
                      <Close
                        className="ml-1 text-xs cursor-pointer"
                        onClick={() => handleCheckbox({ target: { value: r, checked: false } }, "rating")}
                      />
                    </span>
                  ))}
                  {filters.priceRange[1] !== 1000 && (
                    <span className="bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded-full flex items-center">
                      Price ≤ ${filters.priceRange[1]}
                      <Close
                        className="ml-1 text-xs cursor-pointer"
                        onClick={() => setFilters((prev) => ({ ...prev, priceRange: [0, 1000] }))}
                      />
                    </span>
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="text-sm px-4 py-1 rounded-full bg-gray-700 text-white hover:bg-gray-800"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {prodLoading ? (
                <Stack spacing={4} className="px-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={200} />
                  ))}
                </Stack>
              ) : products.length === 0 ? (
                <p className="text-center text-gray-500 mt-16">No products found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((prod) => (
                    <ProductCard key={prod._id} product={prod} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Products; 
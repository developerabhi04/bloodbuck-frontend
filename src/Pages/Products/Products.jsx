import { useEffect, useMemo, useState } from "react";
import { Add, Remove, Close, Tune, Star } from "@mui/icons-material";
import { Skeleton, Stack, Drawer, IconButton, Breadcrumbs, Link as MuiLink } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlices";
import { fetchCategories } from "../../redux/slices/categorySlices";
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import productBanner from "../../assets/product-banner.webp";
import ProductCard from "./ProductCard";

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    category: searchParams.get("category") ? [searchParams.get("category")] : [],
    color: [],
    rating: [],
    priceRange: [0, 100000],
    sort: "",
  });
  const [filterUI, setFilterUI] = useState({ category: true, color: true, rating: true, price: true });
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    setFilters({ keyword: "", category: [], color: [], rating: [], priceRange: [0, 100000], sort: "" });
  };

  const hasFilters =
    filters.category.length || filters.color.length || filters.rating.length || filters.priceRange[1] !== 100000;

  const FilterDrawerContent = (
    <div className="w-full max-w-sm p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
        <IconButton onClick={() => setDrawerOpen(false)}>
          <Close />
        </IconButton>
      </div>

      {/* Category */}
      <div>
        <button onClick={() => toggleGroup("category")} className="flex justify-between items-center w-full font-semibold text-gray-700">
          Category {filterUI.category ? <Remove /> : <Add />}
        </button>
        {filterUI.category && (
          <ul className="mt-3 space-y-2">
            {catLoading
              ? [1, 2].map((i) => <Skeleton key={i} height={24} />)
              : categories.map((cat) => (
                <label key={cat.name} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    value={cat.name}
                    checked={filters.category.includes(cat.name)}
                    onChange={(e) => handleCheckbox(e, "category")}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                  />
                  <span className="text-sm text-gray-800">{cat.name}</span>
                </label>
              ))}
          </ul>
        )}
      </div>

      {/* Color */}
      <div>
        <button onClick={() => toggleGroup("color")} className="flex justify-between items-center w-full font-semibold text-gray-700">
          Color {filterUI.color ? <Remove /> : <Add />}
        </button>
        {filterUI.color && (
          <ul className="mt-3 space-y-2">
            {colorOptions.map((col) => (
              <label key={col.name} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  value={col.name}
                  checked={filters.color.includes(col.name)}
                  onChange={(e) => handleCheckbox(e, "color")}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <div className="w-5 h-5 rounded-full border" style={{ backgroundImage: `url(${col.url})`, backgroundSize: 'cover' }} />
                <span className="text-sm text-gray-800">{col.name}</span>
              </label>
            ))}
          </ul>
        )}
      </div>

      {/* Rating */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-700">Rating</h3>
          <button onClick={() => toggleGroup("rating")} className="text-sm text-blue-600">
            {filterUI.rating ? <Remove /> : <Add />}
          </button>
        </div>

        {filterUI.rating && [5, 4, 3, 2, 1].map((rate) => (
          <label key={rate} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              value={String(rate)}
              checked={filters.rating.includes(String(rate))}
              onChange={(e) => handleCheckbox(e, "rating")}
              className="form-checkbox h-4 w-4 text-indigo-600"
            />
            <div className="flex text-yellow-500">
              {Array(rate).fill(0).map((_, idx) => (<Star key={idx} fontSize="small" />))}
            </div>
          </label>
        ))}
      </div>

      {/* Price */}
      <div>
        <button onClick={() => toggleGroup("price")} className="flex justify-between items-center w-full font-semibold text-gray-700">
          Price {filterUI.price ? <Remove /> : <Add />}
        </button>
        {filterUI.price && (
          <div className="mt-3">
            <input type="range" min="0" max="100000" value={filters.priceRange[1]} onChange={handlePrice} className="w-full" />
            <div className="flex justify-between text-xs text-gray-600">
              <span>₹{filters.priceRange[0]}</span>
              <span>₹{filters.priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>

      <button onClick={clearAllFilters} className="mt-4 w-full py-2 px-4 rounded bg-gray-800 text-white hover:bg-gray-700">
        Clear All Filters
      </button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Our Products – Bloodbuck</title>
        <meta name="description" content="Browse our products with advanced filters." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="w-full h-60 pt-12 bg-cover bg-center" style={{ backgroundImage: `url(${productBanner})` }}>
        <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white uppercase text-center tracking-widest">
            Shop All Products
          </h1>
        </div>
      </div>

      <section className="bg-white pt-10 pb-16 px-4 md:px-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <Breadcrumbs aria-label="breadcrumb">
              <MuiLink component={RouterLink} underline="hover" color="inherit" to="/">
                Home
              </MuiLink>
              <span className="text-gray-500">Products</span>
            </Breadcrumbs>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => setDrawerOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-gray-300 rounded hover:bg-gray-100">
                <Tune className="text-gray-600" fontSize="small" /> Filter
              </button>
              <h3 className="text-gray-500">{products.length} Products</h3>
            </div>

            <div className="flex items-center gap-3">
              <select id="sort" value={filters.sort} onChange={handleSort} className="text-sm border border-gray-300 rounded px-3 py-2">
                <option value="">Featured</option>
                <option value="createdAt">New Arrivals</option>
                <option value="averageRating">Top Rated</option>
                <option value="-price">Price: High to Low</option>
                <option value="price">Price: Low to High</option>
              </select>
            </div>
          </div>

          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.category.map((cat) => (
                <span key={cat} className="bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded-full flex items-center">
                  Category: {cat} <Close className="ml-1 text-xs cursor-pointer" onClick={() => handleCheckbox({ target: { value: cat, checked: false } }, 'category')} />
                </span>
              ))}
              {filters.color.map((col) => (
                <span key={col} className="bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded-full flex items-center">
                  Color: {col} <Close className="ml-1 text-xs cursor-pointer" onClick={() => handleCheckbox({ target: { value: col, checked: false } }, 'color')} />
                </span>
              ))}
              {filters.rating.map((r) => (
                <span key={r} className="bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded-full flex items-center">
                  Rating: {r}+ <Close className="ml-1 text-xs cursor-pointer" onClick={() => handleCheckbox({ target: { value: r, checked: false } }, "rating")} />
                </span>
              ))}
              {filters.priceRange[1] !== 100000 && (
                <span className="bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded-full flex items-center">
                  Price ≤ ₹{filters.priceRange[1]} <Close className="ml-1 text-xs cursor-pointer" onClick={() => setFilters((prev) => ({ ...prev, priceRange: [0, 100000] }))} />
                </span>
              )}
              <button onClick={clearAllFilters} className="text-sm px-4 py-1 rounded-full bg-gray-700 text-white hover:bg-gray-800">
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
      </section>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            top: 0,
            width: { xs: '100%', sm: '380px' },
            height: '100vh',
            zIndex: (theme) => theme.zIndex.appBar + 2,
          },
        }}
        ModalProps={{ keepMounted: true }}
      >
        {FilterDrawerContent}
      </Drawer>
    </>
  );
};

export default Products;

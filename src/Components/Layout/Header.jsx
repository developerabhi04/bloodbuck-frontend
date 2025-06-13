// src/Components/Layout/Header.jsx
import { useState, useEffect, Fragment, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompanyInfo,
} from "../../redux/slices/companyDetailsSlices";
import { fetchWishlistItems } from "../../redux/slices/wishlistSlices";
import { fetchCartItems } from "../../redux/slices/cartSlices";
import { fetchCategories } from "../../redux/slices/categorySlices";
import { fetchBanners } from "../../redux/slices/BannerEventSlices";

import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";

import {
  Search,
  Person,
  Favorite,
  ShoppingBag,
  Face,
  Login,
  Logout,
  PersonAdd,
} from "@mui/icons-material";
import { logout } from "../../redux/slices/userSlices";
import { fetchLiveSearchProducts } from "../../redux/slices/productSlices";
import { toast } from "react-toastify";

import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  'FREE SHIPPING ON ORDERS OVER $50',
  'NEW ARRIVALS UP TO 30% OFF',
  'SIGN UP & GET 10% OFF YOUR FIRST ORDER',
  'LIMITED TIME: BUY 2, GET 1 FREE',
];

const TopNav = ({ showTopNav }) => {
  const [index, setIndex] = useState(0);

  // cycle every 4s
  useEffect(() => {
    if (!showTopNav) return;
    const id = setInterval(
      () => setIndex(i => (i + 1) % messages.length),
      4000
    );
    return () => clearInterval(id);
  }, [showTopNav]);

  if (!showTopNav) return null;

  return (
    <nav className="bg-gray-900 py-2 text-white overflow-hidden">
      <div className="flex justify-center h-6 relative">
        <AnimatePresence exitBeforeEnter>
          <motion.span
            key={index}
            className="text-sm font-medium absolute"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.5 }}
          >
            {messages[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </nav>
  );
};



const IconSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { cartItems = [] } = useSelector((state) => state.shopCart);
  const { liveSearchResults, searchLoading } = useSelector(
    (state) => state.products
  );

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWishlistItems(user.id));
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    setSuggestions(liveSearchResults);
  }, [liveSearchResults]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim())
        dispatch(fetchLiveSearchProducts(searchQuery.trim()));
    }, 400);
    return () => clearTimeout(timer);
  }, [dispatch, searchQuery]);

  useEffect(() => {
    const onClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const handleSuggestionClick = (prod) => {
    navigate(`/product/${prod._id}`);
    setShowSearch(false);
    setSearchQuery("");
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div className="flex items-center space-x-4 md:space-x-6">
      {/* Search */}
      {showSearch ? (
        <div
          ref={searchRef}
          className="absolute top-0 left-0 right-0 z-50 bg-white shadow-lg p-4 flex items-center"
        >
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            placeholder="Search products..."
            className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearchSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-r-lg transition-colors"
          >
            <Search />
          </button>
          <button
            className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => setShowSearch(false)}
          >
            <CloseIcon />
          </button>

          {(searchLoading || suggestions.length) && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg max-h-96 overflow-y-auto z-50">
              {searchLoading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : (
                suggestions.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => handleSuggestionClick(p)}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden mr-3">
                      {p.image && (
                        <img
                          src={p.image.url || p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-gray-700 font-medium">{p.name}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setShowSearch(true)}
          className="text-gray-700 hover:text-blue-600 transition-colors"
          aria-label="Search"
        >
          <Search />
        </button>
      )}

      {/* Profile */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setShowProfile((v) => !v)}
          className="text-gray-700 hover:text-blue-600 transition-colors"
          aria-label="Profile"
        >
          <Person />
        </button>
        {showProfile && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-100">
            <ul className="space-y-1">
              {user ? (
                <>
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfile(false)}
                    >
                      <Face className="mr-2 text-gray-500" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfile(false)}
                    >
                      <ShoppingBag className="mr-2 text-gray-500" />
                      Orders
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <Logout className="mr-2 text-gray-500" />
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/sign-in"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfile(false)}
                    >
                      <Login className="mr-2 text-gray-500" />
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/sign-up"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfile(false)}
                    >
                      <PersonAdd className="mr-2 text-gray-500" />
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Wishlist */}
      <Link
        to="/wishlist"
        className="relative text-gray-700 hover:text-blue-600 transition-colors"
        aria-label="Wishlist"
      >
        <Favorite />
        {wishlistItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {wishlistItems.length}
          </span>
        )}
      </Link>

      {/* Cart */}
      <Link
        to="/cart"
        className="relative text-gray-700 hover:text-blue-600 transition-colors"
        aria-label="Cart"
      >
        <ShoppingBag />
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </Link>
    </div>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.user);
  const { companys } = useSelector((s) => s.company);
  const { categories } = useSelector((s) => s.categories);
  const { banners } = useSelector((s) => s.bannerEvent);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);

  useEffect(() => {
    dispatch(fetchCompanyInfo());
    dispatch(fetchWishlistItems(user?._id));
    dispatch(fetchCartItems(user?._id));
    dispatch(fetchCategories());
    dispatch(fetchBanners());
  }, [dispatch, user?._id]);

  const handleExpand = (catId) => {
    setExpandedCat((prev) => (prev === catId ? null : catId));
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
      <TopNav showTopNav={true} companys={companys} />

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen((prev) => !prev)}
              className="text-gray-700"
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
            >
              {drawerOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}

          {/* Desktop category drawer button */}
          {!isMobile && (
            <button
              onClick={() => setCategoryDrawerOpen(true)}
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Open categories"
            >
              <MenuIcon className="mr-1" />
              <span className="font-medium">Categories</span>
            </button>
          )}

          {/* Logo */}
          <div className="flex-grow flex justify-center md:flex-grow-0">
            <Link to="/" className="flex items-center">
              {companys.map((c) =>
                c.logo[0]?.url ? (
                  <img
                    key={c._id}
                    src={c.logo[0].url}
                    alt={c.name || "Logo"}
                    className="h-12 object-contain"
                  />
                ) : null
              )}
            </Link>
          </div>

          {/* Right‐hand icons */}
          <IconSection />
        </div>
      </div>

      {/* Desktop Category Drawer */}
      <Drawer
        anchor="left"
        open={categoryDrawerOpen}
        onClose={() => setCategoryDrawerOpen(false)}
        PaperProps={{
          sx: {
            top: 0,
            width: "450px",
            height: "100vh",
            zIndex: (theme) => theme.zIndex.appBar + 2,
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <div className="h-full flex flex-col bg-white">
          <div className="flex justify-end p-3 bg-gray-900">
            <IconButton
              onClick={() => setCategoryDrawerOpen(false)}
              aria-label="Close categories"
              className="text-white"
            >
              <CloseIcon />
            </IconButton>
          </div>

          <List className="flex-grow overflow-y-auto">
            {categories.map((cat, index) => (
              <Fragment key={cat._id}>
                <ListItem
                  button
                  onClick={() => handleExpand(cat._id)}
                  className={`px-6 py-4 ${index !== categories.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <ListItemText
                    primary={cat.name}
                    primaryTypographyProps={{
                      className: "text-xl font-medium uppercase tracking-wide text-gray-900"
                    }}
                  />
                  {expandedCat === cat._id ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse
                  in={expandedCat === cat._id}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {cat.subcategories.map((sub) => (
                      <ListItem
                        key={sub._id}
                        button
                        component={Link}
                        to={`/products?subcategory=${sub._id}`}
                        onClick={() => setCategoryDrawerOpen(false)}
                        className="pl-12 py-3 hover:bg-gray-50"
                      >
                        <ListItemText
                          primary={sub.name}
                          primaryTypographyProps={{
                            className: "text-gray-700 uppercase text-sm"
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Fragment>
            ))}
          </List>

          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-center space-x-4 mb-4">
              <Link
                to={companys[0]?.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Facebook fontSize="large" />
              </Link>
              <Link
                to={companys[0]?.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                <Instagram fontSize="large" />
              </Link>
              <Link
                to={companys[0]?.linkdin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black transition-colors"
              >
                <Twitter fontSize="large" />
              </Link>
            </div>

            <div className="text-center">
              {companys.map((c) =>
                c.logo[0]?.url ? (
                  <img
                    key={c._id}
                    src={c.logo[0].url}
                    alt={c.name || "Logo"}
                    className="h-16 mx-auto object-contain"
                  />
                ) : null
              )}
            </div>
          </div>
        </div>
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            top: 0,
            width: "80%",
            maxWidth: "320px",
            height: "100vh",
            zIndex: (theme) => theme.zIndex.appBar + 1,
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <div className="h-full flex flex-col bg-white">
          <div className="flex justify-end p-3 bg-gray-900">
            <IconButton
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="text-white"
            >
              <CloseIcon />
            </IconButton>
          </div>

          <List className="flex-grow overflow-y-auto">
            {categories.map((cat) => (
              <Fragment key={cat._id}>
                <ListItem
                  button
                  onClick={() => handleExpand(cat._id)}
                  className="px-6 py-4 border-b border-gray-100"
                >
                  <ListItemText
                    primary={cat.name}
                    primaryTypographyProps={{
                      className: "text-gray-900 font-medium"
                    }}
                  />
                  {expandedCat === cat._id ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse
                  in={expandedCat === cat._id}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {cat.subcategories.map((sub) => (
                      <ListItem
                        key={sub._id}
                        button
                        component={Link}
                        to={`/products?subcategory=${sub._id}`}
                        onClick={() => setDrawerOpen(false)}
                        className="pl-12 py-3 hover:bg-gray-50"
                      >
                        <ListItemText
                          primary={sub.name}
                          primaryTypographyProps={{
                            className: "text-gray-700 text-sm"
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Fragment>
            ))}

            {/* Events */}
            <div className="px-6 py-4">
              <div className="space-y-2">
                {banners.map((evt) => (
                  <Link
                    key={evt._id}
                    to="/event-campaign"
                    onClick={() => setDrawerOpen(false)}
                    className="text-red-600 hover:text-red-800 font-medium block transition-colors"
                  >
                    {evt.title}
                  </Link>
                ))}
              </div>
            </div>
          </List>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
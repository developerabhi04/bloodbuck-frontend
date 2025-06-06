// src/Components/Layout/Header.jsx
import { useState, useEffect, Fragment } from "react";
import { Link, Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompanyInfo,
} from "../../redux/slices/companyDetailsSlices";
import { fetchWishlistItems } from "../../redux/slices/wishlistSlices";
import { fetchCartItems } from "../../redux/slices/cartSlices";
import { fetchCategories } from "../../redux/slices/categorySlices";
import { fetchBanners } from "../../redux/slices/BannerEventSlices";
import IconSection from "./HeaderIconSection";

import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Facebook, Instagram, X } from "@mui/icons-material";
import TopNav from "./TopNav";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.user);
  const { companys } = useSelector((s) => s.company);
  const { categories } = useSelector((s) => s.categories);
  const { banners } = useSelector((s) => s.bannerEvent);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false); // mobile menu
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false); // desktop category drawer
  const [expandedCat, setExpandedCat] = useState(null); // for subcategory expand

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
    <header>
      <TopNav showTopNav={true} companys={companys} />
      <div className="Header">
        <div className="Header-container">


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
            <Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton
                  onClick={() => setCategoryDrawerOpen(false)}
                  aria-label="Close categories"
                >
                  <CloseIcon
                    style={{
                      fontSize: "34px",
                      color: "#fff",
                      cursor: "pointer",
                      backgroundColor: "black",
                      padding: "1px",
                      transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </IconButton>
              </Box>
              <List>
                {categories.map((cat, index) => (
                  <Fragment key={cat._id}>
                    <ListItem button onClick={() => handleExpand(cat._id)}
                      sx={{
                        width: "400px",
                        margin: "0 auto",
                        padding: "20px",
                        borderBottom: index === categories.length - 1 ? "none" : "1px solid #e0e0e0",
                        color: "#2c2d2c",
                        textDecoration: "none",
                        textTransform: "uppercase",
                        fontSize: "40px",
                        transition: "border-color 0.3s ease",
                        "&:hover": {
                          borderBottomColor: "#999", // subtle hover color change
                        },

                      }}>

                      <ListItemText primary={cat.name}

                        sx={{
                          fontFamily: "sans-serif"
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
                            // sx={{ pl: 8 }}
                            component={Link}
                            to={`/products?subcategory=${sub._id}`}
                            onClick={() => setCategoryDrawerOpen(false)}

                            sx={{
                              pl: 8,
                              paddingTop: "15px",
                              color: "#fff",
                              textDecoration: "none",

                            }}
                          >
                            <ListItemText
                              sx={{
                                color: "#6e6a6a",
                                textDecoration: "none",
                                fontFamily: "sans-serif ",
                                textTransform: "uppercase"
                              }}
                              primary={sub.name}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </Fragment>
                ))}
              </List>
            </Box>

            <Box sx={{ mt: "auto", padding: 3, textAlign: "center" }}>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 1 }}>
                <Link to={companys[0]?.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook sx={{ fontSize: 30, color: "#3b5998" }} />
                </Link>
                <Link to={companys[0]?.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram sx={{
                    fontSize: 30,
                    color: "#E1306C",
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: "#c2185b",
                    },
                  }} />
                </Link>
                <Link to={companys[0]?.linkdin} target="_blank" rel="noopener noreferrer">
                  <X sx={{ fontSize: 30, color: "#000000" }} />
                </Link>
              </Box>

              <Box sx={{ fontSize: "14px", color: "#888" }}>
                {companys.map((c) =>
                  c.logo[0]?.url ? (
                    <img
                      key={c._id}
                      src={c.logo[0].url}
                      alt={c.name || "Logo"}
                      style={{
                        width: "100px",
                        height: "auto",
                        marginRight: "10px",
                      }}
                    />
                  ) : null
                )}
              </Box>
            </Box>
          </Drawer>

          {/* Desktop category drawer button */}
          {!isMobile && (
            <nav className="middle">
              <IconButton
                onClick={() => setCategoryDrawerOpen(true)}
                sx={{ ml: 1 }}
                aria-label="Open categories"
              >
                <MenuIcon sx={{ fontSize: "32px", color: "black", fontWeight: "bold" }} />
              </IconButton>
            </nav>
          )}



          {/* Mobile Drawer */}
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                top: 0,
                height: "100vh",
                zIndex: (theme) => theme.zIndex.appBar + 1,
              },
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <List>
                {categories.map((cat) => (
                  <Fragment key={cat._id}>
                    <ListItem button onClick={() => handleExpand(cat._id)}>
                      <ListItemText primary={cat.name} />
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
                            sx={{ pl: 4 }}
                            component={Link}
                            to={`/products?subcategory=${sub._id}`}
                            onClick={() => setDrawerOpen(false)}
                          >
                            <ListItemText
                              sx={{ color: "#514c4c", textDecoration: "none" }}
                              primary={sub.name}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </Fragment>
                ))}

                {/* Events */}
                <ListItem>
                  <ListItemText
                    primary={
                      <Box>
                        {banners.map((evt) => (
                          <MuiLink
                            key={evt._id}
                            component={RouterLink}
                            to="/event-campaign"
                            onClick={() => setDrawerOpen(false)}
                            sx={{
                              color: "#c8102e",
                              textDecoration: "none",
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            {evt.title}
                          </MuiLink>
                        ))}
                      </Box>
                    }
                  />
                </ListItem>
              </List>
            </Box>
          </Drawer>

          {/* Mobile drawer menu button */}
          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen((prev) => !prev)}
              sx={{ ml: 1 }}
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
            >
              {drawerOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}




          {/* Logo */}
          <div className="logo">
            <Link to="/">
              {companys.map((c) =>
                c.logo[0]?.url ? (
                  <img
                    key={c._id}
                    src={c.logo[0].url}
                    alt={c.name || "Logo"}
                  />
                ) : null
              )}
            </Link>
          </div>

          {/* Right‐hand icons */}
          <IconSection />


        </div>



      </div>
    </header>
  );
};

export default Header;

import { useState, useEffect } from "react";
import Slider from "react-slick";
import {
  ArrowBackIos,
  ArrowForwardIos,
  ArrowLeft,
  ArrowRight,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchNewArrivalProducts } from "../../../redux/slices/productSlices";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";

// Custom Arrows for the main slider
const NextArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 -right-12 transform -translate-y-1/2 bg-white border-none p-2 z-50 rounded-full cursor-pointer shadow-md transition-all hover:bg-gray-900 hover:text-white"
    onClick={onClick}
  >
    <ArrowRight />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 -left-12 transform -translate-y-1/2 bg-white border-none p-2 z-50 rounded-full cursor-pointer shadow-md transition-all hover:bg-gray-900 hover:text-white"
    onClick={onClick}
  >
    <ArrowLeft />
  </button>
);

// Custom Arrows for the inner color slider
const CustomNextArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-transparent border-none cursor-pointer z-10 text-gray-400 hover:text-red-500"
    onClick={onClick}
  >
    <ArrowForwardIos fontSize="small" />
  </button>
);

const CustomPrevArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 -left-3 transform -translate-y-1/2 bg-transparent border-none cursor-pointer z-10 text-gray-400 hover:text-red-500"
    onClick={onClick}
  >
    <ArrowBackIos fontSize="small" />
  </button>
);

const NewArrivalProduct = () => {
  const [selectedVariants, setSelectedVariants] = useState({});
  const [isHovering, setIsHovering] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error, selectedColor } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchNewArrivalProducts(selectedColor));
  }, [dispatch, selectedColor]);

  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Skeleton
              variant="rectangular"
              className="w-full h-64 sm:h-72 md:h-80"
            />
            <div className="p-4">
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="40%" />
            </div>
          </div>
        ))}
      </div>
    );

  if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;

  // Settings for the main product slider
  const mainSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          arrows: false
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          arrows: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          arrows: false
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          arrows: false
        }
      },
    ],
  };

  // Settings for the inner color slider
  const colorSliderSettings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  // Navigate to ProductDetails
  const navigateLink = (productId, image) => {
    window.scrollTo(0, 0);
    navigate(
      `/product-details/${productId}?selectedImage=${encodeURIComponent(image)}`
    );
  };

  // Helper: Return the default image
  const getDefaultImage = (product) => {
    return product.colors &&
      product.colors.length > 0 &&
      product.colors[0].photos &&
      product.colors[0].photos.length > 0
      ? product.colors[0].photos[0].url
      : "https://via.placeholder.com/300";
  };

  // Helper: Return the image for a variant
  const getVariantImage = (color) => {
    return color.photos && color.photos[0]?.url
      ? color.photos[0].url
      : "https://via.placeholder.com/50";
  };

  // When a color swatch is hovered
  const handleColorHover = (productId, colorVariant) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: colorVariant,
    }));
  };

  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* <h1 className="text-3xl md:text-4xl text-center mb-16 uppercase tracking-wider font-sans"> */}
        <h1 className="text-4xl md:text-3xl text-center sm:text-2xl font-normal text-gray-900 uppercase tracking-[5px] font-sans mb-12">
          What’s new this week.
        </h1>

        <div className="relative px-2">
          <Slider {...mainSliderSettings}>
            {products.map((product) => {
              const defaultImg = getDefaultImage(product);
              // Use the selected variant if one exists, otherwise the default image.
              const variant = selectedVariants[product._id] || {
                photos: [{ url: defaultImg }],
              };
              const mainImage = variant.photos[0].url;
              return (
                <div
                  key={product._id}
                  className="px-2 focus:outline-none"
                >
                  <div
                    className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
                    onMouseEnter={() => setIsHovering(product._id)}
                    onMouseLeave={() => setIsHovering(null)}
                  >
                    {/* Main Product Image */}
                    <div
                      className="relative h-64 sm:h-72 md:h-80 overflow-hidden cursor-pointer group"
                      onClick={() => navigateLink(product._id, mainImage)}
                    >
                      <img
                        src={mainImage}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-all duration-500 ${isHovering === product._id ? 'scale-105' : ''
                          }`}
                      />

                      {/* Hover Effect Overlay */}
                      <div className={`absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center transition-all duration-300 ${isHovering === product._id ? 'bg-opacity-20' : ''
                        }`}>
                        <span className="text-white text-lg font-bold opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                          View Product
                        </span>
                      </div>
                    </div>

                    {/* Inner Color Slider */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="py-3 px-4">
                        <Slider {...colorSliderSettings}>
                          {product.colors.map((color, index) => {
                            const variantImg = getVariantImage(color);
                            return (
                              <div key={index} className="px-1">
                                <div className="flex justify-center">
                                  <img
                                    src={color.colorImage?.url || variantImg}
                                    alt={color.colorName || `Color ${index + 1}`}
                                    className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer transition-transform duration-200 hover:scale-110 hover:border-gray-400"
                                    onMouseEnter={() => handleColorHover(product._id, color)}
                                    onClick={() => navigateLink(product._id, variantImg)}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </Slider>
                      </div>
                    )}

                    {/* Product Details */}
                    <div className="p-4 flex justify-between items-center">
                      <h3 className="text-gray-800 font-medium truncate max-w-[65%]">
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold text-red-600">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>

        <div className="flex justify-center mt-10">
          <button
            className="px-8 py-3 border-2 border-gray-400 tracking-[3px] bg-white text-black  rounded-lg transition-all font-sans space-x-4 duration-300 hover:bg-gray-800  hover:text-white"
            onClick={() => navigate("/products")}
          >
            SHOP {"WHAT'S"} NEW
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalProduct;
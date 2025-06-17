import { useState, useEffect, useRef } from "react";
import {
  Add,
  Remove,
  FavoriteBorder,
  ExpandMore,
  ExpandLess,
  Home,
} from "@mui/icons-material";
import { Rating, Skeleton, Stack } from "@mui/material";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSingleProduct,
  fetchSimilarProducts,
} from "../../redux/slices/productSlices";
import { addToCart } from "../../redux/slices/cartSlices";
import {
  addToWishlist,
  fetchWishlistItems,
} from "../../redux/slices/wishlistSlices";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import SimilarProduct from "./SimilarProduct";
import LockIcon from "@mui/icons-material/Lock";
import ReplayIcon from "@mui/icons-material/Replay";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";




function ReviewItem({ review }) {
  const [expanded, setExpanded] = useState(false);
  const threshold = 150;
  const fullText = review.comment;
  const text = !expanded && fullText.length > threshold
    ? fullText.slice(0, threshold) + "..."
    : fullText;

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6 border">
      <div className="flex items-center mb-3">
        <img
          src={review?.user?.avatar[0]?.url}
          alt={review?.user?.name || "User"}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-600 mr-4"
        />
        <div>
          <p className="font-semibold text-gray-800">{review.user?.name || "Anonymous"}</p>
          <Rating value={review.rating} readOnly size="small" precision={0.5} />
        </div>
      </div>
      <p className="text-gray-700 mb-2">{text}</p>
      {fullText.length > threshold && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-600 text-sm font-medium hover:underline"
        >
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}
      <p className="text-sm text-gray-500 text-right mt-3">
        {new Date(review.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const zoomRef = useRef(null);
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });


  const { product, loading, error } = useSelector((s) => s.products);
  const { wishlistItems } = useSelector((s) => s.wishlist);
  const { cartItems } = useSelector((s) => s.shopCart);
  const { user } = useSelector((s) => s.user);

  const [selectedColor, setSelectedColor] = useState("");
  const [thumbIndex, setThumbIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [showDesc, setShowDesc] = useState(false);

  useEffect(() => {
    dispatch(fetchSingleProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.colors?.length) {
      setSelectedColor(product.colors[0].colorName);
      dispatch(fetchSimilarProducts(product._id));
    }
  }, [dispatch, product]);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("selectedImage");
    if (q && product?.colors) {
      product.colors.forEach((c) => {
        const idx = c.photos.findIndex((p) => p.url === q);
        if (idx > -1) setThumbIndex(idx);
      });
    }
  }, [location.search, product]);

  if (loading) return (
    <div className="max-w-7xl mx-auto p-6">
      <Stack spacing={2}>{Array(6).fill(0).map((_, i) => <Skeleton key={i} height={300} />)}</Stack>
    </div>
  );

  if (error) return <p className="text-center p-8 text-red-500">Error loading product.</p>;
  if (!product) return null;

  const variant = product.colors.find((c) => c.colorName === selectedColor);
  const mainImg = variant?.photos?.[thumbIndex]?.url || variant?.photos?.[0]?.url;

  const inCart = cartItems.some((i) => i.productId === product._id && i.selectedColorName === selectedColor);
  const inWish = wishlistItems.some((i) => i.productId === product._id && i.selectedColorName === selectedColor);

  const addCart = () => {
    if (!user) return navigate("/sign-in", { state: { redirectTo: "/cart" } });
    if (!selectedColor) return toast.error("Please select a color!");
    if (inCart) return toast.info("Already in cart");
    dispatch(addToCart({ userId: user._id, productId: product._id, quantity: qty, colorName: selectedColor }))
      .unwrap()
      .then(() => toast.success("Added to cart"))
      .catch((e) => toast.error(e.message));
  };


  const addWish = () => {
    if (!user) return toast.error("Please log in first!");
    if (!selectedColor) return toast.error("Please select a color!");
    if (inWish) return toast.info("Already in wishlist");
    dispatch(addToWishlist({ userId: user._id, productId: product._id, colorName: selectedColor }))
      .unwrap()
      .then(() => {
        toast.success("Added to wishlist");
        dispatch(fetchWishlistItems(user._id));
      })
      .catch((e) => toast.error(e.message));
  };



  const handleZoom = (e) => {
    const rect = zoomRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    setZoomStyle({
      display: "block",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${mainImg})`,
      backgroundSize: "200%", // Zoom level
      backgroundPosition: `${xPercent}% ${yPercent}%`,
      zIndex: 30,
    });
  };


  const features = [
    { Icon: LockIcon, title: "Secure Transaction" },
    { Icon: ReplayIcon, title: "Easy 7 Days Return" },
    { Icon: LocalShippingIcon, title: "Delivery Guaranteed" },
    { Icon: TrackChangesIcon, title: "Easy Order Tracking" },
  ];


  return (
    <>
      <Helmet>
        <title>{product.name} | BloodBuck</title>
        <meta name="description" content={product.description.slice(0, 160)} />
      </Helmet>




      <div className=" py-28 pt-18 px-4 sm:px-6 lg:px-12">
        {/* Breadcrumb */}
        <div className="max-w-7xl  mx-auto mb-10">
          <nav className="text-xs sm:text-sm text-gray-600 bg-white px-4 py-3  flex flex-wrap gap-1 items-center">
            <Home fontSize="small" className="text-gray-500" />
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to={`/products?category=${product.category?.name}`} className="hover:text-gray-900">
              {product.category?.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium  truncate max-w-[150px] sm:max-w-none">{product.name}</span>
          </nav>
        </div>


        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Section */}

          <div>
            <div
              className="relative rounded-lg overflow-hidden shadow-lg group"
              onMouseMove={(e) => handleZoom(e)}
              onMouseLeave={() => setZoomStyle({ display: "none" })}
              ref={zoomRef}
            >


              {/* Main Image */}
              <img
                src={mainImg}
                alt={product.name}
                className="w-full h-auto max-h-[500px] object-contain rounded-lg"
              />

              {/* Zoom Overlay */}
              <div
                className="absolute pointer-events-none bg-no-repeat bg-contain transition-all duration-200 ease-in-out border rounded-md shadow-lg"
                style={zoomStyle}
              />

            </div>
            <div className="mt-4 flex flex-wrap gap-3 ">
              {variant?.photos.map((p, i) => (
                <img
                  key={i}
                  src={p.url}
                  onClick={() => setThumbIndex(i)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border-2 cursor-pointer transition-transform ${thumbIndex === i ? "border-gray-800 scale-105" : "border-gray-300"}`}
                />
              ))}
            </div>

          </div>


          {/* <div>
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <button onClick={addWish} className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-100">
                <FavoriteBorder className={`text-gray-500 ${inWish && "opacity-50"}`} />
              </button>
              <img src={mainImg} alt={product.name} className="w-full h-auto max-h-[500px] object-contain rounded-lg" />
            </div>
            <div className="mt-4 flex flex-wrap gap-3 ">
              {variant?.photos.map((p, i) => (
                <img
                  key={i}
                  src={p.url}
                  onClick={() => setThumbIndex(i)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border-2 cursor-pointer transition-transform ${thumbIndex === i ? "border-gray-800 scale-105" : "border-gray-300"}`}
                />
              ))}
            </div>
          </div> */}

          {/* Product Info Section */}
          <div className="space-y-5">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center space-x-2 text-sm">
              <Rating value={product.averageRating} readOnly size="small" />
              <span className="text-gray-600">({product.reviews.length} reviews)</span>
            </div>
            <p className="text-gray-700 text-2xl font-semibold">₹{product.price.toFixed(2)}</p>


            {/* Color picker */}
            <div>
              <p className="font-medium mb-2 flex items-center">
                <span>Choose Color:</span>
                {selectedColor && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-sm">
                    {selectedColor}
                  </span>
                )}
              </p>

              <div className="flex space-x-6">
                {product.colors.map((c, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <button
                      onClick={() => {
                        setSelectedColor(c.colorName);
                        setThumbIndex(0);
                      }}
                      className={`w-10 h-10 rounded-full border-2 overflow-hidden transition-transform  ${selectedColor === c.colorName
                        ? "border-blue-600 scale-110"
                        : "border-gray-300"}`}
                    >
                      <img
                        src={c.colorImage?.url || c.photos?.[0]?.url}
                        alt={c.colorName}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    <span className="mt-1 text-sm text-gray-700">{c.colorName}</span>
                  </div>
                ))}
              </div>
            </div>



            <div className="text-[1px] grid grid-cols-2 pb-8 pt-8 md:grid-cols-4 gap-6">
              {features.map(({ Icon, title }) => (
                <div
                  key={title}
                  className="flex flex-col items-center text-center p-1 bg-white rounded-xl  hover:shadow-lg transition"
                >
                  <Icon className="text-gray-600 text-4xl mb-2 " />
                  <span className="mt-2 text-sm text-[9px] font-medium text-gray-700">
                    {title}
                  </span>
                </div>
              ))}
            </div>


            {/* Quantity & Cart */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1 bg-gray-100 hover:bg-gray-200">
                  <Remove />
                </button>
                <span className="px-4 py-1">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200">
                  <Add />
                </button>
              </div>

              <button onClick={addCart} disabled={inCart}
                className={`px-6 py-2 rounded text-white font-medium ${inCart ? "bg-gray-400 cursor-not-allowed" : "bg-gray-600 hover:bg-gray-700"}`}>
                {inCart ? "In Cart" : "Add to Cart"}
              </button>

              <button
                onClick={addWish}
                className=" p-2 rounded-full shadow hover:bg-gray-50 transition"
              >
                <FavoriteBorder
                  className={`text-gray-600 ${inWish && "opacity-50"}`}
                />
              </button>
            </div>



            {/* Toggle Description */}
            <div className="border-t pt-4">
              <button onClick={() => setShowDesc(!showDesc)} className="flex justify-between w-full text-sm font-medium text-gray-700">
                <span>Description</span>
                {showDesc ? <ExpandLess /> : <ExpandMore />}
              </button>
              {showDesc && <div className="mt-3 text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: product.description }} />}
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-20">
          <SimilarProduct />
        </div>

        {/* Customer Reviews */}
        <div className="max-w-5xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          {product.reviews?.length ? (
            product.reviews.map((r) => <ReviewItem key={r._id} review={r} />)
          ) : (
            <p className="text-center text-gray-500">No reviews available.</p>
          )}
        </div>
      </div>
    </>
  );
}
// src/components/ProductDetails.jsx
import { useState, useEffect } from "react";
import { Add, FavoriteBorder, Remove } from "@mui/icons-material";
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
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="flex items-center mb-4">
        <img
          src={review.user?.avatar?.[0]?.url || "/default-user.png"}
          alt={review.user?.name || "User"}
          className="w-12 h-12 rounded-full object-cover border-2 border-red-600 mr-4"
        />
        <div>
          <p className="font-semibold text-gray-800">
            {review.user?.name || "Anonymous"}
          </p>
          <Rating value={review.rating} readOnly size="small" precision={0.5} />
        </div>
      </div>
      <p className="text-gray-700 mb-2">{text}</p>
      {fullText.length > threshold && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-red-600 text-sm font-medium hover:underline"
        >
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}
      <p className="text-sm text-gray-500 text-right mt-4">
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

  if (loading)
    return (
      <div className="max-w-7xl mx-auto p-8">
        <Stack spacing={2}>
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} height={300} />
            ))}
        </Stack>
      </div>
    );
  if (error)
    return (
      <p className="text-center p-8 text-red-500">
        Error loading product.
      </p>
    );
  if (!product) return null;

  const variant = product.colors.find((c) => c.colorName === selectedColor);
  const mainImg =
    variant?.photos?.[thumbIndex]?.url || variant?.photos?.[0]?.url;

  const inCart = cartItems.some(
    (i) => i.productId === product._id && i.selectedColorName === selectedColor
  );
  const inWish = wishlistItems.some(
    (i) => i.productId === product._id && i.selectedColorName === selectedColor
  );

  const addCart = () => {
    // if not authenticated, send them to sign-in and remember to come back here
    if (!user) {
      return navigate("/sign-in", {
        state: { redirectTo: "/cart" }
      });
    }
    if (!selectedColor) return toast.error("Please select a color!");
    if (inCart) return toast.info("Already in cart");
    dispatch(
      addToCart({
        userId: user._id,
        productId: product._id,
        quantity: qty,
        colorName: selectedColor,
      })
    )
      .unwrap()
      .then(() => toast.success("Added to cart"))
      .catch((e) => toast.error(e.message));
  };

  const addWish = () => {
    if (!user) return toast.error("Please log in first!");
    if (!selectedColor) return toast.error("Please select a color!");
    if (inWish) return toast.info("Already in wishlist");
    dispatch(
      addToWishlist({
        userId: user._id,
        productId: product._id,
        colorName: selectedColor,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Added to wishlist");
        dispatch(fetchWishlistItems(user._id));
      })
      .catch((e) => toast.error(e.message));
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
        <title>{product.name} | Your Store</title>
        <meta
          name="description"
          content={product.description.slice(0, 160)}
        />
      </Helmet>

      <section className="bg-gray-50 py-32 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-shrink-0 flex space-x-4 overflow-x-auto lg:flex-col lg:space-x-0 lg:space-y-4">
              {variant?.photos.map((p, i) => (
                <img
                  key={i}
                  src={p.url}
                  onClick={() => setThumbIndex(i)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer transition-transform ${thumbIndex === i
                    ? "ring-2 ring-red-600 scale-105"
                    : "opacity-70 hover:opacity-100"
                    }`}
                />
              ))}
            </div>
            <div className="flex-1">
              <div className="relative">
                <button
                  onClick={addWish}
                  className="absolute right-4 top-4 bg-white p-2 rounded-full shadow hover:bg-red-50 transition"
                >
                  <FavoriteBorder
                    className={`text-red-600 ${inWish && "opacity-50"}`}
                  />
                </button>
                <img
                  src={mainImg}
                  alt={product.name}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">

            <nav
              className="text-sm text-gray-600 mb-4"
              aria-label="Breadcrumb"
            >
              <ol className="list-none p-0 inline-flex">
                <li className="flex items-center">
                  <Link to="/" className="hover:text-gray-800">
                    Home
                  </Link>
                  <span className="mx-2">/</span>
                </li>
                <li className="flex items-center">
                  <Link
                    to={`/products?category=${product.category?._id}`}
                    className="hover:text-gray-800"
                  >
                    {product.category?.name}
                  </Link>
                  <span className="mx-2">/</span>
                </li>
                <li className="flex items-center text-gray-500">
                  <span>{product.name}</span>
                </li>
              </ol>
            </nav>


            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

            <div className="flex items-center space-x-3">
              <Rating value={product.ratings} readOnly size="small" />
              <span className="text-gray-600">
                ({product.numOfReviews} Reviews)
              </span>
            </div>

            <p className="text-2xl font-semibold text-red-600">
              ₹{product.price.toFixed(2)}
            </p>


            {/* Color picker */}
            <div>
              <p className="font-medium mb-2 flex items-center">
                <span>Choose Color:</span>
                {selectedColor && (
                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded text-sm">
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
                          ? "border-red-600 scale-110"
                          : "border-gray-300"}
          `}
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


            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {features.map(({ Icon, title }) => (
                <div
                  key={title}
                  className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow hover:shadow-lg transition"
                >
                  <Icon className="text-indigo-600 text-4xl mb-2" />
                  <span className="mt-2 text-sm font-medium text-gray-700">
                    {title}
                  </span>
                </div>
              ))}
            </div>


            {/* Quantity + Actions */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  <Remove />
                </button>
                <span className="px-4">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  <Add />
                </button>
              </div>
              <button
                onClick={addCart}
                disabled={inCart}
                className={`px-6 py-2 rounded-md text-white ${inCart
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
                  } transition`}
              >
                {inCart ? "In Cart" : "Add to Cart"}
              </button>
            </div>




            {/* Description Accordion */}
            <div className="border-t pt-4">
              <button
                onClick={() => setShowDesc(!showDesc)}
                className="flex justify-between w-full text-left font-medium text-gray-800"
              >
                <span>Description</span>
                {showDesc ? <Remove /> : <Add />}
              </button>
              {showDesc && (
                <div
                  className="prose max-w-none mt-3 text-gray-700"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-16">
          <SimilarProduct />
        </div>

        {/* Customer Reviews */}
        <section className="max-w-7xl mx-auto px-4 lg:px-16 mt-16">
          <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
          {product.reviews?.length ? (
            product.reviews.map((r) => (
              <ReviewItem key={r._id} review={r} />
            ))
          ) : (
            <p className="text-center text-gray-500">No reviews available.</p>
          )}
        </section>
      </section>
    </>
  );
}

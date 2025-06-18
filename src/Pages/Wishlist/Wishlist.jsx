// src/pages/Wishlist.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlistItems,
  moveToCart,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { wishlistItems, isLoading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlistItems(user._id));
    }
  }, [dispatch, user]);

  const handleRemoveFromWishlist = async (
    productId,
    sizes,
    seamSizes,
    colorName
  ) => {
    try {
      await dispatch(
        removeFromWishlist({ userId: user._id, productId, sizes, seamSizes, colorName })
      ).unwrap();
      toast.success("Item removed from wishlist!");
    } catch (error) {
      toast.error(error?.message || "Failed to remove item from wishlist");
    }
  };

  const handleMoveToCart = async (item) => {
    if (!user) {
      toast.error("Please log in to move items to your cart.");
      return;
    }

    try {
      await dispatch(
        moveToCart({
          userId: user._id,
          productId: item.productId,
          sizes: item.selectedSize || null,
          seamSizes: item.selectedSeamSize || null,
          colorName: item.selectedColorName,
        })
      ).unwrap();

      toast.success("Item moved to cart successfully!");
    } catch (error) {
      toast.error(error?.message || "Failed to move item to cart.");
    }
  };

  const navigateLink = (id) => {
    window.scrollTo(0, 0);
    navigate(`/product-details/${id}`);
  };

  return (
    <>
      <Helmet>
        <title>My Wishlist | Bloodbuck</title>
        <meta
          name="description"
          content="View and manage your wishlist items. Move items to cart or remove them at any time."
        />
      </Helmet>

      <section className="min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-100 py-36 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Wishlist</h1>
            {wishlistItems.length > 0 && (
              <span className="text-sm sm:text-base text-gray-600 text-center sm:text-right">
                You have {wishlistItems.length} item(s) saved
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="animate-pulse bg-white rounded-3xl p-6 shadow-md h-56" />
              ))}
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 mb-4">Your wishlist is empty.</p>
              <button
                onClick={() => navigate("/products")}
                className="px-6 py-3 bg-black text-white text-lg font-medium rounded-full hover:bg-gray-800 shadow-lg"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistItems.map((item) => (
                <div
                  key={`₹{item.productId}-₹{item.selectedColorName}`}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all p-6 flex flex-col relative overflow-hidden border border-gray-200"
                >
                  <div
                    className="relative w-full rounded-2xl overflow-hidden cursor-pointer"
                    onClick={() => navigateLink(item.productId)}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                      ₹{item.price}.00
                    </div>
                  </div>

                  <div className="flex-1 mt-4 space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900 truncate">{item.name}</h3>
                    <div className="text-sm text-gray-500 space-y-1">
                      {item.selectedColorName && <p>Color: {item.selectedColorName}</p>}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-2">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="w-full py-2 bg-gradient-to-r from-gray-500 to-gray-900 hover:from-gray-600 hover:to-gray-700 text-white rounded-full font-semibold transition-all shadow-md"
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={() =>
                        handleRemoveFromWishlist(
                          item.productId,
                          item.selectedColorName
                        )
                      }
                      className="w-full py-2 bg-gradient-to-r from-red-500 to-red-800 hover:from-red-600 hover:to-red-700 text-white rounded-full font-semibold transition-all shadow-md"
                    >
                      Remove Item
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Wishlist;

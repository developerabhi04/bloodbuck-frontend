import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../redux/slices/orderSlices";
import { Helmet } from "react-helmet-async";

const Order = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);

  // track which card is expanded
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // SEO metadata
  const pageTitle = "My Orders | Your Store";
  const pageDescription =
    "Track and review your past orders at Your Store. View order status, details, and more.";
  const pageUrl = window.location.href;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${window.location.origin}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "My Orders",
        item: pageUrl,
      },
    ],
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Orders…</title>
        </Helmet>
        <div className="p-8 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600">
        Error loading orders: {error}
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <section className="min-h-screen bg-gray-50 py-32 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-gray-800">
              My Orders
            </h1>
            <p className="mt-2 text-gray-600">
              Track your past orders and view their details below.
            </p>
          </header>

          {orders.length === 0 ? (
            <div className="text-center text-gray-500">
              No orders found.
            </div>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => {
                const isOpen = expandedId === order._id;
                return (
                  <li
                    key={order._id}
                    className="bg-white rounded-lg shadow overflow-hidden transition-shadow hover:shadow-lg"
                  >
                    {/* Order Summary */}
                    <button
                      onClick={() => toggleExpand(order._id)}
                      className="w-full flex items-center justify-between px-6 py-4 focus:outline-none"
                    >
                      <div className="text-left">
                        <h2 className="text-lg font-semibold text-gray-800">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h2>
                        <p className="text-gray-500 text-sm">
                          Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" }
                          )}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "Processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {order.status}
                        </span>
                        <svg
                          className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>

                    {/* Expandable Details */}
                    <div
                      className={`px-6 pb-6 overflow-hidden transition-max-height duration-300 ${isOpen ? "max-h-screen" : "max-h-0"
                        }`}
                    >
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                          {order.cartItems.map((item) => (
                            <div
                              key={item.productId}
                              className="flex items-center space-x-4"
                            >
                              <img
                                src={
                                  item.imageUrl ||
                                  "https://via.placeholder.com/80"
                                }
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-800">
                                  {item.name}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                  Qty:{" "}
                                  {item.quantity}
                                </p>
                              </div>
                              <p className="font-semibold text-gray-800">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-600">Subtotal</p>
                            <p className="font-semibold text-gray-800">
                              ₹{order.subtotal.toFixed(2)}
                            </p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-600">Tax</p>
                            <p className="font-semibold text-gray-800">
                              ₹{order.tax.toFixed(2)}
                            </p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-600">Total</p>
                            <p className="font-semibold text-gray-800">
                              ₹{order.total.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              navigate(`/orders-details/${order._id}`)
                            }
                            className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
                          >
                            View Full Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  );
};

export default Order;

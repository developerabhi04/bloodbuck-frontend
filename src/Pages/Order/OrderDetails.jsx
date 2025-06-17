import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails, deleteOrder } from "../../redux/slices/orderSlices";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Helmet } from "react-helmet-async";
import ReviewSection from "./Review";

const statusSteps = ["Pending", "Processing", "Shipped", "Delivered"];

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.order);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (orderDetails) {
      setCurrentStep(statusSteps.indexOf(orderDetails.status));
    }
  }, [orderDetails]);

  const handleCancel = async () => {
    if (confirm("Are you sure you want to cancel this order?")) {
      await dispatch(deleteOrder(id));
      navigate("/orders");
    }
  };
  const handleContact = () => navigate("/chat-support");

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6 animate-pulse">
        <div className="h-40 bg-gray-200 rounded-lg" />
        <div className="h-64 bg-gray-200 rounded-lg" />
        <div className="h-80 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-12">
        Error loading order: {error}
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="text-gray-700 text-center py-12">
        Order not found.
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order #{orderDetails._id.slice(-8).toUpperCase()} | Your Store</title>
      </Helmet>

      <section className="min-h-screen bg-gray-50 py-32 px-4 ">
        <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-2">
          {/* Left Sidebar */}
          <aside className="space-y-6 lg:col-span-1">
            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span className="text-[12px] font-bold">Order ID:</span>
                  <span className="text-[12px] text-gray-900">{orderDetails._id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Placed On:</span>
                  <span className="font-medium">
                    {new Date(orderDetails.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment:</span>
                  <span className="font-medium">
                    {orderDetails.paymentMethod === "CashOnDelivery"
                      ? "Cash on Delivery"
                      : "Online"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-semibold text-gray-900">
                    ₹{orderDetails.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Order Status
              </h2>
              <ul className="space-y-6">
                {statusSteps.map((label, idx) => (
                  <li key={label} className="flex items-start">
                    <div className="flex flex-col items-center">
                      {idx <= currentStep ? (
                        <CheckCircleIcon className="text-indigo-600" />
                      ) : (
                        <RadioButtonUncheckedIcon className="text-gray-300" />
                      )}
                      {idx < statusSteps.length - 1 && (
                        <div
                          className={`w-px flex-1 my-1 ${idx < currentStep ? "bg-indigo-600" : "bg-gray-300"
                            }`}
                        />
                      )}
                    </div>
                    <p
                      className={`ml-4 text-lg ${idx <= currentStep
                        ? "text-gray-900 font-medium"
                        : "text-gray-400"
                        }`}
                    >
                      {label}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-lg shadow space-y-3">
              {orderDetails.status !== "Delivered" && (
                <button
                  onClick={handleCancel}
                  disabled={orderDetails.status === "Shipped"}
                  className={`w-full text-center px-4 py-2 rounded-lg font-semibold transition ${orderDetails.status === "Shipped"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                >
                  {orderDetails.status === "Shipped"
                    ? "Cannot Cancel Shipped"
                    : "Cancel Order"}
                </button>
              )}
              <button
                onClick={handleContact}
                className="w-full text-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
              >
                Contact Support
              </button>
            </div>
          </aside>

          {/* Right Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Products */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Products
              </h2>
              <div className="space-y-6">
                {orderDetails.cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.imageUrl || "/default-product.png"}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                      <div>
                        <h3 className="text-xl font-medium text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-gray-500">
                          {" "}
                           Color: {item.selectedColorName || "N/A"}
                        </p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                      {orderDetails.status === "Delivered" && (
                        <ReviewSection
                          productId={item.productId}
                          reviewed={item.reviewed}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Billing & Shipping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Payment Summary
                </h2>
                <div className="space-y-3 text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{orderDetails.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>-₹{orderDetails.discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{orderDetails.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{orderDetails.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Shipping Information
                </h2>
                <div className="space-y-1 text-gray-600">
                  <p>{orderDetails.shippingDetails.fullName}</p>
                  <p>{orderDetails.shippingDetails.address}</p>
                  <p>
                    {orderDetails.shippingDetails.city},{" "}
                    {orderDetails.shippingDetails.state} -{" "}
                    {orderDetails.shippingDetails.zipCode}
                  </p>
                  <p>Phone: {orderDetails.shippingDetails.phoneNumber}</p>
                  <p>Email: {orderDetails.shippingDetails.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderDetails;

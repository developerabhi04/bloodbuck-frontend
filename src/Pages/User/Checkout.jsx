import { useState } from "react";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import emailjs, { init } from "@emailjs/browser";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

import { validateCoupon } from "../../redux/slices/couponSlices";
import { confirmRazorpayPayment, createNewOrder } from "../../redux/slices/orderSlices";
import { clearOrderedProducts } from "../../redux/slices/cartSlices";


// Init EmailJS
init("OxJ-ujUPZE2bAuJdk");

export default function Checkout() {

  const { state } = useLocation();
  const cartItems = state?.cartItems || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.user);
  const { loading: couponLoading } = useSelector((s) => s.coupons);

  const [activeSection, setActiveSection] = useState("shipping");
  const toggleSection = (sec) => setActiveSection((prev) => (prev === sec ? null : sec));

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "", address: "", city: "", state: "",
    zipCode: "", phoneNumber: "", email: "",
  });
  const [errors, setErrors] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("CashOnDelivery");

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = +(subtotal * 0.07).toFixed(2);
  const shippingCost = 0;
  const totalBeforeDiscount = +(subtotal + tax + shippingCost).toFixed(2);
  const discountedTotal = +(totalBeforeDiscount - discountAmount).toFixed(2);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setShippingDetails((p) => ({ ...p, [id]: value }));
    let msg = "";
    if (id === "fullName" && value.trim().length < 3) msg = "Min 3 chars";
    if (id === "zipCode" && !/^[0-9]{6}$/.test(value)) msg = "Invalid ZIP";
    if (id === "phoneNumber" && !/^\d{10}$/.test(value)) msg = "Must be 10 digits";
    if (id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = "Invalid email";
    setErrors((p) => ({ ...p, [id]: msg }));
  };

  const handleApplyCoupon = async () => {
    try {
      const res = await dispatch(validateCoupon({ code: couponCode.trim(), totalAmount: totalBeforeDiscount })).unwrap();
      setDiscountAmount(res.discountAmount);
      toast.success(res.message);
    } catch (err) {
      toast.error(err || "Invalid coupon");
    }
  };

  const loadRazorpay = () => new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handleOrderCreation = async () => {
    const orderData = {
      user: user._id, cartItems, shippingDetails, subtotal, tax,
      shippingCost, total: discountedTotal || totalBeforeDiscount,
      discountAmount, paymentMethod,
    };
    const response = await dispatch(createNewOrder(orderData)).unwrap();
    return response;
  };

  const finalizeOrder = async (orderId) => {
    await emailjs.send("service_jbo1u2h", "template_qnsdz0r", {
      order_id: orderId,
      orders: cartItems.map((i) => ({
        image_url: i.imageUrl,
        name: i.name,
        units: i.quantity,
        price: i.price.toFixed(2),
      })),
      cost: {
        shipping: shippingCost.toFixed(2),
        tax: tax.toFixed(2),
        total: (discountedTotal || totalBeforeDiscount).toFixed(2),
      },
      email: shippingDetails.email,
    });

    await dispatch(clearOrderedProducts({
      userId: user._id,
      orderedItems: cartItems.map((i) => i.productId),
    })).unwrap();

    toast.success("Order placed!");
    setTimeout(() => {
      navigate("/orders-success", { state: { orderId } });
    }, 800);
  };

  const handleRazorpayPayment = async () => {
    try {
      const orderData = {
        user: user._id, cartItems, shippingDetails, subtotal, tax,
        shippingCost, total: discountedTotal || totalBeforeDiscount,
        discountAmount, paymentMethod: "Razorpay"
      };
      const { order, razorpayOrder } = await dispatch(createNewOrder(orderData)).unwrap();

      const sdkReady = await loadRazorpay();
      if (!sdkReady) return toast.error("Razorpay SDK failed to load");

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        handler: async (resp) => {
          await dispatch(confirmRazorpayPayment({
            orderId: order._id,
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_signature: resp.razorpay_signature,
          })).unwrap();
          finalizeOrder(order._id);
        },
        prefill: {
          name: shippingDetails.fullName,
          email: shippingDetails.email,
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      toast.error(err.message || "Payment failed");
    }
  };

  const handleCOD = async () => {
    try {
      const { order } = await handleOrderCreation();
      await finalizeOrder(order._id);
    } catch (err) {
      toast.error(err.message || "COD order failed");
    }
  };


  // FAQ data
  const faqData = [
    { question: "What is your return policy?", answer: "Returns within 30 days if unused." },
    { question: "How do I track my order?", answer: "Tracking link is emailed upon shipment." },
    { question: "Do you ship internationally?", answer: "Yes—rates vary by destination." },
  ];

  return (
    <>
      <Helmet>
        <title>Checkout | Bloodbuck</title>
        <meta name="description" content="Complete your purchase on BloodBuck." />
      </Helmet>

      <section className="bg-gray-50 py-24 px-4 md:px-8 lg:px-16">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping & FAQ Accordion */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Details */}
            <div className="border border-gray-200 rounded">
              <button
                onClick={() => toggleSection("shipping")}
                className="w-full px-6 py-4 flex justify-between items-center text-lg font-medium"
              >
                <span>Shipping Details</span>
                {activeSection === "shipping" ? <ArrowDropUp /> : <ArrowDropDown />}
              </button>
              {activeSection === "shipping" && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: "fullName", label: "Full Name" },
                    { id: "address", label: "Address" },
                    { id: "city", label: "City" },
                    { id: "state", label: "State" },
                    { id: "zipCode", label: "ZIP Code" },
                    { id: "phoneNumber", label: "Phone Number" },
                    { id: "email", label: "Email" },
                  ].map(({ id, label }) => (
                    <div key={id} className="flex flex-col">
                      <label htmlFor={id} className="mb-1 font-medium">{label}</label>
                      <input
                        id={id}
                        value={shippingDetails[id]}
                        onChange={handleChange}
                        className={`border rounded px-3 py-2 focus:outline-none ${errors[id] ? "border-red-600" : "border-gray-300"}`}
                      />
                      {errors[id] && (
                        <p className="text-red-600 text-sm mt-1">{errors[id]}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FAQ */}
            <div className="border border-gray-200 rounded">
              <button
                onClick={() => toggleSection("faq")}
                className="w-full px-6 py-4 flex justify-between items-center text-lg font-medium"
              >
                <span>Frequently Asked Questions</span>
                {activeSection === "faq" ? <ArrowDropUp /> : <ArrowDropDown />}
              </button>
              {activeSection === "faq" && (
                <div className="p-6 space-y-4">
                  {faqData.map((f, i) => (
                    <div key={i} className="space-y-1">
                      <h4 className="font-semibold">{f.question}</h4>
                      <p className="text-gray-600">{f.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary & Payment */}
          <aside className="space-y-6 lg:self-start lg:sticky lg:top-20">
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={`${item.productId}_${item.selectedColorName}`} className="flex items-center space-x-4">
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="font-semibold text-red-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="text-gray-600">Qty: {item.quantity} | Color: {item.selectedColorName}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax (7%)</span><span>₹{tax.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>₹{shippingCost.toFixed(2)}</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{discountAmount.toFixed(2)}</span></div>}
                <div className="flex justify-between border-t pt-2 font-semibold"><span>Total</span><span>₹{discountedTotal.toFixed(2)}</span></div>
              </div>

              {/* Coupon */}
              <div className="space-y-2">
                <h3 className="font-medium">Have a coupon?</h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponLoading}
                    className="flex-1 border rounded px-3 py-2 focus:outline-none"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
                  >
                    {couponLoading ? "Applying…" : "Apply"}
                  </button>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="payment"
                    value="CashOnDelivery"
                    checked={paymentMethod === "CashOnDelivery"}
                    onChange={() => setPaymentMethod("CashOnDelivery")}
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="payment"
                    value="Razorpay"
                    checked={paymentMethod === "Razorpay"}
                    onChange={() => setPaymentMethod("Razorpay")}
                  />
                  <span>Pay with Razorpay</span>
                </label>
              </div>

              {/* Action Button */}
              {paymentMethod === "CashOnDelivery" ? (
                <button
                  onClick={handleCOD}
                  className="w-full bg-gray-600 text-white py-3 rounded"
                >
                  Place Order (COD)
                </button>
              ) : (
                <button
                  onClick={handleRazorpayPayment}
                  className="w-full bg-indigo-600 text-white py-3 rounded"
                >
                  Pay with Razorpay
                </button>
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

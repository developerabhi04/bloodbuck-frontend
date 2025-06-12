// src/pages/cart/Cart.jsx
import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteCartItem,
    fetchCartItems,
    updateCartQuantity,
} from "../../redux/slices/cartSlices";
import { toast } from "react-toastify";
import { Delete, RemoveShoppingCart } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";

export default function Cart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((s) => s.user);
    const { cartItems = [] } = useSelector((s) => s.shopCart);

    // Local state for optimistic quantity updates
    const [quantities, setQuantities] = useState({});

    // Fetch cart items when user logs in or changes
    useEffect(() => {
        if (user) dispatch(fetchCartItems(user._id));
    }, [dispatch, user]);

    // Initialize local quantities when cartItems load
    useEffect(() => {
        const init = {};
        cartItems.forEach((item) => {
            init[`${item.productId}_${item.selectedColorName}`] = item.quantity;
        });
        setQuantities(init);
    }, [cartItems]);

    // Unified handler for +/- buttons
    const handleQtyChange = async (productId, colorName, delta) => {
        const key = `${productId}_${colorName}`;
        const oldQty = quantities[key] ?? 1;
        const newQty = Math.max(1, oldQty + delta);

        // Optimistically update UI
        setQuantities((q) => ({ ...q, [key]: newQty }));

        try {
            await dispatch(
                updateCartQuantity({
                    userId: user._id,
                    productId,
                    quantity: newQty,
                    colorName,
                })
            ).unwrap();
            toast.success("Quantity updated!");
            dispatch(fetchCartItems(user._id));
        } catch (err) {
            toast.error(err.message || "Failed to update quantity");
            // Roll back UI
            setQuantities((q) => ({ ...q, [key]: oldQty }));
        }
    };

    // Handler for direct number input
    const handleQtyInput = (productId, colorName, value) => {
        const key = `${productId}_${colorName}`;
        const oldQty = quantities[key] ?? 1;
        const parsed = parseInt(value, 10);
        const val = isNaN(parsed) ? oldQty : Math.max(1, parsed);
        handleQtyChange(productId, colorName, val - oldQty);
    };

    // Remove item
    const handleRemoveItem = async (productId, colorName) => {
        try {
            await dispatch(
                deleteCartItem({ userId: user._id, productId, colorName })
            ).unwrap();
            toast.success("Item removed!");
            dispatch(fetchCartItems(user._id));
        } catch (err) {
            toast.error(err.message || "Failed to remove item");
        }
    };

    // Checkout navigation
    const checkout = () => {
        navigate("/checkout-user", { state: { cartItems } });
    };

    // Totals
    const subtotal = cartItems.reduce(
        (sum, i) => sum + (i.price || 0) * i.quantity,
        0
    );
    const tax = subtotal * 0.07;
    const total = subtotal + tax;

    // SEO & breadcrumb schema
    const pageTitle = "Shopping Cart | Bloodbuck";
    const pageDescription = cartItems.length
        ? `You have ${cartItems.length} item(s) in your cart.`
        : "Your cart is empty.";
    const pageUrl = window.location.href;
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: window.location.origin + "/",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Cart",
                item: pageUrl,
            },
        ],
    };

    return (
        <Fragment>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={pageUrl} />
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            </Helmet>

            <section className="bg-gray-50 py-32 px-4 md:px-8 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumb */}
                    <nav
                        className="text-sm text-gray-600 mb-6"
                        aria-label="Breadcrumb"
                    >
                        <ol className="inline-flex list-none p-0">
                            <li className="flex items-center">
                                <Link to="/" className="hover:text-gray-800">
                                    Home
                                </Link>
                                <span className="mx-2">/</span>
                            </li>
                            <li className="flex items-center text-gray-500">
                                <span>Cart</span>
                            </li>
                        </ol>
                    </nav>

                    {/* Empty state */}
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <RemoveShoppingCart className="text-gray-400 text-6xl mb-4" />
                            <Typography className="text-xl font-medium text-gray-700 mb-2">
                                Your cart is empty
                            </Typography>
                            <Link
                                to="/products"
                                className="mt-4 inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
                            >
                                Shop Now
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Cart Items */}
                            <div className="lg:col-span-2 space-y-6">
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    Shopping Cart ({cartItems.length})
                                </h2>

                                {cartItems.map((item, idx) => {
                                    const key = `${item.productId}_${item.selectedColorName}`;
                                    const qty = quantities[key] ?? item.quantity;

                                    return (
                                        <div
                                            key={idx}
                                            className="flex flex-col md:flex-row items-center md:items-start bg-white rounded-lg shadow p-6"
                                        >
                                            {/* Image */}
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                onClick={() =>
                                                    navigate(`/product-details/${item.productId}`)
                                                }
                                                className="w-full md:w-32 h-32 object-cover rounded-lg cursor-pointer"
                                            />

                                            {/* Info */}
                                            <div className="flex-1 md:ml-6 mt-4 md:mt-0 w-full flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-lg font-medium text-gray-800">
                                                        {item.name}
                                                    </h3>
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveItem(
                                                                item.productId,
                                                                item.selectedColorName
                                                            )
                                                        }
                                                        className="text-gray-400 hover:text-red-600"
                                                    >
                                                        <Delete />
                                                    </button>
                                                </div>

                                                <p className="mt-2 text-gray-600">
                                                    Color:{" "}
                                                    <span className="font-medium">
                                                        {item.selectedColorName}
                                                    </span>
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="mt-4 flex items-center space-x-4">
                                                    <button
                                                        onClick={() =>
                                                            handleQtyChange(
                                                                item.productId,
                                                                item.selectedColorName,
                                                                -1
                                                            )
                                                        }
                                                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                                                    >
                                                        −
                                                    </button>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={qty}
                                                        onChange={(e) =>
                                                            handleQtyInput(
                                                                item.productId,
                                                                item.selectedColorName,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-12 text-center border rounded"
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            handleQtyChange(
                                                                item.productId,
                                                                item.selectedColorName,
                                                                1
                                                            )
                                                        }
                                                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <p className="mt-4 text-lg font-semibold text-red-600">
                                                    ₹{(item.price * qty).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Right: Sticky Order Summary */}
                            <aside className="space-y-6 lg:col-span-1 lg:self-start lg:sticky lg:top-24">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Order Summary
                                </h3>
                                <div className="bg-white rounded-lg shadow p-6 space-y-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-medium">
                                            ₹{subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="font-medium text-green-600">FREE</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span className="font-medium">₹{tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                                        <span>Total</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={checkout}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md transition"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </section>
        </Fragment>
    );
}

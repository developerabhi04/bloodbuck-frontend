import { CheckCircle } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useDispatch } from "react-redux";
import { resetNewOrderSuccess } from "../../redux/slices/orderSlices";

const OrderSuccessful = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showConfetti, setShowConfetti] = useState(true);
    const [playSound, setPlaySound] = useState(false);
    const dispatch = useDispatch();

    // Get orderId from navigation state (e.g., passed via navigate('/success', { state: { orderId } }))
    const orderId = location.state?.orderId || "#A12345XZ8921"; // fallback if not provided

    useEffect(() => {
        setTimeout(() => setShowConfetti(false), 9000);
        setPlaySound(true);
    }, []);

    useEffect(() => {
        dispatch(resetNewOrderSuccess());
    }, [dispatch]);

    useEffect(() => {
        if (playSound) {
            const audio = new Audio("/success-tone.mp3");
            audio.play();
        }
    }, [playSound]);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-10">
            {showConfetti && (
                <Confetti width={window.innerWidth} height={window.innerHeight} />
            )}

            <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-10 md:p-14 max-w-3xl w-full text-center border-t-8 border-green-600 animate-fadeIn">
                <div className="flex flex-col items-center space-y-6">
                    <div className="bg-green-100 dark:bg-green-800 p-5 rounded-full shadow-inner animate-bounce">
                        <CheckCircle className="text-green-600 dark:text-green-300" style={{ fontSize: 70 }} />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white tracking-tight">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg max-w-md">
                        Thank you for shopping with us. Your order is confirmed and being processed. We'll send you an update when it's on the way!
                    </p>

                    <div className="bg-green-50 dark:bg-green-900 border border-green-100 dark:border-green-700 rounded-xl px-6 py-4 mt-4 shadow-sm w-full max-w-md">
                        <p className="text-sm text-gray-700 dark:text-gray-200">
                            <span className="font-medium">Order ID:</span> {orderId}<br />
                            <span className="font-medium">Estimated Delivery:</span> 3-5 business days
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            onClick={() => navigate("/")}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-md transition-all"
                        >
                            Return to Home
                        </button>
                        <button
                            onClick={() => navigate("/orders")}
                            className="border border-green-600 text-green-700 dark:text-green-300 px-6 py-3 rounded-lg text-sm font-medium hover:bg-green-50 dark:hover:bg-green-800 transition-all"
                        >
                            View My Orders
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessful;
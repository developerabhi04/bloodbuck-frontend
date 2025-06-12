import { useState, useEffect } from "react";
import { Rating } from "@mui/material";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchReviews, submitReview } from "../../redux/slices/reviewSlices.js";

const ReviewSection = ({ productId, reviewed }) => {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    useEffect(() => {
        if (productId) {
            dispatch(fetchReviews(productId))
                .unwrap()
                .then((data) => {
                    console.log("Fetched reviews data:", data);
                })
                .catch((err) => {
                    console.error("Error in fetchReviews:", err);
                });
        }
    }, [dispatch, productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0 || comment.trim() === "") {
            toast.error("Please provide both a rating and a comment.");
            return;
        }
        try {
            console.log("Submitting review:", { productId, rating, comment });
            await dispatch(submitReview({ productId, rating, comment })).unwrap();
            toast.success("Review submitted successfully!");
            setRating(0);
            setComment("");
            dispatch(fetchReviews(productId));
        } catch (err) {
            console.error("Submit review error:", err);
            toast.error(err.message || "Failed to submit review.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Leave Your Review
            </h2>

            {reviewed ? (
                <p className="text-green-600 font-medium">
                    You have already submitted a review for this product.
                </p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex items-center">
                        <span className="mr-3 text-gray-700 font-medium">Your Rating:</span>
                        <Rating
                            value={rating}
                            onChange={(e, newValue) => setRating(newValue)}
                            className="text-yellow-400"
                        />
                    </div>

                    <textarea
                        rows={4}
                        placeholder="Write your review here..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    />

                    <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
                    >
                        Submit Review
                    </button>
                </form>
            )}
        </div>
    );
};

export default ReviewSection;

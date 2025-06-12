// src/components/SimilarProduct.jsx
import Slider from "react-slick";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Arrow = ({ className, onClick, children }) => (
    <button
        className={`${className} bg-white rounded-full p-1 shadow hover:bg-gray-100 absolute z-10`}
        onClick={onClick}
    >
        {children}
    </button>
);

export default function SimilarProduct() {
    const { similarProducts, loading } = useSelector((s) => s.products);

    const settings = {
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <Arrow className="right-3 top-1/2"> <ArrowForwardIos /> </Arrow>,
        prevArrow: <Arrow className="left-3 top-1/2"> <ArrowBackIos /> </Arrow>,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };

    if (loading) return <p className="text-center py-8">Loading similar products…</p>;
    if (!similarProducts.length)
        return <p className="text-center py-8">No similar products found.</p>;

    return (
        <section className="px-4 lg:px-16">
            <h2 className="text-2xl font-semibold mb-6">You Might Also Like</h2>
            <Slider {...settings}>
                {similarProducts.map((p) => (
                    <Link key={p._id} to={`/product-details/${p._id}`}>
                        <div className="p-2">
                            <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                                <img
                                    src={p.colors?.[0]?.photos?.[0]?.url}
                                    alt={p.name}
                                    className="w-full h-[33] object-cover"
                                />
                                <div className="p-4">
                                    <p className="text-gray-800 font-medium truncate">{p.name}</p>
                                    <p className="text-red-600 font-semibold mt-1">
                                        ₹{p.price.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </Slider>
        </section>
    );
}

import { useState } from "react";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

// Custom Arrow Components
const CustomNextArrow = ({ onClick }) => (
    <div
        className="absolute right-2 top-1/2 z-10 transform -translate-y-1/2"
        onClick={onClick}
    >
        <div className="bg-white p-1 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
            <ArrowForwardIos className="text-gray-600 text-xs sm:text-sm" />
        </div>
    </div>
);

const CustomPrevArrow = ({ onClick }) => (
    <div
        className="absolute left-2 top-1/2 z-10 transform -translate-y-1/2"
        onClick={onClick}
    >
        <div className="bg-white p-1 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
            <ArrowBackIos className="text-gray-600 text-xs sm:text-sm" />
        </div>
    </div>
);

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const defaultImage =
        product?.colors?.[0]?.photos?.[0]?.url ||
        "https://via.placeholder.com/300x300.png?text=No+Image";

    const [currentImage, setCurrentImage] = useState(defaultImage);

    const settings = {
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        responsive: [
            { breakpoint: 640, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 3 } },
            { breakpoint: 1024, settings: { slidesToShow: 4 } },
        ],
    };

    const handleNavigate = () => {
        window.scrollTo(0, 0);
        navigate(`/product-details/${product._id}`);
    };

    const handleVariantHover = (color) => {
        const img = color.photos?.[0]?.url || defaultImage;
        setCurrentImage(img);
    };

    return (
        <div className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 w-full">
            {/* Image */}
            <div
                className="h-40 sm:h-48 md:h-56 lg:h-72 bg-gray-100 cursor-pointer overflow-hidden"
                onClick={handleNavigate}
                onMouseLeave={() => setCurrentImage(defaultImage)}
            >
                <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Color Variants Slider */}
            {product.colors?.length > 0 && (
                <div className="relative mt-3 px-2 sm:px-4">
                    <Slider {...settings}>
                        {product.colors.map((color, idx) => (
                            <div key={idx} className="px-1">
                                <div
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-110"
                                    onMouseEnter={() => handleVariantHover(color)}
                                >
                                    <img
                                        src={
                                            color.colorImage?.url || color.photos?.[0]?.url || defaultImage
                                        }
                                        alt={color.colorName || `Variant ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            )}

            {/* Details */}
            <div className="p-4">
                <h4
                    className="text-gray-800 font-medium truncate text-sm sm:text-base cursor-pointer"
                    title={product.name}
                    onClick={handleNavigate}
                >
                    {product.name}
                </h4>
                <span className="block mt-1 text-base sm:text-lg font-semibold text-red-600">
                    ${product.price?.toFixed(2)}
                </span>
            </div>
        </div>
    );
};

export default ProductCard;

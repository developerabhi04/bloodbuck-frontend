import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

// Custom Arrow Components
const CustomNextArrow = ({ onClick }) => (
    <button className="custom-arrow next" onClick={onClick}>
        <ArrowForwardIos />
    </button>
);

const CustomPrevArrow = ({ onClick }) => (
    <button className="custom-arrow prev" onClick={onClick}>
        <ArrowBackIos />
    </button>
);

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    // Use the first image from the first color as default display image
    const defaultImage =
        product?.colors?.[0]?.photos?.[0]?.url ||
        "https://via.placeholder.com/300x300.png?text=No+Image";

    const [hoveredImage, setHoveredImage] = useState(defaultImage);

    const colorSettings = {
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };

    const navigateToProduct = () => {
        window.scrollTo(0, 0);
        navigate(`/product-details/${product._id}`);
    };

    const getVariantImage = (color) =>
        color.photos?.[0]?.url || defaultImage;

    return (
        <div className="product-card">
            {/* Product Image */}
            <div
                className="product-image"
                onClick={navigateToProduct}
                onMouseLeave={() => setHoveredImage(defaultImage)}
            >
                <img
                    src={hoveredImage}
                    alt={product.name}
                    style={{ cursor: "pointer" }}
                />
            </div>

            {/* Color Variant Slider */}
            {product.colors?.length > 0 && (
                <div className="colors">
                    <Slider {...colorSettings}>
                        {product.colors.map((color, index) => (
                            <div key={index} className="color-slide">
                                <img
                                    src={
                                        color.colorImage?.url ||
                                        color.photos?.[0]?.url ||
                                        "https://via.placeholder.com/30"
                                    }
                                    alt={color.colorName || `Color ${index + 1}`}
                                    className="color"
                                    onMouseEnter={() =>
                                        setHoveredImage(getVariantImage(color))
                                    }
                                />
                            </div>
                        ))}
                    </Slider>
                </div>
            )}

            {/* Product Info */}
            <div className="product-details">
                <h4 title={product.name}>{product.name}</h4>
                <span className="span">
                    <p className="price">${product.price?.toFixed(2)}</p>
                </span>
            </div>
        </div>
    );
};

export default ProductCard;

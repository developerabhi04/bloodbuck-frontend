import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import Skeleton from "@mui/material/Skeleton";
import { fetchCategories } from "../../../redux/slices/categorySlices";


// Custom Arrow Components with Tailwind styling
const NextArrow = ({ onClick }) => (
    <div
        className="arrow next absolute top-1/2 -right-10 transform -translate-y-1/2 text-gray-600 rounded-full p-2 cursor-pointer z-10 transition-all duration-300 hover:text-black hover:scale-110 md:-right-8"
        onClick={onClick}
    >
        <ArrowForwardIos />
    </div>
);

const PrevArrow = ({ onClick }) => (
    <div
        className="arrow prev absolute top-1/2 -left-10 transform -translate-y-1/2 text-gray-600 rounded-full p-2 cursor-pointer z-10 transition-all duration-300 hover:text-black hover:scale-110 md:-left-8"
        onClick={onClick}
    >
        <ArrowBackIos />
    </div>
);

const Category = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories, loading } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        pauseOnHover: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2, arrows: false } },
            { breakpoint: 480, settings: { slidesToShow: 1, arrows: false } },
        ],
    };

    const navigateLink = (categoryId) => {
        window.scrollTo(0, 0);
        navigate(`/products?category=${encodeURIComponent(categoryId)}`);
    };

    return (
        <section className="text-center py-16 md:py-20 sm:py-10 px-4 mb-12 bg-gray-50 overflow-hidden">
            <h1 className="text-4xl md:text-3xl sm:text-2xl font-normal text-gray-800 uppercase tracking-[5px] font-sans mb-12">
                Shop by categories
            </h1>

            <div className="relative w-full max-w-[1350px] mx-auto px-1">
                {loading ? (
                    <div className="flex justify-center gap-6 mt-8 flex-wrap">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="w-[220px] h-[220px]">
                                <Skeleton
                                    variant="rectangular"
                                    width={200}
                                    height={200}
                                    className="rounded-xl"
                                />
                                <Skeleton
                                    variant="text"
                                    width={120}
                                    className="mx-auto mt-3"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <Slider {...settings} className="mt-8">
                        {categories.map((category) => (
                            <div
                                key={category._id}
                                className="category-card px-8"
                                onClick={() => navigateLink(category._id)}
                            >
                                <div className="relative overflow-hidden rounded-xl group cursor-pointer transition-all duration-500">
                                    <img
                                        src={category.photos?.[0]?.url || "default-placeholder.jpg"}
                                        alt={category.name}
                                        className="w-full h-[300px] md:h-[250px] object-cover transition-all duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                                        <button className="bg-white text-gray-800 px-5 py-2 rounded-full font-medium transform translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            Shop Now
                                        </button>
                                    </div>
                                </div>
                                <p className="category-name mt-4 text-gray-800 font-sans tracking-[2px] capitalize text-lg sm:text-base">
                                    {category.name}
                                </p>
                            </div>
                        ))}
                    </Slider>
                )}
            </div>
        </section>
    );
};

export default Category;
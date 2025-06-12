import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchThirdBanners } from "../../../redux/slices/thirdBannerSlices";
import { useNavigate } from "react-router-dom";

const ThirdBanner = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { thirdBanners } = useSelector((state) => state.thirdbanners);

    useEffect(() => {
        dispatch(fetchThirdBanners());
    }, [dispatch]);

    const handleNavigate = () => {
        navigate("/products");
    };

    return (
        <section className="py-16 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 space-y-12">
                {thirdBanners.map((banner, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 lg:grid-rows-2 gap-6">
                        {/* Main Large Banner */}
                        <div className="relative group overflow-hidden rounded-xl shadow-lg lg:col-span-2 lg:row-span-2 h-96">
                            <img
                                src={banner.photos[0]?.url}
                                alt={`primary-banner-${idx}`}
                                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60"></div>
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
                                {banner.headingOne && (
                                    <h2 className="text-4xl lg:text-5xl font-bold text-white">
                                        {banner.headingOne}
                                    </h2>
                                )}
                                {banner.headingTwo && (
                                    <p className="mt-4 text-lg lg:text-xl text-white max-w-2xl">
                                        {banner.headingTwo}
                                    </p>
                                )}
                                <button
                                    onClick={handleNavigate}
                                    className="mt-6 bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition"
                                >
                                    Explore Collection
                                </button>
                            </div>
                        </div>

                        {/* Secondary Banner 1 */}
                        <div className="relative group overflow-hidden rounded-xl shadow-lg h-48 md:h-64">
                            <img
                                src={banner.photos[1]?.url}
                                alt={`secondary-banner-1-${idx}`}
                                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-40"></div>
                            <div className="absolute bottom-4 left-4">
                                <h3 className="text-xl font-semibold text-white">
                                    {banner.subHeadingOne || "Discover More"}
                                </h3>
                                <button
                                    onClick={handleNavigate}
                                    className="mt-2 bg-white text-black px-4 py-1 rounded-full font-medium hover:bg-gray-200 transition"
                                >
                                    Shop Now
                                </button>
                            </div>
                        </div>

                        {/* Secondary Banner 2 */}
                        <div className="relative group overflow-hidden rounded-xl shadow-lg h-48 md:h-64">
                            <img
                                src={banner.photos[2]?.url}
                                alt={`secondary-banner-2-${idx}`}
                                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-40"></div>
                            <div className="absolute bottom-4 left-4">
                                <h3 className="text-xl font-semibold text-white">
                                    {banner.subHeadingTwo || "Latest Arrivals"}
                                </h3>
                                <button
                                    onClick={handleNavigate}
                                    className="mt-2 bg-white text-black px-4 py-1 rounded-full font-medium hover:bg-gray-200 transition"
                                >
                                    Shop Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ThirdBanner;

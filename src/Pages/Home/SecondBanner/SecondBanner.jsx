import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSecondBanners } from "../../../redux/slices/secondBannerSlices";
import { useNavigate } from "react-router-dom";

const SecondBanner = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { banners } = useSelector((state) => state.secondBanner);

    useEffect(() => {
        dispatch(fetchSecondBanners());
    }, [dispatch]);

    const handleNavigate = () => {
        navigate("/products");
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl tracking-[6px] font-sans uppercase text-center text-gray-800 mb-12">
                    Featured Collection
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {banners.map((banner, idx) => (
                        <>
                            <div
                                key={idx}
                                className="relative group rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
                            >
                                <img
                                    src={banner.photos[0]?.url}
                                    alt={banner.headingOne}
                                    className="w-full h-[33rem] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h3 className="text-2xl font-bold">{banner.headingOne}</h3>
                                    {banner.headingTwo && (
                                        <p className="mt-2 text-sm">{banner.headingTwo}</p>
                                    )}
                                    <button
                                        onClick={handleNavigate}
                                        className="mt-4 inline-block bg-white tracking-[3px] font-sans uppercase text-black font-medium py-2 px-5 rounded-full shadow-md hover:bg-gray-200 transition-colors"
                                    >
                                        Shop Now
                                    </button>
                                </div>
                            </div>

                            <div
                                key={idx}
                                className="relative group rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
                            >
                                <img
                                    src={banner.photos[1]?.url}
                                    alt={banner.headingOne}
                                    className="w-full h-[33rem] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h3 className="text-2xl font-bold">{banner.headingOne}</h3>
                                    {banner.headingTwo && (
                                        <p className="mt-2 text-sm">{banner.headingTwo}</p>
                                    )}
                                    <button
                                        onClick={handleNavigate}
                                        className="mt-4 tracking-[4px] font-sans uppercase inline-block bg-white text-black font-medium py-2 px-5 rounded-full shadow-md hover:bg-gray-200 transition-colors"
                                    >
                                        Shop Now
                                    </button>
                                </div>
                            </div>
                        </>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SecondBanner;

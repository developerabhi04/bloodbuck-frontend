import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchBanners } from "../../../redux/slices/bannerSlices";
import { fetchBannerss } from "../../../redux/slices/bannersSlices";

const Banner = () => {
    const dispatch = useDispatch();
    const { banners: bannerss } = useSelector((state) => state.bannerss);

    useEffect(() => {
        dispatch(fetchBanners());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchBannerss());
    }, [dispatch]);

    return (
        <section className="relative pt-[5.3rem] w-full h-[98vh] flex items-center justify-center bg-gray-100">
            <div className="w-full h-full flex items-center justify-between">
                {/* Image Slider Section */}
                <div className="flex-grow w-full md:w-1/2 h-full md:h-screen overflow-hidden flex justify-center items-center border border-gray-600 transition-all duration-300 hover:shadow-xl">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        pagination={{
                            clickable: true,
                            el: '.banner-pagination',
                            bulletClass: 'swiper-pagination-bullet',
                            bulletActiveClass: 'swiper-pagination-bullet-active'
                        }}
                        loop={true}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        speed={800}
                        className="w-full h-full"
                    >
                        {bannerss?.flatMap((bannerss) =>
                            bannerss.photos.map((photo, index) => (
                                <SwiperSlide key={photo._id} className="flex justify-center items-center w-full h-full">
                                    <img
                                        src={photo.url}
                                        alt={`Fashion Slide ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                                    />
                                </SwiperSlide>
                            ))
                        )}
                    </Swiper>
                    {/* Custom Pagination Container */}
                    <div className="banner-pagination absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10 flex justify-center space-x-2" />
                </div>
            </div>
        </section>
    );
};

export default Banner;
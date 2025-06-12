import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdViewCarousel, MdImage } from 'react-icons/md';
import AdminSidebar from '../../Components/Admin/AdminSidebar';

const bannerSections = [
  'first-banner-seconds',
  'second-banner',
  'third-banner',
];

const Banners = () => (
  <div className="flex bg-gray-50 min-h-screen">
    <AdminSidebar />

    <main className="flex-1 p-6 lg:p-8 pl-[64px] lg:pl-[258px]">
      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 mb-8"
      >
        Manage Banners
      </motion.h1>

      {/* Banner Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
        className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        {bannerSections.map((slug, idx) => {
          const btnColors = [
            'bg-blue-500 hover:bg-blue-600',
            'bg-green-500 hover:bg-green-600',
            'bg-purple-500 hover:bg-purple-600',
          ];
          return (
            <motion.div
              key={slug}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 text-center">
                  Banner Section {idx + 1}
                </h2>
                <Link to={`/admin/banner/${slug}`}>
                  <button
                    className={`${btnColors[idx]} text-white w-full py-2 px-4 rounded-md mt-4 flex items-center justify-center transition`}
                  >
                    <MdViewCarousel className="mr-2 text-lg" />
                    View Banner
                  </button>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Divider */}
      <div className="border-t border-gray-300 my-12"></div>

      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white shadow-lg rounded-2xl overflow-hidden"
      >
        <div className="p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Logo Section
          </h2>
          <Link to="/admin/banner/company-info">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md inline-flex items-center transition">
              <MdImage className="mr-2 text-lg" />
              Update Logo
            </button>
          </Link>
        </div>
      </motion.div>
    </main>
  </div>
);

export default Banners;

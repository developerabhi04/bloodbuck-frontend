// src/Components/Layout/Popup.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import img1 from '../../assets/ChatGPT Image Jun 13, 2025, 05_04_17 PM.png';

export default function Popup() {
  const [showModal, setShowModal] = useState(false);

  // show on mount
  useEffect(() => {
    setShowModal(true);
  }, []);

  // auto‐dismiss on first scroll
  useEffect(() => {
    if (!showModal) return;
    const onScroll = () => setShowModal(false);
    window.addEventListener('scroll', onScroll, { passive: true, once: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showModal]);

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-3xl mx-4 md:flex"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Left: Image */}
            <div className="md:w-1/2 h-64 md:h-auto">
              <img
                src={img1}
                alt="Special Offer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Content */}
            <div className="md:w-1/2 p-8 relative flex flex-col">
              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>

              {/* Badge */}
              <span className="self-start bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Exclusive Offer
              </span>

              {/* Headline */}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Spring Sale Is Here!
              </h2>
              <p className="text-gray-600 mb-6 flex-1">
                Up to 30% off site-wide—only for a limited time. Don’t miss out on our best deals of the season!
              </p>

              {/* Countdown placeholder */}
              <div className="flex justify-center space-x-4 mb-6">
                {['02', '15', '30'].map((t, i) => (
                  <div key={i} className="bg-gray-100 px-3 py-2 rounded-lg text-center">
                    <span className="block text-lg font-semibold">{t}</span>
                    <span className="text-xs text-gray-500">
                      {i === 0 ? 'Hrs' : i === 1 ? 'Min' : 'Sec'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Shop Now button */}
              <Link
                to="/products"
                onClick={() => setShowModal(false)}
                className="block text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition mb-4"
              >
                Shop Now
              </Link>

              {/* Maybe later */}
              <button
                onClick={() => setShowModal(false)}
                className="text-sm text-gray-500 hover:text-gray-700 self-center"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

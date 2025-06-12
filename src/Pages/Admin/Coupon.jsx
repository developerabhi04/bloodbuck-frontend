// src/pages/Admin/Coupons.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminSidebar from '../../Components/Admin/AdminSidebar';
import { fetchCoupons, deleteCoupon } from '../../redux/slices/couponSlices';

export default function Coupons() {
  const dispatch = useDispatch();
  const { coupons, loading, error } = useSelector((s) => s.coupons);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await dispatch(deleteCoupon(id)).unwrap();
      toast.success('Coupon deleted');
      dispatch(fetchCoupons());
    } catch (err) {
      toast.error(`Failed to delete: ${err.message || err}`);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />

      <main className="relative flex-1 p-6 lg:p-8 overflow-auto pl-[64px] lg:pl-[258px]">
        <ToastContainer position="top-right" />

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Coupons</h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
            {/* Table Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-t-2xl">
              <h2 className="text-white text-lg font-semibold">All Coupons</h2>
              <Link
                to="/admin/coupons/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-yellow-700 text-white rounded-md"
              >
                <FaPlus className="mr-2" /> New Coupon
              </Link>
            </div>

            {/* Table */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-yellow-100">
                <tr>
                  {['Code', 'Discount', 'Expiry Date', 'Active', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{c.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {c.discount}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {new Date(c.expiryDate).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {c.isActive ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex space-x-4">
                      <Link
                        to={`/admin/coupon/${c._id}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Floating Add Button */}
        {/* <motion.div whileHover={{ scale: 1.1 }} className="fixed bottom-8 right-8 z-50 ">
          <Link
            to="/admin/coupons/new"
            className="bg-purple-500 hover:bg-yellow-600 text-white p-4 rounded-full shadow-lg"
            title="Create Coupon"
          >
            <FaPlus size={13} />
          </Link>
        </motion.div> */}
      </main>
    </div>
  );
}

// src/pages/Admin/Coupons.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminSidebar from '../../Components/Admin/AdminSidebar';
import { fetchCoupons, deleteCoupon } from '../../redux/slices/couponSlices';

export default function Coupons() {
  const dispatch = useDispatch();
  const { coupons, loading, error } = useSelector((s) => s.coupons);

  // State for delete-confirm modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    couponId: null,
    couponCode: '',
  });


  // track sidebar collapse
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === null ? window.innerWidth < 1024 : JSON.parse(saved);
  });

  useEffect(() => {
    // update on toggle
    const onToggle = e => setCollapsed(e.detail);
    window.addEventListener('sidebar-collapsed', onToggle);
    return () => window.removeEventListener('sidebar-collapsed', onToggle);
  }, []);



  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const openDeleteModal = (id, code) => {
    setDeleteModal({ isOpen: true, couponId: id, couponCode: code });
  };
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, couponId: null, couponCode: '' });
  };

  const confirmDeleteCoupon = async () => {
    try {
      await dispatch(deleteCoupon(deleteModal.couponId)).unwrap();
      toast.success(`Deleted coupon “${deleteModal.couponCode}”`);
      dispatch(fetchCoupons());
    } catch (err) {
      toast.error(`Failed to delete: ${err.message || err}`);
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />

      <main
        className={
          `relative flex-1 p-6 lg:p-8 overflow-auto pl-[64px] ` +
          (collapsed ? 'lg:pl-[100px]' : 'lg:pl-[260px]')
        }
      >
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
                        onClick={() => openDeleteModal(c._id, c.code)}
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

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold mb-4">
                Delete coupon “{deleteModal.couponCode}”?
              </h3>
              <p className="text-gray-700">This action cannot be undone.</p>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteCoupon}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

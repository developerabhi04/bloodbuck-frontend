// src/pages/Admin/Transaction.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, deleteOrder } from '../../redux/slices/orderSlices';
import AdminSidebar from '../../Components/Admin/AdminSidebar';
import { Link } from 'react-router-dom';
import { AiOutlineDelete } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Transaction() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(s => s.order);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const openDeleteModal = id => {
    setToDeleteId(id);
    setIsModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setToDeleteId(null);
  };
  const confirmDelete = () => {
    dispatch(deleteOrder(toDeleteId))
      .unwrap()
      .then(() => {
        toast.success('Order deleted!', { position: 'top-center' });
        dispatch(fetchOrders());
      })
      .catch(() => {
        toast.error('Failed to delete order.', { position: 'top-center' });
      })
      .finally(closeDeleteModal);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />

      <main className="relative flex-1 p-6 lg:p-8 overflow-auto pl-[64px] lg:pl-[258px]">
        <ToastContainer />

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Transactions</h1>

        {loading ? (
          <p className="text-gray-500">Loading orders…</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">No orders found.</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    'Order ID',
                    'User',
                    'Amount',
                    'Discount',
                    'Quantity',
                    'Status',
                    'Manage',
                    'Delete'
                  ].map(header => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map(order => {
                  const qty = order.cartItems?.reduce((sum, i) => sum + i.quantity, 0) || 0;
                  const statusColor =
                    order.status === 'Processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'Shipped'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-purple-100 text-purple-800';

                  return (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">{order._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        {order.user?.name || 'Guest'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        ${order.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        ${order.discountAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">{qty}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-blue-600 hover:text-blue-800">
                        <Link to={`/admin/transaction/${order._id}`}>Manage</Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => openDeleteModal(order._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <AiOutlineDelete size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
              <p className="text-gray-700">
                Are you sure you want to delete this order? This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
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

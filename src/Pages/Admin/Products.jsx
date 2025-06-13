import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import AdminSidebar from '../../Components/Admin/AdminSidebar';
import { fetchProducts, deleteProduct } from '../../redux/slices/productSlices';

export default function Products() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(s => s.products);

  // Modal state for deleting a product
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    productName: '',
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);


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



  // Open delete modal
  const openDeleteModal = (id, name) => {
    setDeleteModal({ isOpen: true, productId: id, productName: name });
  };
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, productId: null, productName: '' });
  };


  // Confirm deletion
  const confirmDeleteProduct = async () => {
    try {
      await dispatch(deleteProduct(deleteModal.productId)).unwrap();
      toast.success(`Deleted "${deleteModal.productName}"`);
      dispatch(fetchProducts());
    } catch (err) {
      toast.error(`Delete failed: ${err.message || err}`);
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Products</h1>

        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="bg-white shadow-lg rounded-2xl overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-600">
                <tr>
                  {[
                    'Photo',
                    'Name',
                    'Price',
                    'Stock',
                    'Category',
                    'Subcategory',
                    'Colors',
                    'Actions',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map(product => {
                  const firstPhoto =
                    product.colors?.[0]?.photos?.[0]?.url ||
                    'https://via.placeholder.com/50';
                  const totalStock = product.colors?.reduce(
                    (sum, c) => sum + Number(c.stock || 0),
                    0
                  ) || 0;

                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-100"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={firstPhoto}
                          alt=""
                          className="w-12 h-12 rounded-md object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        {totalStock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        {product.category?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        {product.subcategory?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {product.colors?.length > 0 ? (
                            product.colors.map((c, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded-full border border-gray-300 overflow-hidden"
                                title={c.colorName}
                              >
                                <img
                                  src={c.photos?.[0]?.url || 'https://via.placeholder.com/30'}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-4">
                        <Link to={`/admin/product/${product._id}`} className="text-indigo-600 hover:text-indigo-800">
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() =>
                            openDeleteModal(product._id, product.name)
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <motion.div
          whileHover={{ scale: 1.1 }}
          className="absolute bottom-8 right-8"
        >
          <Link
            to="/admin/products/new"
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
            title="Add Product"
          >
            <FaPlus size={20} />
          </Link>
        </motion.div>

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold mb-4">
                Delete “{deleteModal.productName}”?
              </h3>
              <p className="text-gray-700">
                This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteProduct}
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

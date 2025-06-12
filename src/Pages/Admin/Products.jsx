import { useEffect } from 'react';
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

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = async id => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success('Product deleted');
      dispatch(fetchProducts());
    } catch (err) {
      toast.error(`Delete failed: ${err}`);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 relative lg:pl-[258px]">
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
                          onClick={() => handleDelete(product._id)}
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
      </main>
    </div>
  );
}

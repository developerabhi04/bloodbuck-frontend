import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AdminSidebar from '../../../Components/Admin/AdminSidebar';
import Loadertwo from '../../../Components/Loader/Loadertwo';
import { fetchOrderDetails, updateOrderStatus } from '../../../redux/slices/orderSlices';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight } from 'react-icons/fa';

const STEP_LABELS = ['Processing', 'Shipped', 'Delivered'];

export default function TransactionManagement() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { orderDetails, loading, error } = useSelector(s => s.order);
  const [previewImage, setPreviewImage] = useState(null);
  const [expandedPanel, setExpandedPanel] = useState('shipping');

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading) return <Loadertwo />;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!orderDetails) return <p className="p-6 text-gray-600">No order found.</p>;

  const {
    user,
    cartItems,
    shippingDetails,
    subtotal,
    tax,
    discountAmount,
    total,
    paymentMethod,
    status
  } = orderDetails;

  const currentStep = STEP_LABELS.indexOf(status);

  const handleStepClick = (stepLabel) => {
    if (STEP_LABELS.indexOf(stepLabel) > currentStep) {
      dispatch(updateOrderStatus(id)).unwrap().then(() => dispatch(fetchOrderDetails(id)));
    }
  };

  const updateHandler = async () => {
    await dispatch(updateOrderStatus(id));
    dispatch(fetchOrderDetails(id));
  };


  const togglePanel = (panel) => {
    setExpandedPanel(expandedPanel === panel ? null : panel);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto lg:pl-[260px]">
        <motion.h1
          className="text-3xl font-bold text-gray-800 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Order #{id}
        </motion.h1>

        {/* Stepper */}
        <motion.div
          className="flex items-center space-x-4 mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {STEP_LABELS.map((label, idx) => (
            <motion.div
              key={label}
              className="flex items-center cursor-pointer"
              onClick={() => handleStepClick(label)}
              whileHover={{ scale: 1.05 }}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-semibold 
                  ${idx <= currentStep ? 'bg-blue-600' : 'bg-gray-300 text-gray-600'}`}
              >
                {idx + 1}
              </div>
              <span className={`ml-2 ${idx <= currentStep ? 'text-blue-600' : 'text-gray-600'}`}>
                {label}
              </span>
              {idx < STEP_LABELS.length - 1 && (
                <FaChevronRight className="mx-4 text-gray-400" />
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Items */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Items</h2>
            <div className="space-y-6">
              {cartItems.map(item => (
                <motion.div
                  key={item._id || item.productId?._id}
                  className="bg-white rounded-2xl shadow p-6 flex flex-col lg:flex-row gap-6"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={item.productId?.photos?.[0]?.url || item.imageUrl || 'https://via.placeholder.com/100'}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded-lg cursor-pointer"
                    onClick={() => setPreviewImage(item.productId?.photos?.[0]?.url)}
                  />
                  <div className="flex-1 grid gap-2">
                    <p className="text-lg font-medium text-gray-800">{item.name}</p>
                    <p className="text-gray-600">
                      ${item.price} × {item.quantity} ={' '}
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    {item.selectedSize && <p className="text-gray-600">Size: {item.selectedSize}</p>}
                    {item.selectedSeamSize && <p className="text-gray-600">Seam Size: {item.selectedSeamSize}</p>}
                    {item.selectedColorName && <p className="text-gray-600">Color: {item.selectedColorName}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Right: Order Info */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Order Info</h2>
            <div className="space-y-4">
              {[
                {
                  key: 'shipping',
                  title: 'Shipping Details',
                  content: (
                    <>
                      <p>Name: {user?.name || 'Guest'}</p>
                      <p>Email: {user?.email || 'N/A'}</p>
                      <p>Phone: {shippingDetails?.phoneNumber || 'N/A'}</p>
                      <p>
                        Address: {shippingDetails?.address}, {shippingDetails?.city}, {shippingDetails?.state}{' '}
                        {shippingDetails?.zipCode}
                      </p>
                    </>
                  )
                },
                {
                  key: 'payment',
                  title: 'Payment & Amount',
                  content: (
                    <>
                      <p>Method: {paymentMethod}</p>
                      <p>Subtotal: ${subtotal.toFixed(2)}</p>
                      <p>Tax: ${tax.toFixed(2)}</p>
                      <p>Discount: ${discountAmount.toFixed(2)}</p>
                      <p className="font-bold">Total: ${total.toFixed(2)}</p>
                    </>
                  )
                },
                {
                  key: 'status',
                  title: 'Status',
                  content: (
                    <>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {status}
                      </span>
                      {status !== 'Delivered' && (
                        <button
                          onClick={updateHandler}
                          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md disabled:opacity-50"
                          disabled={loading}
                        >
                          {loading ? 'Processing...' : 'Process Order'}
                        </button>
                      )}
                    </>
                  )
                }
              ].map(({ key, title, content }) => (
                <div key={key} className="bg-white rounded-2xl shadow">
                  <button
                    onClick={() => togglePanel(key)}
                    className="w-full px-6 py-4 flex justify-between items-center text-lg font-medium text-gray-800"
                  >
                    {title}
                    <motion.span
                      animate={{ rotate: expandedPanel === key ? 180 : 0 }}
                      className="text-gray-500"
                    >
                      ▼
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {expandedPanel === key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 text-gray-600"
                      >
                        {content}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Image Preview Modal */}
        <AnimatePresence>
          {previewImage && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewImage(null)}
            >
              <motion.img
                src={previewImage}
                alt="Preview"
                className="max-w-md max-h-[80vh] rounded-lg shadow-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

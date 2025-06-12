// src/components/admin/ProductManagement.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleProduct, updateProduct } from '../../../redux/slices/productSlices';
import { fetchCategories } from '../../../redux/slices/categorySlices';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt, FaTrash, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import { toast } from 'react-toastify';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../../../Components/Admin/AdminSidebar';

const ProductManagement = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Global product fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');

  // Color variants
  const [colorVariants, setColorVariants] = useState([]);

  const { product, loading, error } = useSelector(s => s.products);
  const { categories } = useSelector(s => s.categories);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchCategories());
    if (productId) dispatch(fetchSingleProduct(productId));
  }, [dispatch, productId]);

  // Populate when product loads
  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      setCategory(product.category?._id || '');
      setSubcategory(product.subcategory?._id || '');

      const mapped = product.colors?.map(col => ({
        colorName: col.colorName || '',
        stock: col.stock || 0,
        files: [],
        previews: col.photos.map(p => p.url),
        colorImageFile: null,
        colorImagePreview: col.colorImage?.url || '',
      })) || [];
      setColorVariants(mapped);
    }
  }, [product]);

  // Handlers for variants
  const handleVariantChange = (i, field, val) =>
    setColorVariants(v => v.map((x, idx) => idx === i ? { ...x, [field]: val } : x));

  const handleColorImageUpload = (i, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    handleVariantChange(i, 'colorImageFile', file);
    handleVariantChange(i, 'colorImagePreview', preview);
  };

  const removeColorImage = i =>
    handleVariantChange(i, 'colorImagePreview', '') ||
    handleVariantChange(i, 'colorImageFile', null);

  const handleFilesUpload = (i, e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(f => URL.createObjectURL(f));
    setColorVariants(v =>
      v.map((x, idx) =>
        idx === i
          ? { ...x, files: [...x.files, ...files], previews: [...x.previews, ...previews] }
          : x
      )
    );
  };

  const removeFile = (vi, fi) =>
    setColorVariants(v =>
      v.map((x, idx) =>
        idx === vi
          ? {
            ...x,
            previews: x.previews.filter((_, j) => j !== fi),
            files: x.files.filter((_, j) => j !== fi),
          }
          : x
      )
    );

  const removeVariant = i =>
    setColorVariants(v => v.filter((_, idx) => idx !== i));

  const addVariant = () =>
    setColorVariants(v => [
      ...v,
      { colorName: '', stock: '', files: [], previews: [], colorImageFile: null, colorImagePreview: '' },
    ]);

  // Submit
  const handleSubmit = e => {
    e.preventDefault();
    if (!product) {
      toast.error('No product loaded');
      return;
    }
    const fd = new FormData();
    fd.append('name', name);
    fd.append('price', price);
    fd.append('category', category);
    fd.append('subcategory', subcategory);
    fd.append('description', description);
    fd.append('numColorVariants', colorVariants.length);
    colorVariants.forEach((v, i) => {
      fd.append(`colorName${i}`, v.colorName || `Variant ${i + 1}`);
      fd.append(`colorStock${i}`, v.stock || 0);
      if (v.colorImageFile) fd.append(`colorImage${i}`, v.colorImageFile);
      v.files.forEach(f => fd.append(`colorImages${i}`, f));
    });

    dispatch(updateProduct({ id: productId, updatedData: fd }))
      .unwrap()
      .then(() => {
        toast.success('Product updated!');
        setTimeout(() => navigate('/admin/products'), 1200);
      })
      .catch(err => toast.error(err.message || 'Update failed'));
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto lg:pl-[258px]">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Update Product</h1>

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
            {/* Basic Info */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow p-6"
            >
              <div className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-t-2xl mb-6">
                <h2 className="text-white text-xl font-semibold">Basic Information</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Category</label>
                  <select
                    required
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Subcategory</label>
                  <select
                    required
                    value={subcategory}
                    onChange={e => setSubcategory(e.target.value)}
                    className="w-full border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select Subcategory</option>
                    {categories.find(c => c._id === category)?.subcategories.map(sub => (
                      <option key={sub._id} value={sub._id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-1">Description</label>
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    className="bg-white"
                  />
                </div>
              </div>
            </motion.section>

            {/* Color Variants */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow p-6"
            >
              <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-t-2xl mb-6">
                <h2 className="text-white text-xl font-semibold">Color Variants</h2>
              </div>

              <div className="space-y-8">
                {colorVariants.map((v, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">Variant {i + 1}</h3>
                      {colorVariants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(i)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="block text-gray-700 mb-1">Color Name</label>
                        <input
                          type="text"
                          value={v.colorName}
                          onChange={e => handleVariantChange(i, 'colorName', e.target.value)}
                          className="w-full border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">Stock</label>
                        <input
                          type="number"
                          value={v.stock}
                          onChange={e => handleVariantChange(i, 'stock', e.target.value)}
                          className="w-full border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 mb-1">Dedicated Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleColorImageUpload(i, e)}
                          className="text-sm"
                        />
                        {v.colorImagePreview && (
                          <div className="mt-2 flex items-center space-x-2">
                            <img src={v.colorImagePreview} alt="" className="w-24 h-24 rounded-md object-cover" />
                            <button
                              type="button"
                              onClick={() => removeColorImage(i)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-1">Additional Images</label>
                      <label className="flex items-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                        <FaCloudUploadAlt className="text-gray-500" />
                        <span className="text-gray-600">Upload Images</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={e => handleFilesUpload(i, e)}
                          className="hidden"
                        />
                      </label>
                      {v.previews.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-4">
                          {v.previews.map((src, idx) => (
                            <div key={idx} className="relative">
                              <img src={src} alt="" className="w-full h-24 object-cover rounded-md" />
                              <button
                                type="button"
                                onClick={() => removeFile(i, idx)}
                                className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600 shadow hover:bg-gray-100"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addVariant}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                >
                  + Add Variant
                </button>
              </div>
            </motion.section>

            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-lg"
              >
                {loading ? 'Updating…' : 'Update Product'}
              </button>
              {error && <p className="mt-2 text-red-600">{error}</p>}
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default ProductManagement;

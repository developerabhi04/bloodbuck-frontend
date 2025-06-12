import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaEdit, FaTags, FaTag } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AdminSidebar from '../../Components/Admin/AdminSidebar';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from '../../redux/slices/categorySlices';

const Category = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(s => s.categories);

  // Category form state
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState(null);
  const [editCat, setEditCat] = useState(null);

  // Subcategory form state
  const [subName, setSubName] = useState('');
  const [parentCat, setParentCat] = useState('');
  const [editSub, setEditSub] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handlers
  const resetCatForm = () => {
    setCatName(''); setCatImage(null); setEditCat(null);
  };
  const resetSubForm = () => {
    setSubName(''); setParentCat(''); setEditSub(null);
  };

  const submitCategory = async e => {
    e.preventDefault();
    if (!catName.trim()) return toast.error('Name required');
    const fd = new FormData();
    fd.append('name', catName);
    if (catImage) fd.append('photo', catImage);

    if (editCat) {
      await dispatch(updateCategory({ id: editCat._id, formData: fd })).unwrap();
      toast.success('Category updated');
    } else {
      await dispatch(addCategory(fd)).unwrap();
      toast.success('Category added');
    }
    dispatch(fetchCategories());
    resetCatForm();
  };

  const submitSub = async e => {
    e.preventDefault();
    if (!subName.trim() || !parentCat) return toast.error('All fields required');

    if (editSub) {
      await dispatch(updateSubCategory({
        id: editSub._id,
        name: subName,
        categoryId: parentCat
      })).unwrap();
      toast.success('Subcategory updated');
    } else {
      await dispatch(addSubCategory({ name: subName, categoryId: parentCat })).unwrap();
      toast.success('Subcategory added');
    }
    dispatch(fetchCategories());
    resetSubForm();
  };

  const removeCat = async id => {
    if (!window.confirm('Delete this category?')) return;
    await dispatch(deleteCategory(id)).unwrap();
    toast.success('Category deleted');
    dispatch(fetchCategories());
  };

  const removeSub = async id => {
    if (!window.confirm('Delete this subcategory?')) return;
    await dispatch(deleteSubCategory(id)).unwrap();
    toast.success('Subcategory deleted');
    dispatch(fetchCategories());
  };

  const handleEditCat = cat => {
    setEditCat(cat);
    setCatName(cat.name);
    setCatImage(null);
  };

  const handleEditSub = (sub, catId) => {
    setEditSub(sub);
    setSubName(sub.name);
    setParentCat(catId);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 pl-[64px] lg:pl-[258px] overflow-auto">
        <div className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-2">
          {/* Categories Card */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="flex items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
              <FaTags className="text-white text-2xl mr-3" />
              <h2 className="text-white text-xl font-semibold">Categories</h2>
            </div>

            <div className="p-6">
              {/* Category Form */}
              <form onSubmit={submitCategory} className="grid gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={catName}
                    onChange={e => setCatName(e.target.value)}
                    placeholder="Category name"
                    className="w-full border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setCatImage(e.target.files[0])}
                    className="text-sm"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={`w-max px-6 py-2 rounded-full text-white ${editCat ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                  {editCat ? 'Update Category' : 'Add Category'}
                </motion.button>
              </form>

              {/* Category List */}
              {loading ? (
                <div className="py-6 text-center text-gray-500">Loading...</div>
              ) : error ? (
                <div className="py-6 text-center text-red-600">{error}</div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                  className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {categories.map(cat => (
                    <motion.div
                      key={cat._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.03 }}
                      className="group relative border border-gray-200 rounded-lg p-4 flex flex-col items-center"
                    >
                      {cat.photos?.[0]?.url && (
                        <img
                          src={cat.photos[0].url}
                          alt={cat.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <h3 className="mt-3 text-center font-medium">{cat.name}</h3>

                      <div className="absolute top-3 right-3 flex opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditCat(cat)}
                          className="text-yellow-500 hover:text-yellow-600 mr-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => removeCat(cat._id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.section>

          {/* Subcategories Card */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="flex items-center px-6 py-4 bg-gradient-to-r from-green-500 to-teal-500">
              <FaTag className="text-white text-2xl mr-3" />
              <h2 className="text-white text-xl font-semibold">Subcategories</h2>
            </div>

            <div className="p-6">
              {/* Subcategory Form */}
              <form onSubmit={submitSub} className="grid gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-1">Parent Category</label>
                  <select
                    value={parentCat}
                    onChange={e => setParentCat(e.target.value)}
                    className="w-full border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Subcategory Name</label>
                  <input
                    type="text"
                    value={subName}
                    onChange={e => setSubName(e.target.value)}
                    placeholder="Subcategory name"
                    className="w-full border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400"
                    required
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={`w-max px-6 py-2 rounded-full text-white ${editSub ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                  {editSub ? 'Update Subcategory' : 'Add Subcategory'}
                </motion.button>
              </form>

              {/* Subcategory List */}
              {loading ? (
                <div className="py-6 text-center text-gray-500">Loading...</div>
              ) : (
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                  className="space-y-4"
                >
                  {categories.map(cat =>
                    cat.subcategories?.map(sub => (
                      <motion.li
                        key={sub._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        className="group flex items-center justify-between bg-gray-50 rounded-lg p-4"
                      >
                        <div>
                          <span className="font-medium">{sub.name}</span>
                          <span className="ml-2 text-sm text-gray-500">
                            (in {cat.name})
                          </span>
                        </div>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditSub(sub, cat._id)}
                            className="text-yellow-500 hover:text-yellow-600"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => removeSub(sub._id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </motion.li>
                    ))
                  )}
                </motion.ul>
              )}
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default Category;

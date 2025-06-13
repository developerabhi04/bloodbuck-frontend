// src/pages/Admin/SecondBanner.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminSidebar from '../../../../Components/Admin/AdminSidebar';
import {
    addSecondBanner,
    deleteBanner,
    fetchSecondBanners,
    updateSecondBanner
} from '../../../../redux/slices/secondBannerSlices';
import { FaCloudUploadAlt, FaEdit, FaTimes, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SecondBanner() {
    const dispatch = useDispatch();
    const { banners, loading } = useSelector(state => state.secondBanner);

    const [formData, setFormData] = useState({
        headingOne: '',
        photos: []
    });
    const [previewPhotos, setPreviewPhotos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);


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
        dispatch(fetchSecondBanners());
    }, [dispatch]);

    const handleChange = e =>
        setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

    const handlePhotoUpload = e => {
        const files = Array.from(e.target.files || []);
        setFormData(f => ({ ...f, photos: [...f.photos, ...files] }));
        setPreviewPhotos(p => [...p, ...files.map(f => URL.createObjectURL(f))]);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!formData.photos.length) {
            toast.error('Please upload at least one image.');
            return;
        }
        const data = new FormData();
        data.append('headingOne', formData.headingOne);
        formData.photos.forEach(photo => data.append('photos', photo));
        try {
            if (isEditing) {
                await dispatch(updateSecondBanner({ id: editingId, data })).unwrap();
                toast.success('Banner updated!');
            } else {
                await dispatch(addSecondBanner(data)).unwrap();
                toast.success('Banner added!');
            }
            dispatch(fetchSecondBanners());
            resetForm();
        } catch {
            toast.error('Something went wrong!');
        }
    };

    const resetForm = () => {
        setFormData({ headingOne: '', photos: [] });
        setPreviewPhotos([]);
        setIsEditing(false);
        setEditingId(null);
    };

    const handleEdit = banner => {
        setFormData({ headingOne: banner.headingOne, photos: [] });
        setPreviewPhotos(banner.photos.map(p => p.url));
        setIsEditing(true);
        setEditingId(banner._id);
    };

    const handleDelete = id => {
        if (!window.confirm('Delete this banner?')) return;
        dispatch(deleteBanner(id));
        toast.success('Banner deleted!');
        dispatch(fetchSecondBanners());
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />

            <main className={
                `relative flex-1 p-6 lg:p-8 overflow-auto pl-[64px] ` +
                (collapsed ? 'lg:pl-[100px]' : 'lg:pl-[260px]')
            }>
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Manage Second Banner</h1>
                    <nav className="text-sm text-gray-600 mt-1">Home / Banners / Second</nav>
                </header>

                <ToastContainer />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form */}
                    <section className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {isEditing ? 'Edit Banner' : 'New Banner'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {banners.length !== 1 && (
                                <div>
                                    <label className="block text-gray-700 mb-1">Heading</label>
                                    <input
                                        type="text"
                                        name="headingOne"
                                        value={formData.headingOne}
                                        onChange={handleChange}
                                        placeholder="Banner heading"
                                        className="w-full border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-gray-700 mb-1">Images</label>
                                <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32 cursor-pointer hover:border-indigo-500 transition">
                                    <FaCloudUploadAlt className="text-gray-400 text-2xl" />
                                    <span className="ml-2 text-gray-500">Click to upload</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="sr-only"
                                        required={!isEditing}
                                    />
                                </label>
                                {previewPhotos.length > 0 && (
                                    <div className="mt-4 grid grid-cols-3 gap-4">
                                        {previewPhotos.map((src, idx) => (
                                            <div key={idx} className="relative group">
                                                <img
                                                    src={src}
                                                    alt="preview"
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPreviewPhotos(p => p.filter((_, i) => i !== idx));
                                                        setFormData(f => ({
                                                            ...f,
                                                            photos: f.photos.filter((_, i) => i !== idx)
                                                        }));
                                                    }}
                                                    className="absolute top-1 right-1 bg-white p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <FaTimes size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg py-2"
                            >
                                {isEditing ? 'Update Banner' : 'Add Banner'}
                            </motion.button>
                        </form>
                    </section>

                    {/* List */}
                    <section className="col-span-2 space-y-6">
                        {loading && <p className="text-gray-600">Loading banners…</p>}
                        {!loading && banners.length === 0 && (
                            <p className="text-gray-600">No banners available.</p>
                        )}
                        {!loading && banners.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {banners.map(banner => (
                                    <div
                                        key={banner._id}
                                        className="bg-white rounded-lg shadow p-6 flex flex-col"
                                    >
                                        {banner.headingOne && (
                                            <h3 className="text-lg font-semibold mb-2">
                                                {banner.headingOne}
                                            </h3>
                                        )}
                                        <div className="flex-1 grid grid-cols-1 gap-4 mb-4">
                                            {banner.photos.map(photo => (
                                                <img
                                                    key={photo.public_id}
                                                    src={photo.url}
                                                    alt="Banner"
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                            ))}
                                        </div>
                                        <div className="mt-auto flex space-x-3">
                                            <button
                                                onClick={() => handleEdit(banner)}
                                                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg py-2 flex items-center justify-center gap-2"
                                            >
                                                <FaEdit /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(banner._id)}
                                                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 flex items-center justify-center gap-2"
                                            >
                                                <FaTrash /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

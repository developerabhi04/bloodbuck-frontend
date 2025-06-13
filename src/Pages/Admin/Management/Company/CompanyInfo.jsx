// src/pages/Admin/CompanyInfo.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminSidebar from '../../../../Components/Admin/AdminSidebar';
import {
    addCompanyInfo,
    deleteCompanyInfo,
    fetchCompanyInfo,
    updateCompanyInfo
} from '../../../../redux/slices/companyDetailsSlices';
import { FaCloudUploadAlt, FaEdit, FaTimes, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CompanyInfo() {
    const dispatch = useDispatch();
    const { companys, loading } = useSelector(state => state.company);

    const [formData, setFormData] = useState({
        address: '',
        phone: '',
        email: '',
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        logo: []
    });
    const [previewLogo, setPreviewLogo] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        dispatch(fetchCompanyInfo());
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


    const handleChange = e =>
        setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleLogoUpload = e => {
        const files = Array.from(e.target.files || []);
        setFormData(f => ({ ...f, logo: files }));
        setPreviewLogo(files.map(f => URL.createObjectURL(f)));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!formData.logo.length) {
            toast.error('Please upload your logo.');
            return;
        }
        const data = new FormData();
        data.append('address', formData.address);
        data.append('phone', formData.phone);
        data.append('email', formData.email);
        data.append('facebook', formData.facebook);
        data.append('twitter', formData.twitter);
        data.append('instagram', formData.instagram);
        data.append('linkedin', formData.linkedin);
        data.append('logo', formData.logo[0]);

        try {
            if (isEditing && editingId) {
                await dispatch(updateCompanyInfo({ id: editingId, data })).unwrap();
                toast.success('Company info updated!');
            } else {
                await dispatch(addCompanyInfo(data)).unwrap();
                toast.success('Company info created!');
            }
            dispatch(fetchCompanyInfo());
            resetForm();
        } catch {
            toast.error('Something went wrong!');
        }
    };

    const resetForm = () => {
        setFormData({
            address: '',
            phone: '',
            email: '',
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: '',
            logo: []
        });
        setPreviewLogo([]);
        setIsEditing(false);
        setEditingId(null);
    };

    const handleEdit = item => {
        setFormData({
            address: item.address,
            phone: item.phone,
            email: item.email,
            facebook: item.facebook,
            twitter: item.twitter,
            instagram: item.instagram,
            linkedin: item.linkedin,
            logo: []
        });
        setPreviewLogo(item.logo.map(l => l.url));
        setIsEditing(true);
        setEditingId(item._id);
    };

    const handleDelete = id => {
        if (!window.confirm('Delete this company info?')) return;
        dispatch(deleteCompanyInfo(id));
        toast.success('Deleted successfully!');
        dispatch(fetchCompanyInfo());
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
                    <h1 className="text-3xl font-bold text-gray-900">Company Information</h1>
                    <nav className="text-sm text-gray-600 mt-1">
                        Home / Settings / Company Info
                    </nav>
                </header>

                <ToastContainer />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ▶️ Form Section */}
                    <section className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {isEditing ? 'Edit Info' : 'Add New Info'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {[
                                { label: 'Address', name: 'address', type: 'text' },
                                { label: 'Phone', name: 'phone', type: 'tel' },
                                { label: 'Email', name: 'email', type: 'email' },
                                { label: 'Facebook URL', name: 'facebook', type: 'url' },
                                { label: 'Twitter URL', name: 'twitter', type: 'url' },
                                { label: 'Instagram URL', name: 'instagram', type: 'url' },
                                { label: 'LinkedIn URL', name: 'linkedin', type: 'url' }
                            ].map(field => (
                                <div key={field.name}>
                                    <label className="block text-gray-700 mb-1">{field.label}</label>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        placeholder={`Enter ${field.label}`}
                                        className="border w-full border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="block text-gray-700 mb-1">Logo</label>
                                <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32 cursor-pointer hover:border-indigo-500 transition">
                                    <FaCloudUploadAlt className="text-gray-400 text-2xl" />
                                    <span className="ml-2 text-gray-500">Upload logo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="sr-only"
                                        required={!isEditing}
                                    />
                                </label>
                                {previewLogo.length > 0 && (
                                    <div className="mt-4 grid grid-cols-3 gap-4">
                                        {previewLogo.map((src, idx) => (
                                            <div key={idx} className="relative group">
                                                <img
                                                    src={src}
                                                    alt="logo preview"
                                                    className="w-full h-24 object-contain rounded-lg bg-gray-50"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPreviewLogo(p => p.filter((_, i) => i !== idx));
                                                        setFormData(f => ({
                                                            ...f,
                                                            logo: f.logo.filter((_, i) => i !== idx)
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
                                {isEditing ? 'Update Info' : 'Save Info'}
                            </motion.button>
                        </form>
                    </section>

                    {/* ▶️ List Section */}
                    <section className="col-span-2 space-y-6">
                        {loading && <p className="text-gray-600">Loading…</p>}
                        {!loading && companys.length === 0 && (
                            <p className="text-gray-600">No company info available.</p>
                        )}
                        {!loading && companys.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {companys.map(item => (
                                    <div
                                        key={item._id}
                                        className="bg-white rounded-lg shadow p-6 flex flex-col"
                                    >
                                        <div className="flex-1 space-y-2 mb-4">
                                            <p><span className="font-semibold">Address:</span> {item.address}</p>
                                            <p><span className="font-semibold">Phone:</span> {item.phone}</p>
                                            <p><span className="font-semibold">Email:</span> {item.email}</p>
                                            <p><span className="font-semibold">Facebook:</span> {item.facebook}</p>
                                            <p><span className="font-semibold">Twitter:</span> {item.twitter}</p>
                                            <p><span className="font-semibold">Instagram:</span> {item.instagram}</p>
                                            <p><span className="font-semibold">LinkedIn:</span> {item.linkedin}</p>
                                        </div>
                                        <div className="mb-4">
                                            {item.logo.map(l => (
                                                <img
                                                    key={l.public_id}
                                                    src={l.url}
                                                    alt="logo"
                                                    className="h-16 object-contain"
                                                />
                                            ))}
                                        </div>
                                        <div className="mt-auto flex space-x-3">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg py-2 flex items-center justify-center gap-2"
                                            >
                                                <FaEdit /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
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

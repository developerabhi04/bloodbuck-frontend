import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminSidebar from '../../Components/Admin/AdminSidebar';
import Loadertwo from '../../Components/Loader/Loadertwo';
import {
  fetchUsers,
  deleteUser,
  updateUserRole
} from '../../redux/slices/userSlices';

const Customers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((s) => s.user);

  // Modal state for deleting a user
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: null,
    userName: ''
  });

  // Modal state for changing role
  const [roleModal, setRoleModal] = useState({
    isOpen: false,
    userId: null,
    userName: '',
    newRole: 'user'
  });

  useEffect(() => {
    dispatch(fetchUsers());
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



  // opens delete-user modal
  const openDeleteModal = (id, name) => {
    setDeleteModal({ isOpen: true, userId: id, userName: name });
  };
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, userId: null, userName: '' });
  };

  // actually delete the user
  const confirmDeleteUser = () => {
    dispatch(deleteUser(deleteModal.userId))
      .unwrap()
      .then(() => {
        toast.success(`Deleted ${deleteModal.userName}`);
        dispatch(fetchUsers());
      })
      .catch((err) => toast.error(`Delete failed: ${err.message || err}`))
      .finally(closeDeleteModal);
  };

  // opens role-change modal
  const openRoleModal = (id, name, currentRole, selectedRole) => {
    setRoleModal({
      isOpen: true,
      userId: id,
      userName: name,
      newRole: selectedRole
    });
  };
  const closeRoleModal = () => {
    setRoleModal({ isOpen: false, userId: null, userName: '', newRole: 'user' });
  };

  // actually change the role
  const confirmChangeRole = () => {
    const { userId, userName, newRole } = roleModal;
    dispatch(updateUserRole({ id: userId, role: newRole }))
      .unwrap()
      .then(() => {
        toast.success(`${userName} is now a ${newRole}`);
        dispatch(fetchUsers());
      })
      .catch((err) => toast.error(`Role change failed: ${err.message || err}`))
      .finally(closeRoleModal);
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

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Customers</h1>

        {loading ? (
          <Loadertwo />
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {['Avatar', 'Name', 'Email', 'Role', 'Change Role', 'Action'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={user.avatar[0]?.url}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role || 'user'}
                        onChange={(e) =>
                          openRoleModal(
                            user._id,
                            user.name,
                            user.role,
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openDeleteModal(user._id, user.name)}
                        disabled={user.role === 'admin'}
                        className={`p-2 rounded-full ${user.role === 'admin'
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                        title="Delete User"
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
                Delete {deleteModal.userName}?
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
                  onClick={confirmDeleteUser}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Role-Change Confirmation Modal */}
        {roleModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold mb-4">
                Change {roleModal.userName}’s role to {roleModal.newRole}?
              </h3>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={closeRoleModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmChangeRole}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Customers;

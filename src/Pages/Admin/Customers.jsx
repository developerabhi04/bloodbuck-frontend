import { useEffect } from 'react';
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

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    dispatch(deleteUser(id))
      .unwrap()
      .then(() => {
        toast.success('User deleted');
        dispatch(fetchUsers());
      })
      .catch((err) => toast.error(`Delete failed: ${err.message || err}`));
  };

  const handleRoleChange = (id, name, email, newRole) => {
    if (!window.confirm(`Change ${name}'s role to ${newRole}?`)) return;
    dispatch(updateUserRole({ id, name, email, role: newRole }))
      .unwrap()
      .then(() => {
        toast.success(`${name} is now a ${newRole}`);
        dispatch(fetchUsers());
      })
      .catch((err) => toast.error(err.message || err));
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />

      <main className="relative flex-1 p-6 lg:p-8 overflow-auto pl-[64px] lg:pl-[258px]">
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
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{user.email}</td>
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
                          handleRoleChange(
                            user._id,
                            user.name,
                            user.email,
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
                        onClick={() => handleDelete(user._id)}
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
      </main>
    </div>
  );
};

export default Customers;

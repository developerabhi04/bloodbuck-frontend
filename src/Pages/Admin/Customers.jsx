import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, fetchUsers, updateUserRole } from "../../redux/slices/userSlices";
import AdminSidebar from "../../Components/Admin/AdminSidebar";
import TableHOC from "../../Components/Admin/TableHOC";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Loadertwo from "../../Components/Loader/Loadertwo";

const columns = [
  { Header: "Avatar", accessor: "avatar" },
  { Header: "Name", accessor: "name" },
  { Header: "Email", accessor: "email" },
  { Header: "Role", accessor: "role" },
  { Header: "Change Role", accessor: "roles" },
  { Header: "Action", accessor: "action" },
];

const Customers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Delete user function
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  // Update user role based on select choice
  const handleRoleChange = (id, name, email, newRole) => {
    if (window.confirm(`Change ${name}'s role to ${newRole}?`)) {
      dispatch(updateUserRole({ id, name, email, role: newRole }))
        .unwrap()
        .then(() => toast.success(`User role changed to ${newRole}`))
        .catch((err) => toast.error(err));
    }
  };

  // Transform users into table-friendly format
  const data = users.map((user) => ({
    avatar: (
      <img
        style={{ borderRadius: "50%", width: "40px", height: "40px" }}
        src={user.avatar[0]?.url}
        alt="Avatar"
      />
    ),
    name: user.name,
    email: user.email,
    role: (
      <span
        style={{
          background: user.role === "admin" ? "green" : "red",
          fontWeight: "bold",
          color: "white",
          padding: "0.25rem 0.5rem",
          borderRadius: "5px",
        }}
      >
        {user.role || "user"}
      </span>
    ),
    // Select dropdown for changing role
    roles: (
      <select
        value={user.role || "user"}
        onChange={(e) =>
          handleRoleChange(
            user._id,
            user.name,
            user.email,
            e.target.value
          )
        }
        style={{
          padding: "0.25rem 0.5rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    ),
    action: (
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <button
          onClick={() => handleDelete(user._id)}
          disabled={user.role === "admin"}
          style={{
            padding: "0.25rem 0.5rem",
            border: "none",
            background: user.role === "admin" ? "#ccc" : "transparent",
            color: user.role === "admin" ? "#666" : "red",
            cursor: user.role === "admin" ? "not-allowed" : "pointer",
          }}
        >
          <FaTrash />
        </button>
      </div>
    ),
  }));

  // Wrap TableHOC in useCallback to avoid re-renders
  const Table = useCallback(() => {
    return TableHOC(columns, data, "dashboard-product-box", "Customers", true)();
  }, [columns, data]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>
        {loading ? (
          <>
            <Loadertwo />
          </>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <Table />
        )}
      </main>
    </div>
  );
};

export default Customers;
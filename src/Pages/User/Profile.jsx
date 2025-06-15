import { useState, useMemo } from "react";
import {
  PersonPin,
  Home,
  LockOpen,
  LockReset,
  AdminPanelSettings,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const avatarUrl = user?.avatar[0]?.url;
  console.log(user);

  const [activeSection, setActiveSection] = useState("profile");
  const [updatedUser, setUpdatedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.address || "",
  });

  const tabs = useMemo(
    () => [
      { id: "profile", label: "Profile", Icon: PersonPin },
      { id: "address", label: "Address", Icon: Home },
      { id: "changePassword", label: "Change Password", Icon: LockOpen },
      { id: "forgotPassword", label: "Reset Password", Icon: LockReset },
    ],
    []
  );

  // Calculate completeness %
  const completeness = useMemo(() => {
    const fields = [updatedUser.name, updatedUser.email, updatedUser.address];
    const filled = fields.filter((v) => v && v.trim()).length;
    return Math.round((filled / fields.length) * 100);
  }, [updatedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // dispatch update action...
  };

  const goToAdmin = () => navigate("/admin/dashboard");

  return (
    <>
      <Helmet>
        <title>My Profile | Your Store</title>
        <meta
          name="description"
          content="Manage your account details and preferences at Your Store."
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <section className="min-h-screen bg-gray-100 py-32 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Sidebar */}
          <aside className="md:col-span-4 bg-white shadow-xl rounded-lg overflow-hidden">

            {/* <div className="bg-gradient-to-r from-indigo-600 to-blue-500 h-32 relative"> */}
            <div className="bg-gray-900 h-32 relative">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-white absolute -bottom-16 left-1/2 transform -translate-x-1/2 object-cover"
              />
            </div>
            <div className="mt-20 text-center px-6 pb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {user.name}
              </h2>
              <p className="mt-1 text-gray-500">{user.email}</p>

              {/* Profile completeness */}
              <div className="mt-4">
                <p className="text-[12px] text-gray-600 mb-1">
                  Profile Completeness: {completeness}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gray-900 h-2"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
              </div>
            </div>
            <nav className="px-4 pb-6">
              <ul className="space-y-2">
                {tabs.map(({ id, label, Icon }) => (
                  <li
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg cursor-pointer transition ${activeSection === id
                      ? "bg-indigo-50 text-gray-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <Icon fontSize="small" />
                    <span className="text-[14px]">{label}</span>
                  </li>
                ))}
              </ul>

              {user?.role === "admin" && (
                <div className="mt-6 border-t pt-4">
                  <button
                    onClick={goToAdmin}
                    className="w-full flex items-center justify-center space-x-2 text-bg-gray-400 hover:text-gray-800 transition font-medium"
                  >
                    <AdminPanelSettings fontSize="small" />
                    <span>Admin Dashboard</span>
                  </button>
                </div>
              )}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-8 space-y-6">
            <div className="bg-white shadow-xl rounded-lg p-8">
              {/* Tab Bar */}
              <div className="flex space-x-8 border-b border-gray-200">
                {tabs.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`pb-2 relative transition font-medium ${activeSection === id
                      ? "text--gray-700"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    {label}
                    {activeSection === id && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900" />
                    )}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="mt-6 transition-opacity duration-300 ease-in-out text-[13px]">
                {activeSection === "profile" && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-[15px] font-semibold text-gray-800">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {["name", "email"].map((field) => (
                        <div key={field} className="flex flex-col">
                          <label className="mb-2 text-gray-700 font-medium capitalize">
                            {field.replace("email", "Email Address")}
                          </label>
                          <input
                            type={field === "email" ? "email" : "text"}
                            name={field}
                            value={updatedUser[field]}
                            onChange={handleChange}
                            disabled={field === "email"}
                            className={`px-4 py-2 border rounded-lg focus:ring-2 transition ${field === "email"
                              ? "bg-gray-100 cursor-not-allowed border-gray-200"
                              : "border-gray-300 focus:ring-gray-400 focus:border-gray-500"
                              }`}
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      type="submit"
                      className="mt-4 inline-block bg-gray-900 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-lg transition"
                    >
                      Save Changes
                    </button>
                  </form>
                )}

                {activeSection === "address" && (
                  <form onSubmit={handleSubmit} className="space-y-6 text-[14px]">
                    <h3 className="text-[14px] font-semibold text--800">
                      Address Details
                    </h3>
                    <div className="flex flex-col">
                      <label className="mb-2 text-gray-700 font-medium">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={updatedUser.address}
                        onChange={handleChange}
                        rows="4"
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                      />
                    </div>
                    <button
                      type="submit"
                      className="mt-4 inline-block bg-gray-700 hover:bg-gray-900 text-white font-medium px-6 py-2 rounded-lg transition"
                    >
                      Save Address
                    </button>
                  </form>
                )}

                {activeSection === "changePassword" && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Change Password
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { name: "currentPassword", label: "Current Password" },
                        { name: "newPassword", label: "New Password" },
                      ].map(({ name, label }) => (
                        <div key={name} className="flex flex-col">
                          <label className="mb-2 text-gray-700 font-medium">
                            {label}
                          </label>
                          <input
                            type="password"
                            name={name}
                            className="px-4 py-2 border rounded-lg focus:ring-2 focus:bg-gray-400 focus:outline-none transition"
                          />
                        </div>
                      ))}
                      <div className="flex flex-col md:col-span-2">
                        <label className="mb-2 text-gray-700 font-medium">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:bg-gray-400 focus:outline-none transition"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="mt-4 inline-block bg-gray-900 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-lg transition"
                    >
                      Change Password
                    </button>
                  </form>
                )}

                {activeSection === "forgotPassword" && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Reset Password
                    </h3>
                    <div className="flex flex-col">
                      <label className="mb-2 text-gray-700 font-medium">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        disabled
                        className="px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed transition"
                      />
                    </div>
                    <button
                      type="submit"
                      className="mt-4 inline-block bg-gray-700 hover:bg-gray-900 text-white font-medium px-6 py-2 rounded-lg transition"
                    >
                      Send Reset Link
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;

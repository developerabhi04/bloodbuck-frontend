import  { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLatestOrders } from "../../redux/slices/orderSlices";
import Loadertwo from "../Loader/Loadertwo";
import { Link } from "react-router-dom";

const DashboardTable = () => {
  const dispatch = useDispatch();
  const { latestOrders, loading, error } = useSelector((s) => s.order);

  useEffect(() => {
    dispatch(fetchLatestOrders());
  }, [dispatch]);

  const rows = useMemo(() => {
    return (
      latestOrders?.slice(0, 3).map((o) => {
        const qty = o.orderItems?.reduce((sum, i) => sum + i.quantity, 0) || 0;
        const statusColor =
          o.status === "Processing"
            ? "bg-red-100 text-red-800"
            : o.status === "Shipped"
            ? "bg-green-100 text-green-800"
            : "bg-purple-100 text-purple-800";

        return (
          <tr key={o._id} className="border-b">
            <td className="px-4 py-3 text-sm text-gray-700">{o._id.slice(-6)}</td>
            <td className="px-4 py-3 text-sm text-gray-700">{o.user?.name || "Guest"}</td>
            <td className="px-4 py-3 text-sm text-gray-700">{qty}</td>
            <td className="px-4 py-3 text-sm font-medium">₹{o.total.toFixed(2)}</td>
            <td className="px-4 py-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                {o.status}
              </span>
            </td>
          </tr>
        );
      }) || []
    );
  }, [latestOrders]);

  if (loading) return <Loadertwo />;
  if (error) return <p className="text-red-600 p-4">{error}</p>;
  if (!rows.length) return <p className="p-4 text-gray-500">No recent transactions.</p>;

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-x-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Latest 3 Transactions</h3>
        <Link
          to="/admin/transactions"
          className="text-sm text-blue-600 hover:underline"
        >
          View All
        </Link>
      </div>
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            {["Order", "User", "Qty", "Amount", "Status"].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

export default DashboardTable;

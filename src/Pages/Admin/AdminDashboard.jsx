import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { BarChart } from '../../components/Admin/Chart';
import DashboardTable from '../../components/Admin/DashboardTable';


import {
    fetchDashboardStats,
    fetchPieCharts,
    fetchBarCharts,
    fetchLineCharts,
} from '../../redux/slices/AdminChartSlices';
import AdminSidebar from '../../Components/Admin/AdminSidebar';
import Loadertwo from '../../components/Loader/Loadertwo';

const gradientMap = {
    revenue: 'from-blue-500 to-indigo-600',
    users: 'from-green-400 to-teal-500',
    orders: 'from-yellow-400 to-orange-500',
    products: 'from-purple-400 to-pink-500',
};

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { stats, pieCharts, barCharts, loading, error } = useSelector(
        (s) => s.dashboard
    );

    useEffect(() => {
        dispatch(fetchDashboardStats());
        dispatch(fetchPieCharts());
        dispatch(fetchBarCharts());
        dispatch(fetchLineCharts());
    }, [dispatch]);

    if (loading) return <Loadertwo />;
    if (error) return <p className="text-red-600 p-4">{error}</p>;

    const count = stats?.count ?? {};
    const change = stats?.changePercent ?? {};

    const cards = [
        { key: 'revenue', label: 'Revenue', value: count.revenue ?? 0, prefix: '$' },
        { key: 'users', label: 'Users', value: count.user ?? 0 },
        { key: 'orders', label: 'Transactions', value: count.order ?? 0 },
        { key: 'products', label: 'Products', value: count.product ?? 0 },
    ];

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <AdminSidebar />

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-1 p-6 overflow-auto pl-[64px] lg:pl-[258px]"
            >
                {/* Stats */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {cards.map(({ key, label, value, prefix }) => (
                        <StatsCard
                            key={key}
                            label={label}
                            value={value}
                            prefix={prefix}
                            percent={change[key] ?? 0}
                            gradient={gradientMap[key]}
                        />
                    ))}
                </div>

                {/* Charts */}
                <div className="mt-8 grid gap-8 lg:grid-cols-3">
                    <ChartPanel title="Revenue vs Orders" cols={2}>
                        <BarChart
                            data_1={barCharts?.revenue || []}
                            data_2={barCharts?.orders || []}
                            labels={barCharts?.months || []}
                            title_1="Revenue"
                            title_2="Orders"
                            bgColor_1="rgba(139,92,246,0.8)"
                            bgColor_2="rgba(16,185,129,0.8)"
                        />
                    </ChartPanel>

                    <ChartPanel title="Inventory Breakdown">
                        <div className="space-y-3">
                            {Object.entries(pieCharts?.categoryCount ?? {}).map(([cat, val]) => (
                                <CategoryBar key={cat} label={cat} value={val} />
                            ))}
                        </div>
                    </ChartPanel>
                </div>

                {/* Transactions Table */}
                <div className="mt-8 bg-white shadow-xl rounded-2xl p-6">
                    <h3 className="text-2xl font-semibold mb-4">Recent Transactions</h3>
                    <DashboardTable />
                </div>
            </motion.main>
        </div>
    );
};

const StatsCard = ({ label, value, prefix = '', percent, gradient }) => {
    const up = percent >= 0;
    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            className={`relative bg-gradient-to-r ${gradient} text-white rounded-2xl p-5 shadow-lg`}
        >
            <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium">{label}</h4>
                <span
                    className={`inline-flex items-center px-2 py-1 text-sm font-semibold rounded-full ${up ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                        }`}
                >
                    {up ? <HiTrendingUp /> : <HiTrendingDown />} {Math.abs(percent)}%
                </span>
            </div>
            <p className="mt-4 text-3xl font-bold">
                {prefix}
                {value}
            </p>
        </motion.div>
    );
};

const ChartPanel = ({ title, children, cols = 1 }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`bg-white rounded-2xl shadow-xl p-6 lg:col-span-${cols}`}
    >
        <h4 className="text-lg font-semibold mb-4">{title}</h4>
        {children}
    </motion.div>
);

const CategoryBar = ({ label, value }) => (
    <div className="flex items-center space-x-3">
        <span className="w-24 text-gray-700">{label}</span>
        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: `${value}%` }} />
        </div>
        <span className="w-12 text-right font-medium text-gray-700">
            {value}%
        </span>
    </div>
);

export default AdminDashboard;

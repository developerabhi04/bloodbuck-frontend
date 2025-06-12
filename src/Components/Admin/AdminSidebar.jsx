import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMenuAlt3 } from 'react-icons/hi';
import { RiDashboardFill, RiShoppingBag3Fill, RiCoupon2Fill } from 'react-icons/ri';
import { MdCategory, MdEvent } from 'react-icons/md';
import { FaRegImages } from 'react-icons/fa';
import { IoIosPeople } from 'react-icons/io';
import { AiFillFileText } from 'react-icons/ai';

// Define main navigation links
const MAIN_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', Icon: RiDashboardFill },
  { to: '/admin/event', label: 'Events', Icon: MdEvent },
  { to: '/admin/banner', label: 'Banners', Icon: FaRegImages },
  { to: '/admin/category', label: 'Categories', Icon: MdCategory },
  { to: '/admin/products', label: 'Products', Icon: RiShoppingBag3Fill },
  { to: '/admin/coupons', label: 'Coupons', Icon: RiCoupon2Fill },
  { to: '/admin/customers', label: 'Customers', Icon: IoIosPeople },
  { to: '/admin/transaction', label: 'Orders', Icon: AiFillFileText },
];

// Define chart navigation links
const CHART_LINKS = [
  { to: '/admin/chart/bar', label: 'Bar Chart', Icon: RiDashboardFill },
  { to: '/admin/chart/pie', label: 'Pie Chart', Icon: RiDashboardFill },
  { to: '/admin/chart/line', label: 'Line Chart', Icon: RiDashboardFill },
];

// Sidebar component
const AdminSidebar = () => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(window.innerWidth < 1024);

  // Auto-collapse on small resize
  useEffect(() => {
    const onResize = () => setCollapsed(window.innerWidth < 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <motion.aside
      animate={{ width: collapsed ? '64px' : '250px' }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      className="fixed top-0 left-0 h-full bg-gray-900 text-gray-300 shadow-xl flex flex-col z-30 overflow-hidden"
    >
      {/* Logo / Title & toggle */}
      <div className="flex flex-col items-center justify-between h-20 px-4">
        <Link
          to="/"
          className={`flex items-center h-12 ${collapsed ? 'justify-center' : ''} text-2xl font-bold text-white`}
        >
          {collapsed ? 'BB' : 'BloodBuck CRM'}
        </Link>
        <button
          className="mt-4 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
          onClick={() => setCollapsed(prev => !prev)}
        >
          <HiMenuAlt3 size={20} />
        </button>
      </div>

      {/* Navigation sections */}
      <nav className="flex-1 overflow-y-auto pt-4">
        <NavSection title="Main" links={MAIN_LINKS} collapsed={collapsed} activePath={pathname} />
        <NavSection title="Analytics" links={CHART_LINKS} collapsed={collapsed} activePath={pathname} />
      </nav>
    </motion.aside>
  );
};

// Section component for grouping links
const NavSection = ({ title, links, collapsed, activePath }) => (
  <div className="mt-6">
    {!collapsed && <h6 className="px-4 mb-2 text-xs font-semibold uppercase text-gray-500">{title}</h6>}
    <ul>
      {links.map(({ to, label, Icon }) => {
        const active = activePath.startsWith(to);
        return (
          <li key={to} className="mb-1">
            <Link
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-white'
                }`}
            >
              <Icon size={20} />
              {!collapsed && <span className="flex-1">{label}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  </div>
);

export default AdminSidebar;

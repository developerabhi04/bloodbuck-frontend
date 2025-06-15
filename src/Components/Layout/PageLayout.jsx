const PageLayout = ({ title, children }) => (
    <div className="max-w-5xl mx-auto px-4 py-36 ">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
        <div className="space-y-8">{children}</div>
    </div>
);

export default PageLayout;
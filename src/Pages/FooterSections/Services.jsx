import { Helmet } from "react-helmet-async";
import PageLayout from "../../Components/Layout/PageLayout";


const Services = () => {
  const services = [
    { title: 'Order Tracking', description: 'Track your orders in real-time.', cta: 'Track Now' },
    { title: 'Returns & Exchanges', description: 'Hassle-free returns within 30 days.', cta: 'Start Return' },
    { title: 'Customer Support', description: '24/7 dedicated assistance.', cta: 'Contact Support' },
    { title: 'Secure Payments', description: 'SSL encrypted transactions.', cta: 'Learn More' },
    { title: 'International Shipping', description: 'We ship globally with reliable partners.', cta: 'View Options' },
    { title: 'Gift Wrapping', description: 'Add a personal touch to your order.', cta: 'Wrap My Order' }
  ];

  return (
    <>
      <Helmet>
        <title>Our Services | Bloodbuck</title>
        <meta name="description" content="Explore all services Bloodbuck offers to enhance your shopping experience." />
      </Helmet>
      <PageLayout title="Our Services">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="border rounded-xl p-6 bg-white shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <button className="text-sm px-4 py-2 bg-black text-white rounded hover:bg-gray-800">{service.cta}</button>
            </div>
          ))}
        </div>
      </PageLayout>
    </>
  );
};

export default Services;

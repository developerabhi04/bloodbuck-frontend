import { Helmet } from "react-helmet-async";
import PageLayout from "../../Components/Layout/PageLayout";

const PrivacyPolicy = () => {
  const sections = [
    {
      heading: 'Introduction',
      content: 'This Privacy Policy explains how Bloodbuck collects and uses your data.'
    },
    {
      heading: 'Data We Collect',
      content: [
        'Full name and contact details',
        'Email address and IP address',
        'Payment and transaction details'
      ]
    },
    {
      heading: 'How We Use Your Data',
      content: [
        'To process your orders and payments',
        'To provide customer support',
        'To send promotional content with consent'
      ]
    },
    {
      heading: 'Cookies & Tracking',
      content: 'We use cookies to enhance your experience and track site performance.'
    },
    {
      heading: 'Your Rights',
      content: 'You can access, update, or delete your data anytime by contacting us.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy | Bloodbuck</title>
        <meta name="description" content="Read Bloodbuck's Privacy Policy to learn how your data is collected and used." />
      </Helmet>
      <PageLayout title="Privacy Policy">
        {sections.map((sec, idx) => (
          <section key={idx} className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{sec.heading}</h2>
            {Array.isArray(sec.content) ? (
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {sec.content.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : (
              <p className="text-gray-700">{sec.content}</p>
            )}
          </section>
        ))}
      </PageLayout>
    </>
  );
};

export default PrivacyPolicy;
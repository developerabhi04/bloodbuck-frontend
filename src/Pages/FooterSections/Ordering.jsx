import { useState } from 'react';// Import Icons
import { Helmet } from 'react-helmet-async';
import PageLayout from '../../Components/Layout/PageLayout';

const Ordering = () => {
    const [activeCategory, setActiveCategory] = useState('general');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    const faqData = {
        general: [
            { question: 'What payment methods do you accept?', answer: 'We accept Visa, MasterCard, Amex, and PayPal.' },
            { question: 'Is my order secure?', answer: 'All orders are encrypted with SSL for secure transactions.' }
        ],
        shipping: [
            { question: 'What are your shipping options?', answer: 'Standard, Express, and Overnight options are available.' },
            { question: 'Can I track my shipment?', answer: 'Yes, tracking information will be sent to your email.' }
        ],
        returns: [
            { question: 'What is your return policy?', answer: 'Items can be returned within 30 days in original condition.' },
            { question: 'How do I initiate a return?', answer: 'Contact our support to receive return instructions.' }
        ],
        billing: [
            { question: 'How do I update my billing info?', answer: 'You can update it in your account settings.' },
            { question: 'Why was my payment declined?', answer: 'Please check with your bank or try another payment method.' }
        ]
    };

    const filteredQuestions = faqData[activeCategory].filter((faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Helmet>
                <title>Ordering Help | Bloodbuck</title>
                <meta name="description" content="Help and support for ordering, shipping, billing, and returns at Bloodbuck." />
            </Helmet>
            <PageLayout title="Ordering Help">
                {/* <input
          type="text"
          placeholder="Search ordering topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        /> */}
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="sm:w-1/4 space-y-2">
                        {Object.keys(faqData).map((cat) => (
                            <button
                                key={cat}
                                className={`w-full text-left px-4 py-2 border rounded ${activeCategory === cat ? 'bg-black text-white' : 'bg-white'}`}
                                onClick={() => {
                                    setActiveCategory(cat);
                                    setExpandedQuestion(null);
                                }}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="sm:w-3/4 space-y-4">
                        {filteredQuestions.map((faq, i) => (
                            <div key={i} className="border rounded p-4">
                                <h3 onClick={() => setExpandedQuestion(expandedQuestion === i ? null : i)} className="font-medium cursor-pointer text-lg flex justify-between">
                                    {faq.question}
                                    <span>{expandedQuestion === i ? '-' : '+'}</span>
                                </h3>
                                {expandedQuestion === i && <p className="mt-2 text-gray-600">{faq.answer}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </PageLayout>
        </>
    );
};

export default Ordering;


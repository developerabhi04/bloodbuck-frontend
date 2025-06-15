import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '../../Components/Layout/PageLayout';

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const faqData = {
    general: [
      { question: 'What is your return policy?', answer: 'Returns are accepted within 30 days.' },
      { question: 'Do you offer international shipping?', answer: 'Yes, international shipping is available.' }
    ],
    orders: [
      { question: 'How can I track my order?', answer: 'Tracking link is emailed post-shipping.' },
      { question: 'Can I cancel my order?', answer: 'Contact us as soon as possible for cancellation.' }
    ],
  };

  const filteredQuestions = faqData[activeCategory].filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>FAQs | Bloodbuck</title>
        <meta name="description" content="Frequently Asked Questions about Bloodbuck services and orders." />
      </Helmet>
      <PageLayout title="Frequently Asked Questions">
        {/* <input
          type="text"
          placeholder="Search questions..."
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

export default FAQ;

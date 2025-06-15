import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '../../Components/Layout/PageLayout';


const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Bloodbuck</title>
        <meta name="description" content="Get in touch with Bloodbuck's support and customer service team." />
      </Helmet>
      <PageLayout title="Contact Us">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info Section */}
          <div className="space-y-6">
            <p className="text-gray-600">We’d love to hear from you! Whether you have questions or need support, our team is here to help.</p>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Address</h2>
              <p className="text-gray-600">Bloodbuck HQ, 123 Commerce Street, Mumbai, India 400001</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Phone</h2>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Email</h2>
              <p className="text-gray-600">support@bloodbuck.com</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Working Hours</h2>
              <p className="text-gray-600">Mon - Sat: 10:00 AM – 6:00 PM IST</p>
            </div>
          </div>

          {/* Form Section */}
          <div>
            {submitted ? (
              <div className="bg-green-100 text-green-700 p-4 rounded shadow">Thank you for reaching out! We’ll get back to you soon.</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 bg-white border p-6 rounded-lg shadow-md">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
                  ></textarea>
                </div>
                <div>
                  <button type="submit" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">Send Message</button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Find Us on the Map</h2>
          <div className="rounded-lg overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609818944!2d72.7410989286643!3d19.082197839444892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63b6aef2b7d%3A0x6c2db2caa0edc5e2!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1681035011604!5m2!1sen!2sin"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bloodbuck Location"
            ></iframe>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default ContactUs;

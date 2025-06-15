import { Helmet } from "react-helmet-async";
import PageLayout from "../../Components/Layout/PageLayout";


const ShippingPolicy = () => (
  <>
    <Helmet>
      <title>Shipping Policy | Bloodbuck</title>
      <meta name="description" content="Learn about Bloodbuck's shipping options, costs, and delivery timelines." />
    </Helmet>
    <PageLayout title="Shipping Policy">
      <section>
        <h2 className="text-xl font-semibold mb-2">Shipping Methods & Costs</h2>
        <table className="w-full table-auto border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Method</th>
              <th className="px-4 py-2">Delivery Time</th>
              <th className="px-4 py-2">Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">Standard</td>
              <td className="px-4 py-2">5-7 business days</td>
              <td className="px-4 py-2">Rs100.99</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Express</td>
              <td className="px-4 py-2">2-3 business days</td>
              <td className="px-4 py-2">Rs114.99</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Overnight</td>
              <td className="px-4 py-2">1 business day</td>
              <td className="px-4 py-2">Rs29.99</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6 mb-2">International Shipping</h2>
        <p className="text-gray-700">We ship globally. Customs duties may apply depending on your location.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6 mb-2">Tracking</h2>
        <p className="text-gray-700">A tracking number will be sent once your order is dispatched.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6 mb-2">Shipping Restrictions</h2>
        <p className="text-gray-700">We currently do not ship to P.O. boxes or military addresses.</p>
      </section>
    </PageLayout>
  </>
);

export default ShippingPolicy;

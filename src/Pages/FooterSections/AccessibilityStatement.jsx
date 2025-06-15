import { Helmet } from "react-helmet-async";
import PageLayout from "../../Components/Layout/PageLayout";


const AccessibilityStatement = () => (
  <>
    <Helmet>
      <title>Accessibility Statement | Bloodbuck</title>
      <meta name="description" content="Our commitment to inclusive design and accessibility for all users." />
      <link rel="canonical" href="https://www.bloodbuck.com/accessibility-statement" />
    </Helmet>

    <PageLayout title="Accessibility Statement">
      <p className="text-lg text-gray-700 leading-relaxed">
        Bloodbuck is committed to providing an inclusive and accessible experience for all users. Our efforts align with WCAG 2.1 AA standards.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-2">Our Commitment</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Alt-text for all visuals</li>
            <li>Keyboard navigation support</li>
            <li>Color contrast compliance</li>
            <li>Assistive-tech-friendly checkout flow</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Built-in Features</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Screen reader compatibility</li>
            <li>Text scaling options</li>
            <li>Voice tool support</li>
            <li>Fully responsive design</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  </>
);

export default AccessibilityStatement;

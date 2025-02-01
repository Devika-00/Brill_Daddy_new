import React from "react";
import OrginalNavbar from "../../components/User/OrginalUserNavbar";
import NavbarWithMenu from "../../components/User/NavbarwithMenu";
import Footer from "../../components/User/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-300 to-white py-0 overflow-hidden">
      <OrginalNavbar />
      <NavbarWithMenu />
      <div className="min-h-screen px-6 py-10 bg-gray-100">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
            Privacy Policy of Brilldaddy ECommerce Pvt Ltd
          </h1>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4 ml-4">
            Effective Date: 1st January 2025 <br></br>
            Last Updated: 25th December 2024
          </p>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
            1. Introduction
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
            Brilldaddy ECommerce Pvt Ltd ("Brilldaddy", "we", "our", or "us") is
            committed to protecting the privacy and security of our users'
            ("you", "your") personal information. This Privacy Policy outlines
            how we collect, use, disclose, and safeguard your information when
            you visit our website, use our mobile application, or engage with
            our services. This policy is in compliance with the Information
            Technology Act, 2000, and the applicable rules.
          </p>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
            2. Information We Collect
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
            We may collect the following categories of personal information when
            you interact with Brilldaddy:
          </p>
          <div className="ml-10">
            <h3 className="text-md md:text-lg font-medium text-gray-800 mt-4">
              1. Personal Information:
            </h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm md:text-base leading-6 md:leading-7">
              <li>1. Name</li>
              <li>2. Email address</li>
              <li>3. Phone number</li>
              <li>4. Residential or shipping address</li>
              <li>
                5. Payment information (credit/debit card details, UPI ID, etc.)
              </li>
              <li>6. Date of birth</li>
              <li>7. Gender</li>
            </ul>

            <h3 className="text-md md:text-lg font-medium text-gray-800 mt-4">
              2. Sensitive Personal Data or Information (SPDI):
            </h3>
            <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-2">
              As defined under the IT Act, 2000, and its rules, this may
              include:
            </p>
            <ul className="list-disc pl-5 text-gray-700 text-sm md:text-base leading-6 md:leading-7">
              <li>
                1. Financial information (bank account or payment instrument
                details)
              </li>
              <li>2. Passwords</li>
              <li>
                3. Any information received under lawful contract or otherwise
              </li>
            </ul>

            <h3 className="text-md md:text-lg font-medium text-gray-800 mt-4">
              3. Non-Personal Information:
            </h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm md:text-base leading-6 md:leading-7">
              <li>1. IP address</li>
              <li>2. Browser type and version</li>
              <li>3. Device information (hardware model, OS)</li>
              <li>4. Cookies and usage data</li>
            </ul>
          </div>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
            3. Purpose of Data Collection
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
            We collect and use your information for the following purposes:
          </p>
          <div className="ml-10">
            <li>To process transactions and provide products and services.</li>
            <li>To personalize your experience and improve our services.</li>
            <li>
              To send administrative information, such as order confirmations
              and updates.
            </li>
            <li>To provide customer support.</li>
            <li>To comply with legal obligations and resolve disputes.</li>
            <li>
              To detect, prevent, and address technical issues or fraudulent
              activities.
            </li>
          </div>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
            4. Data Sharing and Disclosure
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
            Brilldaddy does not sell or trade your personal information. We may
            share your information in the following circumstances:
          </p>

          <div className="ml-10">
            <li>
              With third-party service providers for payment processing, order
              fulfillment, logistics, customer support, and marketing services.
            </li>
            <li>
              When required by law or government authorities, or to protect our
              legal rights.
            </li>
            <li>
              In connection with a merger, acquisition, or sale of assets where
              user information may be transferred as part of the transaction.
            </li>
          </div>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
            5. Security of Personal Information
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
            We implement reasonable security practices and procedures in
            accordance with Rule 8 of the IT (Reasonable Security Practices and
            Procedures and Sensitive Personal Data or Information) Rules, 2011.
            This includes:
          </p>
          <div className="ml-10">
            <li>SSL (Secure Socket Layer) encryption for data transmission.</li>
            <li>Restricted access to sensitive personal data.</li>
            <li>Regular security audits and vulnerability assessments.</li>
          </div>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
            6. Retention of Data
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
            We retain your personal information only as long as necessary for
            the purposes outlined in this policy or as required by law. Upon
            request, we will delete or anonymize your data, subject to any legal
            retention requirements.
          </p>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
            7. Your Rights
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
            You have the right to:
          </p>
          <div className="ml-10">
            <li>Access, correct, or update your personal information.</li>
            <li>Withdraw consent for data processing where applicable</li>
            <li>
              Lodge a complaint with the relevant data protection authority.
            </li>
            <li>Request deletion of your data.</li>
          </div>

          <p className="mt-2">
            To exercise these rights, please contact us at:
            <br />
            Email: [Insert Email Address]
            <br />
            Phone: [Insert Phone Number]
            <br />
            Address: [Insert Address]
          </p>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
            8. Cookies
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
            We use cookies and similar technologies to enhance your experience
            on our website. You can control the use of cookies through your
            browser settings.
          </p>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
            9. Third-Party Links
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
            Our website may contain links to third-party websites. We are not
            responsible for the privacy practices of these websites. We
            encourage you to read their privacy policies.
          </p>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
            10. Changes to this Privacy Policy
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
            Brilldaddy reserves the right to modify this Privacy Policy at any
            time. Any changes will be posted on this page with an updated
            effective date.
          </p>
        </div>



        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
          Data Protection Policy of Brilldaddy
          ECommerce Pvt Ltd
          </h1>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
            Objective: <br></br>
            This Data Protection Policy outlines Brilldaddy's approach to protecting personal and
sensitive data in compliance with the IT Act, 2000, and its associated rules.
          </p>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
          1. Scope
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
          This policy applies to all employees, contractors, vendors, and third parties who
          handle personal data on behalf of Brilldaddy.
          </p>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
          2. Definitions
          </h2>
          <div className="ml-10">
            <ul className="list-disc pl-5 text-gray-700 text-sm md:text-base leading-6 md:leading-7">
              <li>Personal Information: Information that identifies an individual, such as name, email, address, etc.</li>
              <li>Sensitive Personal Data or Information (SPDI): Financial information, passwords, or any
              information classified as sensitive under the IT Act.</li>
              <li>Data Subject: The individual whose data is being collected and processed.</li>
            </ul>

            </div>
          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
          3. Data Collection
          </h2>
          <div className="ml-10">
            <li>Personal data shall be collected for lawful purposes only.</li>
            <li>Consent must be obtained from the data subject before collecting sensitive personal data, as
            per Rule 5 of the IT Rules, 2011..</li>
          </div>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
          4. Data Processing
          </h2>

          <div className="ml-10">
            <li>
            Personal data will be processed fairly, transparently, and only for specified and legitimate
            purposes.
            </li>
            <li>
            Access to personal data is restricted to authorized personnel.
            </li>
          </div>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
          5. Security Measures
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
          Implement appropriate technical and organizational security measures, such as:
          </p>
          <div className="ml-10">
            <li>Data encryption.</li>
            <li>Secure access control mechanisms.</li>
            <li>Regular employee training on data protection practices.</li>
          </div>
          <p>Conduct periodic security audits and risk assessments.</p>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
          6. Data Breach Management
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
          In case of a data breach:
          </p>
          <div className="ml-10">
            <li>Notify the affected data subjects and relevant authorities promptly</li>
            <li>Investigate the breach and implement corrective measures to prevent recurrence</li>
          </div>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
          7. Data Retention
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
          Personal and sensitive data will be retained only as long as necessary for business or
          legal purposes and securely disposed of thereafter.
          </p>
        
          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
          8. Data Subject Rights
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
          Brilldaddy ensures that data subjects can:
          </p>
          <div className="ml-10">
            <li>Access their data upon request.</li>
            <li>Request correction or deletion of their data.</li>
            <li>Withdraw consent for data processing where applicable.</li>
          </div>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
          9. Third-Party Service Providers
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
          Brilldaddy ensures that all third-party vendors handling personal data:
          </p>
          <div className="ml-10">
            <li>Comply with applicable data protection laws</li>
            <li>Sign data protection agreements with Brilldaddy.</li>
          </div>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6 ">
          10. Governance
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
          The Data Protection Officer (DPO) is responsible for implementing and monitoring
          this policy. Contact Inform
          </p>
          <p>
          Contact Information:
            <br />
            Data Protection Officer: [Insert Name]
            <br />
            Email: [Insert Email Address]
            <br />
            Phone: [Insert Phone Number]
          </p>
        </div>


      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

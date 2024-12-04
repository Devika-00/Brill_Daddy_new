import React from "react";
import OrginalNavbar from "../../components/User/OrginalUserNavbar";
import NavbarWithMenu from "../../components/User/NavbarwithMenu";
import Footer from "../../components/User/Footer";

const RefundPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-300 to-white py-0 overflow-hidden">
      <OrginalNavbar />
      <NavbarWithMenu />
      <div className="min-h-screen px-6 py-10 bg-gray-100">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
          Refund Policy of Brilldaddy
          Ecommerce Pvt Ltd
          </h1>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4 ml-4">
          At Brilldaddy Ecommerce Pvt Ltd (hereinafter referred to as "Brilldaddy"), we are
committed to providing our customers with the best shopping experience. We
understand that there may be instances where a refund is necessary. Please review our
refund policy outlined below.
          </p>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
          1. Refund Request Process
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
          To initiate a refund, customers must complete the following steps:
          </p>

          <div className="ml-10">
            <h3 className="text-md md:text-lg font-medium text-gray-800 mt-4">
            1. Submit a Refund Request through Email
            </h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm md:text-base leading-6 md:leading-7">
              <li>Send an email to our customer support team at [insert email address] with the subject line
              "Refund Request - Order [Order ID]".</li>
              <li>Please include the following information in your email:</li>
              <div className="ml-4">
                <li>Full name</li>
                <li>Contact number</li>
                <li>Order ID</li>
                <li>Reason for the refund request</li>
                <li>Proof of purchase (e.g., order confirmation or invoice)</li>
              </div>
            </ul>

            <h3 className="text-md md:text-lg font-medium text-gray-800 mt-4">
              2. Submit a Refund Request via the Website
            </h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm md:text-base leading-6 md:leading-7">
              <li>
              Visit our website [insert website URL] and navigate to the "Return and Refund" tab.
              </li>
              <li>Fill out the refund request form with the necessary details, including your Order ID and
              reason for the refund.</li>
            </ul>
            <p>Note: Both the email and website refund request must be completed to process your
            refund.</p>
          </div>


          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
          2. Refund Eligibility
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
          Refunds may be granted in the following cases:
          </p>
          <div className="ml-10">
            <li>Damaged or defective products upon delivery.</li>
            <li>Incorrect items delivered.</li>
            <li>
            Items that do not match the product description
            </li>
            <li>Change of mind returns (subject to specific product categories and conditions).</li>
          </div>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
          Conditions:
          </p>
          <div className="ml-10">
            <li>The product must be returned in its original condition, including all packaging, tags, and
            accessories.</li>
            <li>The request must be made within [X days] of receiving the order (e.g., 7-14 days depending
                on company policy).</li>
          </div>
         

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
          3. Processing Time
          </h2>
          <div className="ml-10">
            <li>Once a refund request is received and approved, the refund will be processed within 10
            working days.</li>
            <li>The refund amount will be credited directly to the customer's registered bank account. Customers must ensure that correct bank details are provided to avoid any delays.</li>
          </div>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
          4. Refund Amount
          </h2>
          <div className="ml-10">
            <li>
            The refund amount will be equal to the product price at the time of purchase, excluding any
            shipping charges, unless the product was received damaged, defective, or incorrect.
            </li>
            <li>
            In cases where the product was purchased using a promotional offer or coupon, the refund
            amount will be adjusted accordingly.
            </li>
          </div>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
          5. Non-Refundable Items
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
          The following items are not eligible for refunds:
          </p>
          <div className="ml-10">
            <li>Products purchased during clearance sales or marked as "Final Sale."</li>
            <li>Digital products, gift cards, and downloadable software.</li>
            <li>Personalized or customized items.</li>
          </div>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-6">
          6. Contact Us
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-4">
          If you have any questions regarding our refund policy, please feel free to contact our
          customer support team:
          </p>
          <div className="ml-10">
            <li>Email: [insert email address]</li>
            <li>Phone: [insert contact number]</li>
            <li>Website: [insert website URL]</li>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPolicy;

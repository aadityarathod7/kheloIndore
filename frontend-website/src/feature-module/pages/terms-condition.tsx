import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";

const TermsCondition = () => {
  const route = all_routes;

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = "terms-condition"

  }, [])

  return (
    <>
      <div className="main-wrapper terms-page innerpagebg top-margin">
        {/* Breadcrumb */}
        <div className="breadcrumb breadcrumb-list mb-0">
          <span className="primary-right-round" />
          <div className="container">
            <h1 className="text-white">Terms</h1>
            <ul>
              <li>
                <Link to={route.home}>Home</Link>
              </li>
              <li>Terms</li>
            </ul>
          </div>
        </div>
        {/* /Breadcrumb */}
        {/* Page Content */}
        <div className="content">
          <div className="container">
            <div className="terms-main-heading">
              <h2>Terms and Conditions for Khelo Indore</h2>
            </div>
            <div className="terms-data">
              <h3> Introduction</h3>
              <p>
                Welcome to <b>Khelo Indore</b> powered by <b>Mans Sports Entertainment!</b> These Terms and Conditions (&quot;Terms&quot;) govern your use of our website, http://127.0.0.1:3037/ (the &quot;Site&quot;), and the services provided therein. By accessing or using our Site, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Site.
              </p>
            </div>
            <div className="terms-data">
              <h3>Eligibility</h3>
              <p>
                You must be at least 18 years old to use our Site. By using our Site, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms.
              </p>
            </div>
            <div className="terms-data">
              <h3>Use of the Site</h3>
              <div className="terms-data-sub-head">
                <h4>A. Account Registration</h4>
              </div>
              <p>
                <p>To access certain features of our Site, you may need to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your account password and for all activities that occur under your account.</p>
              </p>
              <div className="terms-data-sub-head">
                <h4>B. User Conduct</h4>
              </div>
              <p>
                <p>
                  You agree not to use the Site to:
                  <div className="terms-conduct-list">
                    <ul>
                      <li>Violate any local, state, national, or international law or regulation.</li>
                      <li>Transmit any material that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of another&apos;s privacy, hateful, or racially, ethnically, or otherwise objectionable.</li>
                      <li>Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
                      <li>Engage in any conduct that restricts or inhibits any other user from using or enjoying the Site.</li>
                    </ul>
                  </div>
                </p>
              </p>
            </div>
            <div className="terms-data">
              <h3>Intellectual Property</h3>
              <p>
                All content on the Site, including text, graphics, logos, images, audio clips, video clips, data compilations, and software, is the property of Khelo Indore or its content suppliers and is protected by copyright, trademark, and other intellectual property laws. You may not use, reproduce, distribute, modify, or create derivative works from any content on the Site without our prior written consent.
              </p>
            </div>
            <div className="terms-data">
              <h3>Payment and Fees</h3>
              <p>
                Certain services offered on our Site may be subject to fees. You agree to pay all applicable fees and charges in accordance with the terms set forth on the Site. All fees are non-refundable unless otherwise stated.
              </p>
            </div>
            <div className="terms-data">
              <h3>Disclaimer of Warranties</h3>
              <p>
                The Site and all content, products, and services provided through the Site are provided on an &quot;as is&quot; and &quot;as available&quot; basis, without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. Khelo Indore does not warrant that the Site will be uninterrupted or error-free, that defects will be corrected, or that the Site is free of viruses or other harmful components.
              </p>
            </div>
            <div className="terms-data">
              <h3>Limitation of Liability</h3>
              <p>
                In no event shall Khelo Indore, its affiliates, or their respective directors, officers, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
                <p>
                  <div className="terms-conduct-list">
                    <ul>
                      <li>
                        Your use of or inability to use the Site.
                      </li>
                      <li>
                        Any unauthorized access to or use of our servers and/or any personal information stored therein.
                      </li>
                      <li>
                        Any interruption or cessation of transmission to or from the Site.
                      </li>
                      <li>
                        Any bugs, viruses, trojan horses, or the like that may be transmitted to or through the Site by any third party.
                      </li>
                      <li>
                        Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through the Site.
                      </li>
                    </ul>
                  </div>
                </p>
              </p>
            </div>
            <div className="terms-data">
              <h3>Indemnification</h3>
              <p>
                You agree to indemnify, defend, and hold harmless Khelo Indore, its affiliates, and their respective directors, officers, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorney&apos;s fees) arising from your use of the Site or your violation of these Terms.
              </p>
            </div>
            <div className="terms-data">
              <h3>Termination</h3>
              <p>
                We may terminate or suspend your access to the Site, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use the Site will immediately cease.
              </p>
            </div>
            <div className="terms-data">
              <h3>Governing Law</h3>
              <p>
                These Terms shall be governed and construed in accordance with the laws of Indore Judicial, without regard to its conflict of law provisions.
              </p>
            </div>
            <div className="terms-data">
              <h3>Changes to These Terms</h3>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 15 day&apos;s notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. Your continued use of the Site after any changes to these Terms constitutes your acceptance of the new Terms.
              </p>
            </div>
            <div className="terms-data">
              <h3>Contact Us</h3>
              <p>
                If you have any questions about these Terms, please contact us at:<br/>
                <b>Email</b>: manssportsentertainment@gmail.com<br/>
                Thank you for using Khelo Indore! We hope you enjoy our services.
              </p>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </div>
    </>
  );
};

export default TermsCondition;

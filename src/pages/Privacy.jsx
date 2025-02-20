import { Heading, Text } from '@radix-ui/themes';
import React from 'react';
import { SITE_NAME } from '../constants';

function Privacy() {
  return (
    <div className='w-full mb-16'>
      <div className="max-w-3xl px-6 py-10 mx-auto md:px-10">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <Text as="p" size="2" align="center" color="blue" mb={'1'}>
            Privacy Policy
          </Text>
          <Text as="p" size="8" weight="medium" align="center">
            We care about your privacy
          </Text>
        </div>

        {/* Privacy Policy Content */}
        <div className="flex flex-col gap-8">
          {/* Section 1 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              Information We Collect
            </Text>
            <ul className="ml-4 space-y-2 list-disc list-outside">
              <li>
                <span className="font-medium">Information You Provide to Us:</span> Account information
                (name, email, username, profile details), videos, comments, and messages uploaded to our
                platform. Payment details if applicable.
              </li>
              <li>
                <span className="font-medium">Information We Collect Automatically:</span> Viewing history,
                search queries, app interactions, IP address, and approximate location.
              </li>
              <li>
                <span className="font-medium">Information from Third Parties:</span> If you connect to our
                app via third-party services (e.g., Google, Facebook), we may receive limited information
                per their privacy policies.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              How We Use Your Information
            </Text>
            <ul className="ml-4 space-y-2 list-disc list-outside">
              <li>Manage your account, display content, and provide personalized recommendations.</li>
              <li>Analyze trends and enhance user experience.</li>
              <li>Send service updates, account notifications, and promotional materials (if consented).</li>
              <li>Detect and prevent fraud or unauthorized access.</li>
              <li>Comply with legal and regulatory obligations.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              Sharing Your Information
            </Text>
            <ul className="ml-4 space-y-2 list-disc list-outside">
              <li>
                <span className="font-medium">Service Providers:</span> Trusted third parties for hosting,
                analytics, customer support, and payment processing.
              </li>
              <li>
                <span className="font-medium">Other Users:</span> Publicly visible content such as videos and
                comments.
              </li>
              <li>
                <span className="font-medium">Legal Reasons:</span> Compliance with legal processes or
                protecting users and partners.
              </li>
              <li>
                <span className="font-medium">Business Transfers:</span> During mergers, acquisitions, or
                asset sales, your data may be transferred.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              Cookies and Tracking Technologies
            </Text>
            <p >
              We use cookies, beacons, and other tracking technologies to enhance functionality, analyze
              traffic, and deliver personalized ads (if applicable). You can manage cookie preferences through
              browser settings. Note: disabling cookies may affect some app features.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              Your Privacy Choices
            </Text>
            <ul className="ml-4 space-y-2 list-disc list-outside">
              <li>
                <span className="font-medium">Access:</span> Request a copy of the data we hold about you.
              </li>
              <li>
                <span className="font-medium">Correction:</span> Update or correct inaccuracies in your
                data.
              </li>
              <li>
                <span className="font-medium">Deletion:</span> Request account and data deletion.
              </li>
              <li>
                <span className="font-medium">Opt-Out:</span> Unsubscribe from promotional communications.
              </li>
            </ul>
          </div>

          {/* Section 6 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              Data Retention
            </Text>
            <p >
              We retain data as long as necessary for services or legal obligations. Deleted account data is
              removed permanently unless required by law.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              Security
            </Text>
            <p >
              We use encryption, firewalls, and secure servers to protect your data. However, no method of
              transmission is 100% secure. Please safeguard your credentials.
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              Third-Party Links
            </Text>
            <p >
              Our app may include links to external websites or services. We are not responsible for their
              privacy practices. Review their policies before sharing your data.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              Children's Privacy
            </Text>
            <p >
              Our services are not directed to children under 13. If we learn of unauthorized data collection
              from a child, we will delete it immediately.
            </p>
          </div>

          {/* Section 10 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              Changes to This Privacy Policy
            </Text>
            <p >
              We may update this policy periodically. Significant changes will be communicated via email or
              our platform.
            </p>
          </div>
        </div>
      </div>
      <div className='flex justify-center mx-10 mt-10 mb-10 sm:mb-0 sm:justify-end '>
        <Text as='span' color='gray' size={'2'} >
          © 2025 copyright {SITE_NAME}. All rights reserved.
        </Text>
      </div>
    </div>
  );
}

export default Privacy;

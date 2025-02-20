import { Text } from '@radix-ui/themes';
import React from 'react';
import { Link } from 'react-router-dom';
import { SITE_NAME } from '../constants';

function TermsOfService() {
  return (
    <div className="w-full mb-16">
      <div className="max-w-3xl px-6 py-10 mx-auto md:px-10">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <Text as="p" size="2" align="center" color="blue"  mb={'1'}>
            Terms of Service
          </Text>
          <Text as="p" size="8" weight="medium" align="center">
            Please read our terms carefully
          </Text>
        </div>

        {/* Terms of Service Content */}
        <div className="flex flex-col gap-8">
          {/* Section 1 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              Acceptance of Terms
            </Text>
            <p>
              By accessing or using our services, you agree to be bound by these Terms of Service and our
              Privacy Policy. If you do not agree, please do not use our platform.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              Changes to Terms
            </Text>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective upon posting
              on our platform. Continued use of our services constitutes acceptance of the revised terms.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              User Responsibilities
            </Text>
            <ul className="ml-4 space-y-2 list-disc ">
              <li>You must provide accurate and complete information when creating an account.</li>
              <li>Maintain the confidentiality of your account credentials.</li>
              <li>Refrain from using our platform for unlawful or prohibited activities.</li>
              <li>
                Do not upload or share content that infringes on intellectual property rights or violates our
                community guidelines.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              Prohibited Activities
            </Text>
            <ul className="ml-4 space-y-2 list-disc ">
              <li>Spamming, phishing, or attempting to defraud other users.</li>
              <li>Uploading malicious software, viruses, or harmful content.</li>
              <li>Engaging in unauthorized data scraping or harvesting.</li>
              <li>Impersonating others or misrepresenting your identity.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              Intellectual Property
            </Text>
            <p>
              All content, trademarks, and materials on our platform are owned by or licensed to us. Users
              may not reproduce, distribute, or modify this content without permission.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              User-Generated Content
            </Text>
            <p>
              By posting content on our platform, you grant us a non-exclusive, royalty-free license to use,
              modify, and distribute the content as necessary for our services. You retain ownership of your
              content.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              Termination
            </Text>
            <p>
              We reserve the right to suspend or terminate your account at our discretion if you violate
              these terms or engage in prohibited activities.
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              Limitation of Liability
            </Text>
            <p>
              We are not liable for any direct, indirect, incidental, or consequential damages resulting from
              your use of our platform. Use our services at your own risk.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              Governing Law
            </Text>
            <p>
              These terms are governed by the laws of [Your Country/Region]. Any disputes will be resolved
              in the courts of [Your Location].
            </p>
          </div>

          {/* Section 10 */}
          <div>
            <Text as="p" weight="medium" size="6" className="mb-4">
              Contact Us
            </Text>
            <p>
              For questions or concerns about these terms, please contact us at{' '}
              <Link>
                <Text as='span' color='blue' className='underline'>
                  support@example.com

                </Text>
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center mx-10 mt-10 mb-10 sm:mb-0 sm:justify-end">
        <Text as="span" color="gray" size="2">
          © 2025 copyright {SITE_NAME}. All rights reserved.
        </Text>
      </div>
    </div>
  );
}

export default TermsOfService;

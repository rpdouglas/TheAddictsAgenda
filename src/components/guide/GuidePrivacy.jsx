import React from 'react';

const GuidePrivacy = () => (
    <div className="prose prose-sm text-gray-700 max-w-none">
        <h3 className="font-bold text-gray-800 text-lg mt-4 mb-2">Privacy Policy</h3>
        <p className="italic text-xs text-gray-500 mb-4">Effective Date: {new Date().getFullYear()}</p>
        
        <p><strong>1. Introduction</strong><br/>
        My Recovery Toolkit ("we," "our," or "us") respects your privacy. This policy explains that we collect <strong>no personal identifiable information (PII)</strong> by default.</p>

        <p><strong>2. Information We Collect</strong><br/>
        We do not collect names, emails, addresses, or phone numbers. All data entered into the application (journal entries, inventory, dates) is stored locally on your device.</p>

        <p><strong>3. Data Usage</strong><br/>
        Your data is used solely for the purpose of providing you with recovery tools within the application. We do not sell, trade, or transfer your data to outside parties.</p>

        <hr className="my-6 border-gray-200" />

        <h3 className="font-bold text-gray-800 text-lg mb-2">Medical & Legal Disclaimer</h3>
        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 text-red-900">
            <p className="font-bold mb-1">NOT MEDICAL ADVICE</p>
            <p>
                My Recovery Toolkit is designed to support, not replace, the relationship that exists between a patient/site visitor and his/her existing physician. 
                <strong> This app is not a medical device</strong> and does not offer medical diagnosis or treatment.
            </p>
            <p className="mt-2">
                If you are experiencing a medical emergency, believe you may be a danger to yourself or others, or are experiencing severe withdrawal symptoms, <strong>please call 911 or your local emergency number immediately.</strong>
            </p>
        </div>

        <h3 className="font-bold text-gray-800 text-lg mt-6 mb-2">Terms of Use</h3>
        <p>
            By using this application, you agree that you are solely responsible for your recovery journey. The developers of My Recovery Toolkit assume no liability for the use or misuse of the information provided.
        </p>
    </div>
);

export default GuidePrivacy;
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield } from 'lucide-react';

type Section = {
    heading: string;
    body: string;
};

const SECTIONS: Section[] = [
    {
        heading: "1. Information We Collect",
        body: "We may collect information that you provide when you register, contact us, make a purchase, or use our services. This may include your name, phone number, email address, payment information, and other information needed to provide our services.\n\nWe may also collect basic information about how you use our website or services, such as your device information, IP address, browser type, and activity on our platform.",
    },
    {
        heading: "2. How We Use Your Information",
        body: "We may use your information to:\n\n• Provide and improve our services.\n• Process your orders and payments.\n• Communicate with you about your account or transactions.\n• Provide customer support.\n• Send important service updates and notifications.\n• Prevent fraud, abuse, and unauthorized activities.\n• Improve the security and performance of our platform.\n• Comply with applicable laws and legal requirements.\n\nWe will only use your information for legitimate business purposes and in a way that is consistent with this Privacy Policy.",
    },
    {
        heading: "3. Sharing of Personal Information",
        body: "We do not sell your personal information to other people or companies.\n\nHowever, we may share necessary information with trusted service providers who help us operate our business, such as payment processors, hosting providers, technology providers, or customer support services.\n\nWe may also disclose your information when required by law, court order, or a valid request from a government authority, or when we believe it is necessary to:\n\n• Comply with a legal obligation.\n• Protect the rights or property of Africa Data Solutions.\n• Prevent or investigate fraud, abuse, or other wrongdoing.\n• Protect the safety of our users or the public.\n• Protect Africa Data Solutions from legal claims or liability.",
    },
    {
        heading: "4. Security of Your Information",
        body: "We take reasonable steps to protect your personal information from unauthorized access, loss, misuse, alteration, or disclosure.\n\nHowever, no method of storing or transmitting information over the internet is completely secure. Therefore, while we work to protect your information, we cannot guarantee 100% security.",
    },
    {
        heading: "5. Data Retention",
        body: "We keep your personal information only for as long as it is reasonably necessary to provide our services, maintain business records, meet legal requirements, resolve disputes, and protect our business.\n\nWhen your information is no longer needed, we may securely delete or remove it.",
    },
    {
        heading: "6. Children's Privacy",
        body: "Our services are not intended for children under the age of 13.\n\nWe do not knowingly collect personal information from children under 13. If we discover that we have collected such information without the required parental consent, we will take reasonable steps to remove it.\n\nIf your country requires parental consent before collecting information from a child, we will follow the applicable requirements.",
    },
    {
        heading: "7. Cookies and Similar Technologies",
        body: "Africa Data Solutions may use cookies and similar technologies to improve the performance of our website, remember user preferences, understand how our services are used, and improve your experience.\n\nYou may be able to control or disable cookies through your browser settings. However, disabling some cookies may affect how certain parts of our services work.",
    },
    {
        heading: "8. Third-Party Services and Websites",
        body: "Our services may contain links to websites or services operated by third parties.\n\nIf you click on a third-party link, you will be taken to a website that is not controlled by Africa Data Solutions. We encourage you to read the privacy policy of any third-party website you visit.\n\nAfrica Data Solutions is not responsible for the content, security, or privacy practices of third-party websites.",
    },
    {
        heading: "9. Your Privacy Rights",
        body: "Depending on applicable laws, you may have the right to:\n\n• Ask what personal information we hold about you.\n• Request correction of incorrect information.\n• Request deletion of your personal information where legally allowed.\n• Withdraw consent where processing is based on consent.\n• Ask questions about how your information is being used.\n\nTo make a privacy request, you can contact us using the details provided below.",
    },
    {
        heading: "10. Changes to This Privacy Policy",
        body: "Africa Data Solutions may update this Privacy Policy from time to time to reflect changes in our services, business practices, or legal requirements.\n\nWhen we make important changes, we may notify you by posting the updated policy on our website or through other appropriate communication channels.\n\nWe encourage you to review this Privacy Policy from time to time so you remain informed about how we protect your information.",
    },
    {
        heading: "11. Contact Us",
        body: "If you have any questions, concerns, or requests about this Privacy Policy or how we handle your personal information, please contact us:\n\nEmail: africadatasupport@gmail.com\nWebsite: www.africadatasolutions.org\nWhatsApp: 08160604894",
    },
];

/** Renders plain text with newlines preserved as paragraph/line breaks */
function BodyText({ text }: { text: string }) {
    const paragraphs = text.split('\n\n');
    return (
        <div className="space-y-3">
            {paragraphs.map((para, pi) => (
                <p key={pi} className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
                    {para}
                </p>
            ))}
        </div>
    );
}

const Privacy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sticky top header */}
            <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        id="privacy-back-btn"
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors duration-150"
                        aria-label="Go back"
                    >
                        <ChevronLeft size={22} className="text-blue-600" />
                    </button>

                    <h1 className="text-lg font-bold text-gray-800">Privacy Policy</h1>

                    {/* Spacer to keep title centered */}
                    <div className="w-9" />
                </div>
            </header>

            {/* Page content */}
            <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">

                {/* Intro card */}
                <div className="bg-blue-50 border-l-4 border-blue-600 rounded-2xl p-5 space-y-2">
                    <div className="flex items-center gap-2">
                        <Shield size={18} className="text-blue-600 shrink-0" />
                        <h2 className="text-base font-bold text-gray-800">
                            AfricaData Solutions Privacy Policy
                        </h2>
                    </div>
                    <p className="text-xs text-gray-500">Last Updated: September 2026</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        At Africa Data Solutions, we respect your privacy and take the protection of your
                        personal information seriously. This Privacy Policy explains how we collect, use,
                        protect, and handle your information when you use our website, app, or services.
                    </p>
                </div>

                {/* Sections */}
                <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
                    {SECTIONS.map((section, index) => (
                        <div key={index} className="px-6 py-5 space-y-3">
                            <h3 className="text-sm font-bold text-gray-800">{section.heading}</h3>
                            <BodyText text={section.body} />
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="bg-white rounded-2xl px-6 py-5 text-center shadow-sm">
                    <p className="text-xs text-gray-400 italic leading-relaxed">
                        Africa Data Solutions — We value your privacy and are committed to handling your
                        information responsibly.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Privacy;

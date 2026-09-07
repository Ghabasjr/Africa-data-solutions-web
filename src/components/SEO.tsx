import { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
}

const SEO = ({ title, description, keywords }: SEOProps) => {
    const defaultTitle = "Africa Data Solutions - Seamless Digital Transactions";
    const defaultDescription = "Pay for Data, Airtime, Electricity, and Cable TV bills instantly with Africa Data Solutions.";

    useEffect(() => {
        // Update Title
        const fullTitle = title ? `${title} | Africa Data Solutions` : defaultTitle;
        document.title = fullTitle;

        // Update Meta Description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', description || defaultDescription);

        // Update Meta Keywords
        if (keywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.setAttribute('name', 'keywords');
                document.head.appendChild(metaKeywords);
            }
            metaKeywords.setAttribute('content', keywords);
        }

        // Update OG Title
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', title || defaultTitle);

    }, [title, description, keywords]);

    return null; // This component doesn't render anything
};

export default SEO;

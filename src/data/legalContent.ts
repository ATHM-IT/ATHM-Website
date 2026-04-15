
export interface LegalSection {
    id: string;
    title: string;
    description: string;
    lastUpdated: string;
    content: {
        title: string;
        body: string[];
    }[];
}

export const legalContent: Record<string, LegalSection> = {
    privacy: {
        id: 'privacy',
        title: 'Privacy Policy',
        description: 'How we protect and manage your personal data under POPIA.',
        lastUpdated: 'April 14, 2026',
        content: [
            {
                title: 'Data Collection',
                body: [
                    'We collect personal information that you provide to us when you create an account, place an order, or use the wishlist feature.',
                    'This information may include your name, email address, physical delivery address, and contact number.'
                ]
            },
            {
                title: 'Purpose of Collection',
                body: [
                    'Your data is used solely for processing and delivering your hardware orders, complying with SARS tax requirements, and providing technical support.',
                    'We do not sell your personal data to any third parties.'
                ]
            },
            {
                title: 'Sharing with Third Parties',
                body: [
                    'We share your information only with essential partners: PayFast (for secure payment processing) and our designated courier partners (for physical delivery).',
                    'All partners are strictly prohibited from using your data for any other purpose.'
                ]
            },
            {
                title: 'Your Rights (POPIA)',
                body: [
                    'In accordance with the Protection of Personal Information Act, you have the right to access, correct, or request the deletion of your personal data at any time.',
                    'Please contact our Information Officer at support@athm.co.za for any privacy-related requests.'
                ]
            }
        ]
    },
    terms: {
        id: 'terms',
        title: 'Terms of Service',
        description: 'The legal framework governing our relationship with you.',
        lastUpdated: 'April 14, 2026',
        content: [
            {
                title: 'Merchant Disclosure (ECTA)',
                body: [
                    'ATHM International (PTY) LTD',
                    'Registration Number: [REGISTRATION_NUMBER]',
                    'Physical Address: 155 West Street, Sandton, Johannesburg, 2196',
                    'Contact: support@athm.co.za'
                ]
            },
            {
                title: 'Electronic Contracting',
                body: [
                    'By placing an order on this website, you are entering into a binding electronic contract governed by the Electronic Communications and Transactions Act (ECTA).',
                    'The contract is deemed concluded only once we have confirmed and dispatched your order.'
                ]
            },
            {
                title: 'Pricing & VAT',
                body: [
                    'All prices are listed in South African Rand (ZAR).',
                    'Prices include the standard 15% VAT unless otherwise specified. We reserve the right to correct any clear pricing errors before order fulfillment.'
                ]
            },
            {
                title: 'Payments',
                body: [
                    'Payments are processed via the secure PayFast gateway. We do not store your credit card information on our servers.',
                    'By initiating a transaction, you warrant that you are authorized to use the payment method provided.'
                ]
            }
        ]
    },
    returns: {
        id: 'returns',
        title: 'Refunds & Returns',
        description: 'Our commitment to quality hardware and customer consumer rights.',
        lastUpdated: 'April 14, 2026',
        content: [
            {
                title: 'Cooling-Off Period (ECTA Section 44)',
                body: [
                    'Under Section 44 of the ECTA, you are entitled to cancel your electronic purchase within 7 days of receiving the goods for a full refund (minus shipping costs).',
                    'The items must be returned in their original, unopened, and resalable condition.'
                ]
            },
            {
                title: 'Defective Goods (CPA Section 56)',
                body: [
                    'If a product malfunctions within its warranty period (minimum 6 months as per the Consumer Protection Act), you are entitled to a repair, replacement, or refund.',
                    'This warranty does not cover damage from lightning, power surges, or unauthorized modifications.'
                ]
            },
            {
                title: 'Exclusions',
                body: [
                    'Refunds are physically not possible for sealed software that has been opened or for custom PC builds that were specifically commissioned to your unique specs.',
                    'We reserve the right to charge a restocking fee for items returned without original packaging.'
                ]
            }
        ]
    },
    shipping: {
        id: 'shipping',
        title: 'Shipping & Delivery',
        description: 'Nationwide logistics for high-end technology.',
        lastUpdated: 'April 14, 2026',
        content: [
            {
                title: 'Delivery Timeframes',
                body: [
                    'Main Centers (JHB, CPT, DBN): 1-3 business days.',
                    'Regional Areas: 3-5 business days.',
                    'Orders are generally dispatched within 24 hours of payment verification.'
                ]
            },
            {
                title: 'Standard Shipping Rates',
                body: [
                    'We offer a flat-rate shipping of R150 for orders below R5,000.',
                    'Orders over R5,000 qualify for FREE nationwide courier delivery.'
                ]
            },
            {
                title: 'Our Partners',
                body: [
                    'We partner with premier South African logistics networks including The Courier Guy and Aramex to ensure your hardware is handled with care.'
                ]
            }
        ]
    }
};

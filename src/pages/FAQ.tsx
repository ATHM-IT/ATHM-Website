import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Truck, CreditCard, RotateCcw, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{
            marginBottom: '1rem',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            overflow: 'hidden'
        }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '1.5rem',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 600
                }}
            >
                {question}
                {isOpen ? <ChevronUp size={20} color="var(--color-gold)" /> : <ChevronDown size={20} color="var(--color-text-muted)" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div style={{
                            padding: '0 1.5rem 1.5rem',
                            color: 'var(--color-text-muted)',
                            lineHeight: 1.6
                        }}>
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const FAQ: React.FC = () => {
    const categories = [
        {
            title: 'Shipping & Delivery',
            icon: <Truck size={24} color="var(--color-gold)" />,
            items: [
                {
                    question: 'How long does delivery take?',
                    answer: 'Most orders within South Africa are delivered within 2-5 business days. Remote areas may take slightly longer. We use trusted couriers like The Courier Guy and Aramex.'
                },
                {
                    question: 'Can I track my order?',
                    answer: 'Yes! Once your order has been dispatched, you will receive an email with your tracking number and a link to the courier’s portal.'
                },
                {
                    question: 'Do you offer international shipping?',
                    answer: 'Currently, ATHM focuses on serving the South African market. We do not offer international shipping at this time.'
                }
            ]
        },
        {
            title: 'Returns & Warranties',
            icon: <RotateCcw size={24} color="var(--color-gold)" />,
            items: [
                {
                    question: 'What is your return policy?',
                    answer: 'You can return unopened items in their original packaging within 7 days of delivery. Used or opened items may be subject to a restocking fee or may not be returnable depending on the item type (e.g., software or thermal paste).'
                },
                {
                    question: 'How do I start an RMA (Return Merchandise Authorization)?',
                    answer: 'Please visit our Support page and select "Start a Return". You will need your order number and the serial number of the product.'
                }
            ]
        },
        {
            title: 'Payments',
            icon: <CreditCard size={24} color="var(--color-gold)" />,
            items: [
                {
                    question: 'What payment methods do you accept?',
                    answer: 'We accept major credit/debit cards (Visa, Mastercard), Instant EFT via PayFast, and manual bank transfers (EFT).'
                },
                {
                    question: 'Is it safe to shop on ATHM?',
                    answer: 'Absolutely. We use industry-standard SSL encryption and partner with secure payment gateways like PayFast and Stripe to ensure your data is always protected.'
                }
            ]
        },
        {
            title: 'Technical Support',
            icon: <ShieldCheck size={24} color="var(--color-gold)" />,
            items: [
                {
                    question: 'Do you offer assembly services?',
                    answer: 'Yes! We offer professional PC assembly and stress testing. You can select this option at checkout when purchasing a full set of components.'
                },
                {
                    question: 'Are the products brand new?',
                    answer: 'Every product sold on ATHM is 100% brand new and locally sourced from authorized South African distributors, ensuring full manufacturer warranty support.'
                }
            ]
        }
    ];

    return (
        <section style={{ padding: '6rem 2rem', maxWidth: '900px', margin: '0 auto', minHeight: '80vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <HelpCircle size={48} color="var(--color-gold)" style={{ marginBottom: '1rem' }} />
                <h1 style={{ fontSize: '3rem', color: 'white', marginBottom: '1rem' }}>Frequently Asked Questions</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>
                    Quick answers to the most common queries regarding our hardware and services.
                </p>
            </div>

            {categories.map((category, index) => (
                <div key={index} style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                        {category.icon}
                        <h2 style={{ fontSize: '1.5rem', color: 'white', margin: 0 }}>{category.title}</h2>
                    </div>
                    {category.items.map((item, itemIndex) => (
                        <FAQItem key={itemIndex} question={item.question} answer={item.answer} />
                    ))}
                </div>
            ))}

            <div style={{
                marginTop: '4rem',
                padding: '3rem',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(0,0,0,0) 100%)',
                borderRadius: '24px',
                border: '1px solid var(--glass-border)',
                textAlign: 'center'
            }}>
                <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>Still need help?</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    Our team of IT experts is ready to assist you with any technical hardware questions.
                </p>
                <button
                    onClick={() => window.location.href = '/support'}
                    style={{
                        padding: '1rem 2.5rem',
                        background: 'var(--color-gold)',
                        color: 'black',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-gold)'
                    }}
                >
                    Contact Support
                </button>
            </div>
        </section>
    );
};

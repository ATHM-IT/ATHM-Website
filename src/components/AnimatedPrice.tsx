import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedPriceProps {
    price: number;
    prefix?: string;
    style?: React.CSSProperties;
    className?: string;
}

export const AnimatedPrice: React.FC<AnimatedPriceProps> = ({ price, prefix = 'R ', style, className }) => {
    return (
        <span 
            className={className} 
            style={{ 
                display: 'inline-flex', 
                overflow: 'hidden', 
                alignItems: 'center',
                ...style 
            }}
        >
            <span>{prefix}</span>
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={price}
                    initial={{ y: -20, opacity: 0, filter: 'blur(4px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: 20, opacity: 0, filter: 'blur(4px)', position: 'absolute' }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    style={{ display: 'inline-block' }}
                >
                    {price.toFixed(2)}
                </motion.span>
            </AnimatePresence>
        </span>
    );
};

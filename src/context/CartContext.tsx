import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Product } from '../types';
import { useProducts } from '../hooks/useProducts';

interface CartItem extends Product {
    quantity: number;
    currentPrice: number; // The price at the moment of viewing/buying
    price?: number; // fallback or redundant with currentPrice depending on usage
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
}

type CartAction =
    | { type: 'ADD_ITEM'; payload: Product }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'TOGGLE_CART' }
    | { type: 'SET_CART'; payload: CartState };

const initialState: CartState = {
    items: [],
    isOpen: false
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            const currentPrice = action.payload.price || action.payload.basePrice;

            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                    isOpen: true
                };
            }
            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: 1, currentPrice, price: currentPrice }],
                isOpen: true
            };
        }
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            };
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: Math.max(0, action.payload.quantity) }
                        : item
                ).filter(item => item.quantity > 0)
            };
        case 'CLEAR_CART':
            return { ...state, items: [] };
        case 'TOGGLE_CART':
            return { ...state, isOpen: !state.isOpen };
        case 'SET_CART':
            return action.payload;
        default:
            return state;
    }
};

const CartContext = createContext<{
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { products } = useProducts();

    // Map cart items to their latest live prices from the global `products` view
    const liveItems = React.useMemo(() => {
        return state.items.map(item => {
            const liveProd = products.find(p => p.name === item.name); // match by name allows supplier swapping
            if (liveProd) {
                return { ...item, price: liveProd.price, basePrice: liveProd.basePrice };
            }
            return item;
        });
    }, [state.items, products]);

    const liveState = { ...state, items: liveItems };

    // Load from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('athm-cart');
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                // Validate minimal structure
                if (parsed && Array.isArray(parsed.items)) {
                    dispatch({ type: 'SET_CART', payload: { ...parsed, isOpen: false } });
                }
            } catch (e) {
                console.error("Failed to parse cart", e);
                localStorage.removeItem('athm-cart');
            }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('athm-cart', JSON.stringify(state));
    }, [state]);

    return (
        <CartContext.Provider value={{ state: liveState, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    const { state, dispatch } = context;

    // Defensive check
    if (!state) {
        console.error("CartContext state is undefined");
        return {
            cart: [],
            isOpen: false,
            total: 0,
            addItem: () => { },
            removeItem: () => { },
            updateQuantity: () => { },
            clearCart: () => { },
            toggleCart: () => { }
        };
    }

    const cart = state.items || []; // Ensure items is an array
    const isOpen = state.isOpen;

    const total = cart.reduce((sum, item) => sum + (item.price || item.basePrice || 0) * item.quantity, 0);

    const addItem = (product: Product) => dispatch({ type: 'ADD_ITEM', payload: product });
    const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id });
    const updateQuantity = (id: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });
    const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });

    return {
        cart,
        isOpen,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart
    };
};

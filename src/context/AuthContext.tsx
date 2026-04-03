import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { Session } from '@supabase/supabase-js';

interface User {
    id: string;
    name: string;
    email: string;
    wishlist: string[]; // Array of Product IDs
    avatar_url?: string;
    isAdmin?: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password?: string) => Promise<void>;
    signup: (name: string, email: string, password?: string) => Promise<void>;
    logout: () => Promise<void>;
    addToWishlist: (productId: string) => void;
    removeFromWishlist: (productId: string) => void;
    refreshProfile: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        if (isSupabaseConfigured) {
            // Real Auth
            supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
                if (session) {
                    mapSessionToUser(session).then(u => {
                        setUser(u);
                        fetchWishlist(u.id);
                    });
                }
                setIsLoading(false);
            });

            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: Session | null) => {
                if (session) {
                    mapSessionToUser(session).then(u => {
                        setUser(u);
                        fetchWishlist(u.id);
                    });
                } else {
                    setUser(null);
                }
                setIsLoading(false);
            });

            return () => subscription.unsubscribe();
        } else {
            setIsLoading(false);
        }
    }, []);

    const mapSessionToUser = async (session: Session): Promise<User> => {
        const { user } = session;
        const email = user.email || '';
        const isAdmin = email.endsWith('@athm.com') || email === 'admin@admin.com';

        // Fetch profile data
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url, is_admin')
            .eq('id', user.id)
            .single();

        return {
            id: user.id,
            name: profile?.full_name || user.user_metadata?.name || email.split('@')[0],
            email: email,
            avatar_url: profile?.avatar_url,
            wishlist: [], // Will be populated by fetchWishlist
            isAdmin: profile?.is_admin || isAdmin // Check DB first, then email fallback
        };
    };

    const fetchWishlist = async (userId: string) => {
        const { data } = await supabase
            .from('wishlist_items')
            .select('product_id')
            .eq('user_id', userId);

        if (data) {
            setUser(prev => prev ? ({ ...prev, wishlist: data.map((item: { product_id: string }) => item.product_id) }) : null);
        }
    };

    const login = async (email: string, password?: string) => {
        if (isSupabaseConfigured && password) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        } else {
            throw new Error('Supabase not configured or password missing');
        }
    };

    const signup = async (name: string, email: string, password?: string) => {
        if (isSupabaseConfigured && password) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                    }
                }
            });
            if (error) throw error;
        } else {
            throw new Error('Supabase not configured or password missing');
        }
    };

    const logout = async () => {
        if (isSupabaseConfigured) {
            await supabase.auth.signOut();
        }
        setUser(null);
    };

    const addToWishlist = async (productId: string) => {
        if (!user || !isSupabaseConfigured) return;

        const { error } = await supabase
            .from('wishlist_items')
            .insert({ user_id: user.id, product_id: productId });

        if (!error) {
            setUser(prev => prev ? ({ ...prev, wishlist: [...prev.wishlist, productId] }) : null);
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (!user || !isSupabaseConfigured) return;

        const { error } = await supabase
            .from('wishlist_items')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId);

        if (!error) {
            setUser(prev => prev ? ({ ...prev, wishlist: prev.wishlist.filter(id => id !== productId) }) : null);
        }
    };

    const refreshProfile = async () => {
        if (!isSupabaseConfigured) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const updatedUser = await mapSessionToUser(session);
            setUser(updatedUser);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, addToWishlist, removeFromWishlist, refreshProfile, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

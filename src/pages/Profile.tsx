import React from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, Heart, Package } from 'lucide-react';
import { OrderHistory } from '../components/OrderHistory';

export const Profile: React.FC = () => {
    const { user, logout, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = React.useState(false);
    const [name, setName] = React.useState(user?.name || '');
    const [loading, setLoading] = React.useState(false);

    // Update local state when user loads
    React.useEffect(() => {
        if (user) setName(user.name);
    }, [user]);

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleUpdateProfile = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: name,
                    updated_at: new Date(),
                    username: user.email?.split('@')[0] // Fallback username
                });

            if (error) throw error;

            // Refresh user data in context without reloading page
            await refreshProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        } finally {
            setLoading(false);
            setIsEditing(false);
        }
    };

    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
            <div style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid var(--glass-border)',
                padding: '3rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '2rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'var(--color-gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'black',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}>
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                        {isEditing ? (
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{
                                        padding: '0.5rem',
                                        fontSize: '1.5rem',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid var(--color-gold)',
                                        color: 'white',
                                        borderRadius: '4px'
                                    }}
                                />
                                <button
                                    onClick={handleUpdateProfile}
                                    disabled={loading}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: 'var(--color-gold)',
                                        color: 'black',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: 'transparent',
                                        color: 'white',
                                        border: '1px solid white',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'white' }}>{user.name}</h1>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    style={{
                                        padding: '0.25rem 0.75rem',
                                        fontSize: '0.8rem',
                                        background: 'rgba(255,255,255,0.1)',
                                        color: 'var(--color-text-muted)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                        <p style={{ color: 'var(--color-text-muted)' }}>{user.email}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div
                        onClick={() => navigate('/wishlist')}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '2rem',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            border: '1px solid transparent',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: '1rem'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-gold)';
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        }}
                    >
                        <Heart size={40} color="var(--color-gold)" />
                        <h3 style={{ fontSize: '1.2rem', color: 'white' }}>My Wishlist</h3>
                        <p style={{ color: 'var(--color-text-muted)' }}>{user.wishlist.length} items saved</p>
                    </div>

                </div>

                {/* Orders Section taking full width now */}
                <div style={{ marginTop: '2rem' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', marginBottom: '1.5rem', color: 'white' }}>
                        <Package size={24} color="var(--color-gold)" /> Order History
                    </h2>
                    <OrderHistory />
                </div>

                <button
                    onClick={handleLogout}
                    style={{
                        alignSelf: 'flex-start',
                        marginTop: '1rem',
                        background: 'transparent',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '1rem',
                        padding: '0.5rem 1rem',
                        border: '1px solid #ef4444',
                        borderRadius: '8px',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <LogOut size={18} /> Sign Out
                </button>
            </div>
        </div>
    );
};

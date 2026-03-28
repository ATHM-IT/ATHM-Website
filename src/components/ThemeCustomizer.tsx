import React, { useState, useEffect } from 'react';
import { Settings, X, Move, Palette } from 'lucide-react';

interface ThemeSettings {
    logoX: number;
    logoY: number;
    primaryColor: string; // Gold
    secondaryColor: string; // Purple
    backgroundColor: string; // Black
}

export const ThemeCustomizer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [settings, setSettings] = useState<ThemeSettings>({
        logoX: 20,
        logoY: 20,
        primaryColor: '#D4AF37',
        secondaryColor: '#4B0082',
        backgroundColor: '#050505',
    });

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('athm-theme-settings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, []);

    // Apply changes to CSS variables and trigger logo updates
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--color-gold', settings.primaryColor);
        root.style.setProperty('--color-purple', settings.secondaryColor);
        root.style.setProperty('--color-bg', settings.backgroundColor);

        // Dispatch a custom event so Navbar can listen to position changes
        window.dispatchEvent(new CustomEvent('theme-change', { detail: settings }));

        localStorage.setItem('athm-theme-settings', JSON.stringify(settings));
    }, [settings]);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    background: 'var(--color-gold)',
                    color: 'black',
                    padding: '12px',
                    borderRadius: '50%',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    zIndex: 1000,
                    cursor: 'pointer'
                }}
            >
                <Settings size={24} />
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '300px',
            background: 'rgba(20, 20, 20, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--color-gold)',
            borderRadius: '12px',
            padding: '20px',
            zIndex: 1000,
            color: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.8)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Palette size={18} /> Theme Editor
                </h3>
                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', color: 'gray' }}>
                    <X size={18} />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Colors */}
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Primary (Gold)</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="color"
                            value={settings.primaryColor}
                            onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                            style={{ flex: 1, padding: 0, height: '30px', border: 'none' }}
                        />
                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{settings.primaryColor}</span>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Secondary (Purple)</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="color"
                            value={settings.secondaryColor}
                            onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                            style={{ flex: 1, padding: 0, height: '30px', border: 'none' }}
                        />
                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{settings.secondaryColor}</span>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Background</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="color"
                            value={settings.backgroundColor}
                            onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                            style={{ flex: 1, padding: 0, height: '30px', border: 'none' }}
                        />
                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{settings.backgroundColor}</span>
                    </div>
                </div>

                <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                {/* Logo Position */}
                <div>
                    <label style={{ marginBottom: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Move size={14} /> Logo Position (Offset)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <label style={{ fontSize: '0.75rem', opacity: 0.7 }}>X (px)</label>
                            <input
                                type="number"
                                value={settings.logoX}
                                onChange={(e) => setSettings({ ...settings, logoX: Number(e.target.value) })}
                                style={{ width: '100%', padding: '4px', background: '#333', border: 'none', color: 'white', borderRadius: '4px' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', opacity: 0.7 }}>Y (px)</label>
                            <input
                                type="number"
                                value={settings.logoY}
                                onChange={(e) => setSettings({ ...settings, logoY: Number(e.target.value) })}
                                style={{ width: '100%', padding: '4px', background: '#333', border: 'none', color: 'white', borderRadius: '4px' }}
                            />
                        </div>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'gray', marginTop: '4px' }}>
                        Adjusts offset from top-left (or default position).
                    </p>
                </div>

                <button
                    onClick={() => setSettings({
                        logoX: 20,
                        logoY: 20,
                        primaryColor: '#D4AF37',
                        secondaryColor: '#4B0082',
                        backgroundColor: '#050505'
                    })}
                    style={{
                        marginTop: '10px',
                        padding: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                    }}
                >
                    Reset to Default
                </button>
            </div>
        </div>
    );
};

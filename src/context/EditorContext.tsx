
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface EditorElement {
    id: string;
    type: 'text' | 'image';
    content: string; // Text content or Image URL
    x: number;
    y: number;
    width?: number; // Optional for text/image
    height?: number; // Optional for text/image
    // Advanced Styling
    color?: string;
    fontFamily?: string;
    fontSize?: number; // in px
    textAlign?: 'left' | 'center' | 'right';
    opacity?: number; // 0 to 1
    style?: React.CSSProperties;
}

interface EditorContextType {
    isEditing: boolean;
    toggleEditing: () => void;
    elements: EditorElement[];
    addElement: (type: 'text' | 'image', initialContent?: string) => void;
    updateElement: (id: string, updates: Partial<EditorElement>, skipHistory?: boolean) => void;
    removeElement: (id: string) => void;
    undo: () => void;
    canUndo: boolean;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [elements, setElements] = useState<EditorElement[]>([]);
    const [history, setHistory] = useState<EditorElement[][]>([]);

    const saveToHistory = () => {
        setHistory(prev => {
            const newHistory = [...prev, elements];
            if (newHistory.length > 30) return newHistory.slice(1);
            return newHistory;
        });
    };

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('athm-editor-elements');
        if (saved) {
            setElements(JSON.parse(saved));
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('athm-editor-elements', JSON.stringify(elements));
    }, [elements]);

    const toggleEditing = () => setIsEditing(prev => !prev);

    const addElement = (type: 'text' | 'image', initialContent?: string) => {
        saveToHistory();
        const newElement: EditorElement = {
            id: crypto.randomUUID(),
            type,
            content: initialContent || (type === 'text' ? 'Double click to edit text' : 'https://via.placeholder.com/150'),
            x: window.scrollX + 100, // Spawn near top-left of viewport
            y: window.scrollY + 100,
            width: type === 'image' ? 200 : undefined,
            height: type === 'image' ? 150 : undefined,
            color: '#ffffff',
            fontSize: 16,
            textAlign: 'left',
            opacity: 1,
            fontFamily: 'Arial, sans-serif',
            style: {
                fontWeight: 'normal'
            }
        };
        setElements(prev => [...prev, newElement]);
    };

    const updateElement = (id: string, updates: Partial<EditorElement>, skipHistory: boolean = false) => {
        if (!skipHistory) {
            saveToHistory();
        }
        setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
    };

    const removeElement = (id: string) => {
        saveToHistory();
        setElements(prev => prev.filter(el => el.id !== id));
    };

    const undo = () => {
        if (history.length === 0) return;
        setElements(history[history.length - 1]);
        setHistory(prev => prev.slice(0, -1));
    };

    return (
        <EditorContext.Provider value={{ isEditing, toggleEditing, elements, addElement, updateElement, removeElement, undo, canUndo: history.length > 0 }}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditor = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
};

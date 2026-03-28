import React, { useState, useEffect } from 'react';
import { Type, Image as ImageIcon, X, Check, Edit2, AlignLeft, AlignCenter, AlignRight, Upload } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import type { EditorElement } from '../context/EditorContext';

const DraggableItem: React.FC<{ element: EditorElement }> = ({ element }) => {
    const { updateElement, removeElement, isEditing } = useEditor();
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [localContent, setLocalContent] = useState(element.content);
    const [isEditingContent, setIsEditingContent] = useState(false);

    // Initial position
    const [pos, setPos] = useState({ x: element.x, y: element.y });

    useEffect(() => {
        setPos({ x: element.x, y: element.y });
    }, [element.x, element.y]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isEditing) return;
        setIsDragging(true);
        // Save history BEFORE starting drag
        updateElement(element.id, {}, false);
        setDragOffset({
            x: e.clientX - pos.x,
            y: e.clientY - pos.y
        });
        e.stopPropagation();
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            setPos({ x: newX, y: newY });
            // Update without saving history during drag
            updateElement(element.id, { x: newX, y: newY }, true);
        }
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            // Final update (still skip as we saved at start)
            updateElement(element.id, { x: pos.x, y: pos.y }, true);
        }
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    if (!isEditing && !element.content) return null;

    return (
        <div
            style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                cursor: isEditing ? 'grab' : 'default',
                border: isEditing ? '1px dashed var(--color-gold)' : 'none',
                minWidth: '50px',
                minHeight: '20px',
                padding: isEditing ? '10px' : '0',
                zIndex: isEditing ? 1000 : 10,
                color: element.color,
                fontSize: element.fontSize,
                opacity: element.opacity,
                fontFamily: element.fontFamily,
                textAlign: element.textAlign || 'left',
                ...element.style
            }}
            onMouseDown={handleMouseDown}
        >
            {isEditing && (
                <div style={{ position: 'absolute', top: '-30px', right: 0, display: 'flex', gap: '5px', background: 'rgba(0,0,0,0.8)', padding: '4px', borderRadius: '4px' }}>
                    <button onClick={() => setIsEditingContent(true)} style={{ color: 'var(--color-gold)' }}><Edit2 size={14} /></button>
                    <button onClick={() => removeElement(element.id)} style={{ color: '#ef4444' }}><X size={14} /></button>
                </div>
            )}

            {isEditingContent ? (
                <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 1001, background: '#222', padding: '10px', border: '1px solid var(--color-gold)', marginTop: '5px', minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '8px' }}>

                    {/* Content Editor */}
                    <label style={{ fontSize: '0.8rem', color: '#aaa' }}>Content</label>
                    <textarea
                        value={localContent}
                        onChange={(e) => setLocalContent(e.target.value)}
                        style={{ width: '100%', background: '#111', color: 'white', border: '1px solid #444', padding: '5px', borderRadius: '4px' }}
                        rows={3}
                    />

                    {/* Styling Controls */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '4px' }}>Color</label>
                            <input
                                type="color"
                                value={element.color || '#ffffff'}
                                onMouseDown={() => updateElement(element.id, {}, false)}
                                onChange={(e) => updateElement(element.id, { color: e.target.value }, true)}
                                style={{ width: '100%', height: '30px', border: 'none', padding: 0 }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '4px' }}>Opacity</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={element.opacity ?? 1}
                                onMouseDown={() => updateElement(element.id, {}, false)}
                                onChange={(e) => updateElement(element.id, { opacity: parseFloat(e.target.value) }, true)}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '4px' }}>Size (px)</label>
                            <input
                                type="number"
                                value={element.fontSize ?? 16}
                                onMouseDown={() => updateElement(element.id, {}, false)}
                                onChange={(e) => updateElement(element.id, { fontSize: parseInt(e.target.value) }, true)}
                                style={{ width: '100%', background: '#111', color: 'white', border: '1px solid #444', padding: '4px' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '4px' }}>Font</label>
                            <select
                                value={element.fontFamily || 'Arial, sans-serif'}
                                onChange={(e) => updateElement(element.id, { fontFamily: e.target.value })}
                                style={{ width: '100%', background: '#111', color: 'white', border: '1px solid #444', padding: '4px' }}
                            >
                                <option value="Arial, sans-serif">Arial</option>
                                <option value="'Courier New', monospace">Courier</option>
                                <option value="'Times New Roman', serif">Times</option>
                                <option value="Verdana, sans-serif">Verdana</option>
                                <option value="Impact, sans-serif">Impact</option>
                            </select>
                        </div>
                    </div>

                    {/* Alignment Controls */}
                    <div>
                        <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '4px' }}>Alignment</label>
                        <div style={{ display: 'flex', gap: '4px', background: '#111', padding: '4px', border: '1px solid #444', borderRadius: '4px' }}>
                            {['left', 'center', 'right'].map((align) => (
                                <button
                                    key={align}
                                    onClick={() => updateElement(element.id, { textAlign: align as any })}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '4px',
                                        background: element.textAlign === align ? 'var(--color-gold)' : 'transparent',
                                        color: element.textAlign === align ? 'black' : 'white',
                                        border: 'none',
                                        borderRadius: '2px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {align === 'left' && <AlignLeft size={14} />}
                                    {align === 'center' && <AlignCenter size={14} />}
                                    {align === 'right' && <AlignRight size={14} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image Upload Control */}
                    {element.type === 'image' && (
                        <div>
                            <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '4px' }}>Change Image</label>
                            <button
                                onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = 'image/*';
                                    input.onchange = (e) => {
                                        const file = (e.target as HTMLInputElement).files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (readerEvent) => {
                                                const content = readerEvent.target?.result as string;
                                                updateElement(element.id, { content });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    };
                                    input.click();
                                }}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    background: '#111',
                                    color: 'white',
                                    border: '1px solid #444',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                <Upload size={14} /> Upload New
                            </button>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px', borderTop: '1px solid #444', paddingTop: '8px' }}>
                        <button onClick={() => {
                            updateElement(element.id, { content: localContent });
                            setIsEditingContent(false);
                        }} style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Check size={16} /> Save
                        </button>
                    </div>
                </div>
            ) : null}

            {element.type === 'image' ? (
                <img
                    src={element.content}
                    alt="User content"
                    style={{ width: element.width || '200px', height: 'auto', pointerEvents: 'none', display: 'block' }}
                />
            ) : (
                <div style={{ whiteSpace: 'pre-wrap' }}>{element.content}</div>
            )}

            {/* Simple resize handle for image (bottom right) */}
            {isEditing && element.type === 'image' && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-5px',
                        right: '-5px',
                        width: '15px',
                        height: '15px',
                        background: 'var(--color-gold)',
                        cursor: 'nwse-resize'
                    }}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        // Save history BEFORE starting resize
                        updateElement(element.id, {}, false);

                        const startX = e.clientX;
                        const startWidth = element.width || 200;

                        const handleResize = (moveEvent: MouseEvent) => {
                            const diff = moveEvent.clientX - startX;
                            updateElement(element.id, { width: startWidth + diff }, true);
                        };

                        const stopResize = () => {
                            window.removeEventListener('mousemove', handleResize);
                            window.removeEventListener('mouseup', stopResize);
                        };

                        window.addEventListener('mousemove', handleResize);
                        window.addEventListener('mouseup', stopResize);
                    }}
                />
            )}
        </div>
    );
};

export const EditorOverlay: React.FC = () => {
    const { isEditing, toggleEditing, addElement, elements, undo } = useEditor();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isEditing) return;

            // Undo: Ctrl+Z or Cmd+Z
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                undo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isEditing, undo]);

    return (
        <>
            {/* Toolbar - always available to toggle mode */}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px', // Opposite side of ThemeCustomizer
                zIndex: 2000,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <button
                    onClick={toggleEditing}
                    style={{
                        padding: '12px',
                        borderRadius: '50%',
                        background: isEditing ? '#22c55e' : '#333',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                    title="Toggle Content Editor"
                >
                    <Edit2 size={24} />
                </button>

                {isEditing && (
                    <div style={{
                        background: 'rgba(20, 20, 20, 0.95)',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-gold)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        <button onClick={() => addElement('text')} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', background: 'transparent' }}>
                            <Type size={16} /> Add Text
                        </button>
                        <button
                            onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (readerEvent) => {
                                            const content = readerEvent.target?.result as string;
                                            addElement('image', content);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                };
                                input.click();
                            }}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', background: 'transparent' }}
                        >
                            <ImageIcon size={16} /> Add Image
                        </button>
                    </div>
                )}
            </div>

            {/* Elements Layer */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
                {/* Only enable pointer events on the actual children, handled by them */}
                <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: isEditing ? 'auto' : 'none' }}>
                    {elements.map(el => (
                        <DraggableItem key={el.id} element={el} />
                    ))}
                </div>
            </div>
        </>
    );
};

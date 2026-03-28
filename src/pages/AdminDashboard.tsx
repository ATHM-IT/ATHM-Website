import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Upload, Users, DollarSign, Package, FileText, CheckCircle, Smartphone, Edit, Trash2, X, Plus, Settings } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { isSupabaseConfigured } from '../supabaseClient';
import { productService } from '../services/ProductService';
import type { Product } from '../types';

export const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [dragActive, setDragActive] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
    const [products, setProducts] = useState<Product[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    const [orders, setOrders] = useState<any[]>([]);
    const [view, setView] = useState<'products' | 'orders' | 'settings'>('products');
    const [selectedSupplier, setSelectedSupplier] = useState<string>('syntech');
    const [globalMarkup, setGlobalMarkup] = useState<number>(20);

    useEffect(() => {
        loadProducts();
        loadOrders();
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const { data } = await supabase.from('store_settings').select('global_markup_percentage').eq('id', 1).single();
        if (data) {
            setGlobalMarkup(data.global_markup_percentage);
        }
    };

    const loadOrders = async () => {
        if (isSupabaseConfigured) {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        *,
                        product:products (*)
                    )
                `)
                .order('created_at', { ascending: false });

            if (data) setOrders(data);
            if (error) console.error("Error loading orders:", error);
        } else {
            const mockOrdersRaw = localStorage.getItem('athm_mock_orders');
            if (mockOrdersRaw) {
                const parsed = JSON.parse(mockOrdersRaw);
                setOrders(parsed.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
            }
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        if (isSupabaseConfigured) {
            const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
            if (!error) {
                loadOrders();
                if (selectedOrder && selectedOrder.id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                }
            } else {
                alert('Error updating status: ' + error.message);
            }
        } else {
            const mockOrdersRaw = localStorage.getItem('athm_mock_orders');
            if (mockOrdersRaw) {
                const parsed = JSON.parse(mockOrdersRaw);
                const updated = parsed.map((o: any) => o.id === orderId ? { ...o, status: newStatus } : o);
                localStorage.setItem('athm_mock_orders', JSON.stringify(updated));
                setOrders(updated.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
                if (selectedOrder && selectedOrder.id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                }
            }
        }
    };

    const loadProducts = async () => {
        const { data } = await supabase
            .from('products')
            .select('*')
            .order('name');

            if (data) {
                const mappedProducts: Product[] = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                description: item.description,
                basePrice: item.price,
                category: item.category,
                categoryType: 'Hardware',
                subCategory: 'General',
                brand: item.brand,
                stock: item.stock,
                imageUrl: item.image_url,
                isSpecial: false,
                supplierId: 'sup_system'
            }));
            setProducts(mappedProducts);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = async (file: File) => {
        if (!selectedSupplier) {
            alert('Please select a supplier first.');
            return;
        }
        setUploadStatus('uploading');
        try {
            const result = await productService.uploadSupplierFile(file, selectedSupplier);
            console.log(result.message);
            setUploadStatus('success');
            setTimeout(() => setUploadStatus('idle'), 3000);
            loadProducts();
        } catch (error: any) {
            console.error(error);
            alert(`Upload failed: ${error.message}`);
            setUploadStatus('idle');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (!error) loadProducts();
            else alert('Error deleting product');
        }
    };

    const openEditModal = (product?: Product) => {
        if (product) {
            setCurrentProduct(product);
        } else {
            setCurrentProduct({
                id: `prod_${Date.now()}`,
                name: '',
                category: 'Hardware',
                basePrice: 0,
                stock: 0,
                brand: '',
                description: '',
                imageUrl: 'https://via.placeholder.com/150'
            });
        }
        setIsEditModalOpen(true);
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentProduct.name && currentProduct.basePrice) {
            const productData = {
                id: currentProduct.id,
                name: currentProduct.name,
                description: currentProduct.description || '',
                price: currentProduct.basePrice,
                category: currentProduct.category,
                brand: currentProduct.brand,
                stock: currentProduct.stock,
                image_url: currentProduct.imageUrl || 'https://via.placeholder.com/150'
            };

            const { error } = await supabase.from('products').upsert(productData);

            if (!error) {
                setIsEditModalOpen(false);
                loadProducts();
            } else {
                console.error(error);
                alert(`Error saving product: ${error.message} (Details: ${error.details})`);
            }
        }
    };

    if (!user || !user.isAdmin) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'white', minHeight: '80vh' }}>
                <h2>Access Denied</h2>
                <p>You must be an administrator to view this page.</p>
                <button
                    onClick={() => navigate('/')}
                    style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'var(--color-gold)', borderRadius: '4px' }}
                >
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', color: 'white' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                Admin Dashboard
            </h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                <StatCard icon={<DollarSign size={24} color="#10b981" />} label="Total Revenue" value="$45,231.89" trend="+12%" />
                <StatCard icon={<Users size={24} color="#3b82f6" />} label="Active Users" value="1,234" trend="+5%" />
                <StatCard icon={<Package size={24} color="#f59e0b" />} label="Products Live" value={products.length.toString()} trend="+2" />
                <StatCard icon={<Smartphone size={24} color="#8b5cf6" />} label="Mobile Visits" value="68%" trend="+8%" />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setView('products')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        background: view === 'products' ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)',
                        color: view === 'products' ? 'black' : 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        border: 'none'
                    }}
                >
                    Products
                </button>
                <button
                    onClick={() => setView('orders')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        background: view === 'orders' ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)',
                        color: view === 'orders' ? 'black' : 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        border: 'none'
                    }}
                >
                    Orders
                </button>
            </div>

            {view === 'products' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div style={{
                        background: 'var(--glass-bg)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '16px',
                        padding: '2rem',
                        boxShadow: 'var(--shadow-premium)'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Upload size={24} color="var(--color-gold)" /> Import Supplier Data
                        </h2>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Select Supplier:</label>
                            <select
                                value={selectedSupplier}
                                onChange={(e) => setSelectedSupplier(e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'white' }}
                            >
                                <option value="syntech">Syntech</option>
                                <option value="rectron">Rectron</option>
                                <option value="pinnacle">Pinnacle</option>
                                <option value="tarsus">Tarsus</option>
                                <option value="esquire">Esquire</option>
                            </select>
                        </div>
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            style={{
                                border: `2px dashed ${dragActive ? 'var(--color-gold)' : 'var(--glass-border)'}`,
                                background: dragActive ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.02)',
                                borderRadius: '12px',
                                padding: '3rem 2rem',
                                textAlign: 'center',
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                        >
                            {uploadStatus === 'uploading' ? (
                                <div style={{ animation: 'pulse 1.5s infinite' }}>
                                    <Upload size={48} color="var(--color-text-muted)" style={{ marginBottom: '1rem' }} />
                                    <p>Processing file...</p>
                                </div>
                            ) : uploadStatus === 'success' ? (
                                <div>
                                    <CheckCircle size={48} color="#10b981" style={{ marginBottom: '1rem' }} />
                                    <p style={{ color: '#10b981', fontWeight: 'bold' }}>Upload Successful!</p>
                                </div>
                            ) : (
                                <>
                                    <FileText size={48} color="var(--color-text-muted)" style={{ marginBottom: '1rem' }} />
                                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Drag & Drop supplier CSV/JSON</p>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>or click to browse</p>
                                    <input
                                        type="file"
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    <div style={{
                        gridColumn: '1 / -1',
                        background: 'var(--glass-bg)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '16px',
                        padding: '2rem',
                        boxShadow: 'var(--shadow-premium)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Package size={24} color="var(--color-gold)" /> Product Inventory
                            </h2>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button style={{
                                    padding: '0.5rem 1rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'white',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <Upload size={16} /> Sync to Cloud
                                </button>
                                <button
                                    onClick={() => openEditModal()}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: 'var(--color-gold)',
                                        color: 'black',
                                        fontWeight: 'bold',
                                        borderRadius: '4px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}>
                                    <Plus size={16} /> Add Product
                                </button>
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ position: 'sticky', top: 0, background: '#0a0a0a', zIndex: 10 }}>
                                    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Product Name</th>
                                        <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Category</th>
                                        <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Brand</th>
                                        <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Price</th>
                                        <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Stock</th>
                                        <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                                No products found. Add one manually or upload a file.
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map(product => (
                                            <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '1rem' }}>{product.name}</td>
                                                <td style={{ padding: '1rem' }}>{product.category}</td>
                                                <td style={{ padding: '1rem' }}>{product.brand}</td>
                                                <td style={{ padding: '1rem' }}>R {product.basePrice.toFixed(2)}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{ color: product.stock > 0 ? '#10b981' : '#ef4444' }}>
                                                        {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem', display: 'flex', gap: '10px' }}>
                                                    <button
                                                        onClick={() => openEditModal(product)}
                                                        style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={{
                        background: 'var(--glass-bg)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '16px',
                        padding: '2rem',
                    }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>System Status</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <StatusItem label="Database" status="Local Mode" color="#f59e0b" />
                            <StatusItem label="Supplier Feeds" status="Syncing..." color="var(--color-text-muted)" />
                            <StatusItem label="Payment Gateway" status="Test Mode" color="#f59e0b" />
                            <StatusItem label="Email Service" status="Operational" />
                        </div>
                    </div>
                </div>
            ) : view === 'orders' ? (
                <div style={{ background: 'var(--glass-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Recent Orders</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Order ID</th>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Customer</th>
                                <th style={{ padding: '1rem' }}>Total</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Items</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                        {order.id.slice(0, 8)}...
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {order.shipping_address?.full_name || 'N/A'}
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--color-gold)', fontWeight: 'bold' }}>
                                        R {Number(order.total_amount).toFixed(2)}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            background: order.status === 'paid' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                            color: order.status === 'paid' ? '#34d399' : '#fbbf24',
                                            textTransform: 'capitalize',
                                            fontSize: '0.85rem'
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                        {order.order_items?.length} items
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                            {order.order_items?.map((item: any) => item.product?.name || item.products?.name).join(', ').slice(0, 30)}...
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            style={{
                                                padding: '6px 12px',
                                                background: 'rgba(255,255,255,0.1)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                color: 'white',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>No orders found.</div>}
                </div>
            ) : (
                <div style={{ background: 'var(--glass-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Settings size={24} color="var(--color-gold)" /> Store Settings
                    </h2>
                    <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Global Markup Percentage (%)</label>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input
                                    type="number"
                                    min="0"
                                    value={globalMarkup}
                                    onChange={(e) => setGlobalMarkup(parseFloat(e.target.value) || 0)}
                                    style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'white' }}
                                />
                                <button
                                    onClick={async () => {
                                        const { error } = await supabase.from('store_settings').upsert({ id: 1, global_markup_percentage: globalMarkup });
                                        if (error) alert('Failed to save settings: ' + error.message);
                                        else alert('Settings saved successfully!');
                                    }}
                                    style={{ padding: '0.8rem 1.5rem', background: 'var(--color-gold)', color: 'black', fontWeight: 'bold', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                >
                                    Save
                                </button>
                            </div>
                            <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                                This percentage is automatically added to the cost price of all products displayed on the storefront.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100,
                    display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        background: '#1a1a1a', border: '1px solid var(--glass-border)', borderRadius: '12px',
                        padding: '2rem', width: '100%', maxWidth: '500px', position: 'relative'
                    }}>
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                            {currentProduct.id?.startsWith('prod_') && !products.find(p => p.id === currentProduct.id) ? 'Add Product' : 'Edit Product'}
                        </h2>
                        <form onSubmit={handleSaveProduct} style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={currentProduct.name || ''}
                                    onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'white' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Price (R)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={currentProduct.basePrice || 0}
                                        onChange={e => setCurrentProduct({ ...currentProduct, basePrice: parseFloat(e.target.value) })}
                                        style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Stock</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={currentProduct.stock || 0}
                                        onChange={e => setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) })}
                                        style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'white' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Category</label>
                                    <input
                                        type="text"
                                        required
                                        value={currentProduct.category || ''}
                                        onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Brand</label>
                                    <input
                                        type="text"
                                        required
                                        value={currentProduct.brand || ''}
                                        onChange={e => setCurrentProduct({ ...currentProduct, brand: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'white' }}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                style={{
                                    padding: '1rem',
                                    background: 'var(--color-gold)',
                                    color: 'black',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    borderRadius: '4px',
                                    marginTop: '1rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Save Product
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {selectedOrder && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100,
                    display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        background: '#1a1a1a', border: '1px solid var(--glass-border)', borderRadius: '12px',
                        padding: '2rem', width: '100%', maxWidth: '600px', position: 'relative', maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <button
                            onClick={() => setSelectedOrder(null)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Order Details</h2>
                                <span style={{ fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>#{selectedOrder.id}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                    {new Date(selectedOrder.created_at).toLocaleString()}
                                </div>
                                <select 
                                    value={selectedOrder.status}
                                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                                    style={{
                                        marginTop: '0.5rem',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--glass-border)',
                                        color: selectedOrder.status === 'paid' ? '#34d399' : 
                                               selectedOrder.status === 'shipped' ? '#3b82f6' : 
                                               selectedOrder.status === 'delivered' ? '#10b981' : '#fbbf24',
                                        textTransform: 'capitalize',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="pending" style={{ color: 'black' }}>Pending</option>
                                    <option value="paid" style={{ color: 'black' }}>Paid</option>
                                    <option value="shipped" style={{ color: 'black' }}>Shipped</option>
                                    <option value="delivered" style={{ color: 'black' }}>Delivered</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Users size={18} /> Customer & Shipping
                            </h3>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
                                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{selectedOrder.shipping_address?.full_name || 'Guest'}</p>
                                <p style={{ color: 'var(--color-text-muted)' }}>{selectedOrder.shipping_address?.line1}</p>
                                <p style={{ color: 'var(--color-text-muted)' }}>{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.postal_code}</p>
                                <p style={{ color: 'var(--color-text-muted)' }}>{selectedOrder.shipping_address?.country}</p>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Package size={18} /> Order Items
                            </h3>
                            <div style={{ border: '1px solid var(--glass-border)', borderRadius: '8px', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                                        <tr>
                                            <th style={{ padding: '0.8rem', textAlign: 'left', fontSize: '0.9rem' }}>Product</th>
                                            <th style={{ padding: '0.8rem', textAlign: 'right', fontSize: '0.9rem' }}>Qty</th>
                                            <th style={{ padding: '0.8rem', textAlign: 'right', fontSize: '0.9rem' }}>Price</th>
                                            <th style={{ padding: '0.8rem', textAlign: 'right', fontSize: '0.9rem' }}>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.order_items?.map((item: any) => (
                                            <tr key={item.id} style={{ borderTop: '1px solid var(--glass-border)' }}>
                                                <td style={{ padding: '0.8rem' }}>{item.product?.name || item.products?.name || 'Unknown Product'}</td>
                                                <td style={{ padding: '0.8rem', textAlign: 'right' }}>{item.quantity}</td>
                                                <td style={{ padding: '0.8rem', textAlign: 'right' }}>R {Number(item.price_at_purchase).toFixed(2)}</td>
                                                <td style={{ padding: '0.8rem', textAlign: 'right' }}>R {(Number(item.price_at_purchase) * item.quantity).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot style={{ background: 'rgba(255,255,255,0.05)', fontWeight: 'bold' }}>
                                        <tr>
                                            <td colSpan={3} style={{ padding: '0.8rem', textAlign: 'right' }}>Total Amount</td>
                                            <td style={{ padding: '0.8rem', textAlign: 'right', color: 'var(--color-gold)' }}>R {Number(selectedOrder.total_amount).toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, trend: string }> = ({ icon, label, value, trend }) => (
    <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--glass-border)',
        padding: '1.5rem',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    }}>
        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}>
            {icon}
        </div>
        <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{label}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</h3>
                <span style={{ fontSize: '0.8rem', color: '#10b981' }}>{trend}</span>
            </div>
        </div>
    </div>
);

const StatusItem: React.FC<{ label: string, status: string, color?: string }> = ({ label, status, color = '#10b981' }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
        <span style={{ color: color === 'var(--color-text-muted)' ? color : '#10b981', fontWeight: 500 }}>{status}</span>
    </div>
);

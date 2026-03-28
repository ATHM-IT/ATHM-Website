import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductList } from './components/ProductList';
import { Navbar } from './components/Navbar';
import { ThemeCustomizer } from './components/ThemeCustomizer';
import { CartProvider } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetail } from './components/ProductDetail';
import { EditorProvider } from './context/EditorContext';
import { EditorOverlay } from './components/EditorOverlay';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/Footer';
import { CategoryNav } from './components/CategoryNav';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { Wishlist } from './pages/Wishlist';
import { AdminDashboard } from './pages/AdminDashboard';
import { Solutions } from './pages/Solutions';
import { AboutUs } from './pages/AboutUs';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { BrandPage } from './pages/BrandPage';

const Hero = () => (
  <section style={{
    position: 'relative',
    height: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    overflow: 'hidden',
    padding: '0 2rem'
  }}>
    {/* Background Image with Overlay */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(2, 2, 5, 0.3), rgba(2, 2, 5, 1))', // Fade to black at bottom
        zIndex: 1
      }} />
      <img
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
        alt="Future Tech Background"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.6 // Blend with dark background
        }}
      />
    </div>

    <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px' }}>
      <h1 style={{
        fontSize: 'clamp(3rem, 5vw, 5rem)', // Responsive font size
        fontWeight: 700,
        marginBottom: '1.5rem',
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
        background: 'linear-gradient(to right, #fff 20%, var(--color-gold) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.2))'
      }}>
        Future Tech. <span style={{ color: 'var(--color-gold)' }}>Now.</span>
      </h1>
      <p style={{
        fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
        color: 'var(--color-text-muted)',
        marginBottom: '2.5rem',
        lineHeight: 1.6,
        fontWeight: 300
      }}>
        Premium IT solutions with high-performance hardware and next-gen software.
        <br />Experience the difference of true quality.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button style={{
          padding: '1rem 2.5rem',
          background: 'var(--color-gold)',
          color: 'black',
          fontSize: '1rem',
          fontWeight: 600,
          borderRadius: '4px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          boxShadow: 'var(--shadow-gold)',
          transition: 'all 0.3s ease',
          border: '1px solid var(--color-gold)',
          cursor: 'pointer'
        }}
          onClick={() => {
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 0 30px var(--color-gold-glow)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-gold)';
          }}
        >
          Explore Collection
        </button>
        <button style={{
          padding: '1rem 2.5rem',
          background: 'rgba(255, 255, 255, 0.05)',
          color: 'white',
          fontSize: '1rem',
          fontWeight: 600,
          borderRadius: '4px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease'
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          Our Services
        </button>
      </div>
    </div>
  </section>
);

const AnimatedSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div ref={ref} className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}>
      {children}
    </div>
  );
};

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSelectCategory = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <EditorProvider>
          <Router>
            <div className="App">
              <Navbar />
              <ThemeCustomizer />
              <CartDrawer />
              <EditorOverlay />
              <Routes>
                <Route path="/" element={
                  <>
                    <Hero />
                    <CategoryNav 
                        onSelectCategory={handleSelectCategory} 
                    />
                    <AnimatedSection>
                      <FeaturesSection />
                    </AnimatedSection>
                    <AnimatedSection>
                      <ProductList selectedCategory={selectedCategory} />
                    </AnimatedSection>
                    <Footer />
                  </>
                } />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/brand/:brandName" element={<BrandPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/solutions" element={<Solutions />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
              </Routes>
            </div>
          </Router>
        </EditorProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

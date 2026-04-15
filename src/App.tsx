import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import { MobileBottomNav } from './components/MobileBottomNav';
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
import { SharedBuild } from './pages/SharedBuild';
import { FAQ } from './pages/FAQ';
import { Support } from './pages/Support';
import { LegalPage } from './pages/LegalPage';

const Hero = () => {
  const heroImage = '/athm_hero_background_1775248093895.png';
  
  return (
    <section style={{
      position: 'relative',
      height: '90vh',
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
          background: 'radial-gradient(circle at center, rgba(2, 2, 5, 0.4) 0%, rgba(2, 2, 5, 1) 100%)',
          zIndex: 1
        }} />
        <img
          src={heroImage}
          alt="ATHM Future Tech"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.8
          }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ position: 'relative', zIndex: 10, maxWidth: '900px' }}
      >
        <span style={{ 
          color: 'var(--color-gold)', 
          textTransform: 'uppercase', 
          letterSpacing: '5px', 
          fontSize: '0.9rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
          display: 'block'
        }}>
          Technological Excellence
        </span>
        <h1 style={{
          fontSize: 'clamp(3.5rem, 6vw, 6rem)',
          fontWeight: 800,
          marginBottom: '1.5rem',
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: 'white'
        }}>
          Future Tech. <span style={{ 
            background: 'linear-gradient(to right, #fff, var(--color-gold))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.3))'
          }}>Now.</span>
        </h1>
        <p style={{
          fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
          color: 'rgba(255,255,255,0.7)',
          marginBottom: '3rem',
          lineHeight: 1.6,
          fontWeight: 300,
          maxWidth: '800px',
          margin: '0 auto 3rem'
        }}>
          Leading South Africa's hardware revolution with high-performance infrastructure, 
          tier-1 global components, and uncompromising IT expertise.
        </p>
        <div className="hero-buttons-wrapper" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <button style={{
            padding: '1.2rem 3rem',
            background: 'var(--color-gold)',
            color: 'black',
            fontSize: '1.1rem',
            fontWeight: 700,
            borderRadius: '8px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            boxShadow: 'var(--shadow-gold)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            border: 'none',
            cursor: 'pointer'
          }}
            onClick={() => {
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(212, 175, 55, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-gold)';
            }}
          >
            Browse Products
          </button>
          <button 
            onClick={() => window.location.href = '/solutions'}
            style={{
              padding: '1.2rem 3rem',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: '8px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Our Solutions
          </button>
        </div>
      </motion.div>
    </section>
  );
};

const AnimatedSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div ref={ref} className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}>
      {children}
    </div>
  );
};

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'var(--color-gold)',
        color: 'black',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
        zIndex: 1000
      }}
      whileHover={{ scale: 1.1, background: 'white' }}
      whileTap={{ scale: 0.9 }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 15-6-6-6 6"/>
      </svg>
    </motion.button>
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
              <ScrollToTop />
              <MobileBottomNav />
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
                <Route path="/build" element={<SharedBuild />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/support" element={<Support />} />
                <Route path="/legal/:slug" element={<LegalPage />} />
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

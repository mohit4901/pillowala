import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import IamNavbar from './components/layout/IamNavbar';
import SidewalkFooter from './components/layout/SidewalkFooter';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CategoryPage from './pages/CategoryPage';
import OffersPage from './pages/OffersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ReviewPage from './pages/ReviewPage';
import ReviewSuccessPage from './pages/ReviewSuccessPage';
import LuckyDrawPage from './pages/LuckyDrawPage';
import ServerWarmupIndicator from './components/common/ServerWarmupIndicator';

function AppContent() {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen bg-white text-stone-900 font-sans selection:bg-black selection:text-white">
      <IamNavbar />
      <ServerWarmupIndicator />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/lucky-draw" element={<LuckyDrawPage />} />
          <Route path="/giveaway" element={<LuckyDrawPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/review/success" element={<ReviewSuccessPage />} />
          {/* Catch all fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <SidewalkFooter />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

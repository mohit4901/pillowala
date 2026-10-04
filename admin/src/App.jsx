import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminSidebar from './components/layout/AdminSidebar';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ReviewsPage from './pages/ReviewsPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import OffersPage from './pages/OffersPage';
import LuckyDrawPage from './pages/LuckyDrawPage';
import { getReviewStats } from './services/api';

// Protected Route Component
function ProtectedLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      getReviewStats()
        .then((res) => setPendingCount(res.data?.pendingReviews || 0))
        .catch((err) => console.error(err));
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center text-amber-500">
        <div className="w-8 h-8 rounded-full border-3 border-amber-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar pendingCount={pendingCount} />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <DashboardPage />
          </ProtectedLayout>
        }
      />

      <Route
        path="/reviews"
        element={
          <ProtectedLayout>
            <ReviewsPage />
          </ProtectedLayout>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedLayout>
            <ProductsPage />
          </ProtectedLayout>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedLayout>
            <CategoriesPage />
          </ProtectedLayout>
        }
      />

      <Route
        path="/offers"
        element={
          <ProtectedLayout>
            <OffersPage />
          </ProtectedLayout>
        }
      />

      <Route
        path="/luckydraw"
        element={
          <ProtectedLayout>
            <LuckyDrawPage />
          </ProtectedLayout>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

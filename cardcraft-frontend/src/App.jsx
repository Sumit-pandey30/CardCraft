import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// 13 Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MyCardsPage from './pages/MyCardsPage';
import CreateCardPage from './pages/CreateCardPage';
import EditCardPage from './pages/EditCardPage';
import TemplatesPage from './pages/TemplatesPage';
import CardPreviewPage from './pages/CardPreviewPage';
import PublicCardPage from './pages/PublicCardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

export function App() {
  return (
    <Routes>
      {/* 1. Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* 2. Login Page */}
      <Route path="/login" element={<LoginPage />} />

      {/* 3. Register Page */}
      <Route path="/register" element={<RegisterPage />} />

      {/* 4. User Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* 5. My Cards */}
      <Route
        path="/cards"
        element={
          <ProtectedRoute>
            <MyCardsPage />
          </ProtectedRoute>
        }
      />

      {/* 6. Create Card */}
      <Route
        path="/cards/create"
        element={
          <ProtectedRoute>
            <CreateCardPage />
          </ProtectedRoute>
        }
      />

      {/* 7. Edit Card */}
      <Route
        path="/cards/:id/edit"
        element={
          <ProtectedRoute>
            <EditCardPage />
          </ProtectedRoute>
        }
      />

      {/* 8. Card Templates */}
      <Route path="/templates" element={<TemplatesPage />} />

      {/* 9. Live Card Preview */}
      <Route
        path="/cards/:id/preview"
        element={
          <ProtectedRoute>
            <CardPreviewPage />
          </ProtectedRoute>
        }
      />

      {/* 10. Public Digital Card (Primary & Alias) */}
      <Route path="/c/:slug" element={<PublicCardPage />} />
      <Route path="/cards/p/:slug" element={<PublicCardPage />} />

      {/* 11. Analytics Dashboard */}
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />

      {/* 12. User Profile and Settings */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* 13. 404 Not Found Page */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

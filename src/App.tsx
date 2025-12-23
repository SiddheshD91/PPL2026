import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import PlayerRegistration from './components/PlayerRegistration/PlayerRegistration';
import AdminLogin from './components/AdminLogin/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import PlayerDetailPage from './components/PlayerDetailPage/PlayerDetailPage';
import CategoryDetailPage from './components/CategoryDetailPage/CategoryDetailPage';
import PlayerEditPage from './components/PlayerEditPage/PlayerEditPage';
import './App.css';

// Handle GitHub Pages SPA routing
function RedirectHandler() {
  const location = useLocation();
  
  useEffect(() => {
    // Check if we're in the GitHub Pages SPA redirect format
    if (location.search.includes('?/')) {
      const path = location.search.replace('?/', '').replace(/~and~/g, '&').split('&')[0];
      if (path && path !== location.pathname) {
        window.history.replaceState(null, '', path);
      }
    }
  }, [location]);
  
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <RedirectHandler />
      <Routes>
        <Route path="/" element={<PlayerRegistration />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/players/:playerId"
          element={
            <ProtectedRoute>
              <PlayerDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/players/:playerId/edit"
          element={
            <ProtectedRoute>
              <PlayerEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories/:categoryId"
          element={
            <ProtectedRoute>
              <CategoryDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <div className="created-by-badge">
        Built by Siddhesh Dhole
      </div>
    </BrowserRouter>
  );
}

export default App;

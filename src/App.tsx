import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if we're in the GitHub Pages SPA redirect format (?/path format)
    // This happens when 404.html redirects a missing route to index.html
    if (location.search.includes('?/')) {
      const path = location.search.replace('?/', '').replace(/~and~/g, '&').split('&')[0];
      // Remove leading slash if present (React Router handles it)
      const cleanPath = path.startsWith('/') ? path : '/' + path;
      
      // Only redirect if path exists and is different from current pathname
      if (cleanPath && cleanPath !== location.pathname) {
        // Use React Router's navigate to properly handle basename
        navigate(cleanPath, { replace: true });
      }
    }
  }, [location, navigate]);
  
  return null;
}

function App() {
  // Detect if we're on GitHub Pages (production) or local dev
  const basename = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? '/' 
    : '/PPL2026';
  
  return (
    <BrowserRouter basename={basename}>
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

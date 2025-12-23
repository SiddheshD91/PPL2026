import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PlayerRegistration from './components/PlayerRegistration/PlayerRegistration';
import AdminLogin from './components/AdminLogin/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import PlayerDetailPage from './components/PlayerDetailPage/PlayerDetailPage';
import CategoryDetailPage from './components/CategoryDetailPage/CategoryDetailPage';
import PlayerEditPage from './components/PlayerEditPage/PlayerEditPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;

import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';
import Login from './components/Login'; 
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ProjectDetail from './components/ProjectDetail';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div className="auth-loading">Validating artist token...</div>;
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const { user, logout } = useAuth();

  return (
    <>
      <header className="app-header">
        <h2 className="app-header__title">
          <Link to="/" className="app-header__logo-link">The Artist Diary</Link>
        </h2>
        <nav className="app-header__nav">
          <Link to="/" className="app-header__nav-link">Dashboard</Link>
          {user ? (
            <button onClick={logout} className="counter app-header__logout-btn">
              Logout ({user.username})
            </button>
          ) : (
            <>
              <Link to="/login" className="app-header__nav-link">Login</Link>
              <Link to="/signup" className="app-header__nav-link">Signup</Link>
            </>
          )}
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" replace />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/projects/:id" element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}
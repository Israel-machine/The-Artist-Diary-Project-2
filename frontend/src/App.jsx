import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';

// Component layout bindings
import Login from './components/Login'; // If you want to keep Login separated or inline
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ProjectDetail from './components/ProjectDetail';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const { user, logout } = useAuth();

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ margin: 0 }}><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>🎨 The Artist Diary</Link></h2>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/" style={{ color: 'var(--text-h)', textDecoration: 'none' }}>Dashboard</Link>
          {user ? (
            <button onClick={logout} className="counter" style={{ margin: 0, cursor: 'pointer' }}>
              Logout ({user.username})
            </button>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-h)', textDecoration: 'none' }}>Login</Link>
              <Link to="/signup" style={{ color: 'var(--text-h)', textDecoration: 'none' }}>Signup</Link>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/login" element={!user ? <LoginView /> : <Navigate to="/" replace />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" replace />} />
        
        {/* Protected Operational Pathways */}
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

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}

import { useState } from 'react';
export default App;
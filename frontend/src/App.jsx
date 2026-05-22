import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';

// Component operational bindings
import Login from './components/Login'; 
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ProjectDetail from './components/ProjectDetail';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>Loading session...</div>;
  }
  
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const { user, logout, loading } = useAuth();

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ margin: 0 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>🎨 The Artist Diary</Link>
        </h2>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/" style={{ color: 'var(--text-h)', textDecoration: 'none' }}>Dashboard</Link>
          {user ? (
            <button onClick={logout} className="counter" style={{ margin: 0, cursor: 'pointer' }}>
              Logout ({user.username})
            </button>
          ) : (
            !loading && (
              <>
                <Link to="/login" style={{ color: 'var(--text-h)', textDecoration: 'none' }}>Login</Link>
                <Link to="/signup" style={{ color: 'var(--text-h)', textDecoration: 'none' }}>Signup</Link>
              </>
            )
          )}
        </nav>
      </header>

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
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
      </main>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}
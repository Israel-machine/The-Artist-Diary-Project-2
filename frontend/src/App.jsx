import { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';

const Dashboard = () => (
  <section style={{ padding: '20px' }}>
    <h2>Your Projects Dashboard</h2>
    <p>Protected resource panels will display here.</p>
  </section>
);

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await login(username, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section id="center" style={{ padding: '40px max(20px, calc(50% - 200px))' }}>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--code-bg)', color: 'var(--text-h)' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--code-bg)', color: 'var(--text-h)' }}
        />
        <button type="submit" className="counter" style={{ width: '100%', justifyContent: 'center', cursor: 'pointer' }}>
          Login
        </button>
        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
      </form>
    </section>
  );
};

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const { user, logout } = useAuth();

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ margin: 0 }}>The Artist Diary</h2>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/" style={{ color: 'var(--text-h)', textDecoration: 'none' }}>Dashboard</Link>
          {user ? (
            <button onClick={logout} className="counter" style={{ margin: 0, cursor: 'pointer' }}>
              Logout ({user.username})
            </button>
          ) : (
            <Link to="/login" style={{ color: 'var(--text-h)', textDecoration: 'none' }}>Login</Link>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}

export default App;
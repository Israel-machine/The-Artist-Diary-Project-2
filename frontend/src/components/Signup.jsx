import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(username, password);
      navigate('/login'); // Redirect to log in with new credentials
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div id="center" style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
        {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}
        <input 
          type="text" 
          placeholder="Choose Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)' }}
        />
        <input 
          type="password" 
          placeholder="Choose Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)' }}
        />
        <button type="submit" className="counter" style={{ width: '100%', cursor: 'pointer' }}>Register Space</button>
      </form>
      <p style={{ fontSize: '14px' }}>
        Already registered? <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in here</Link>
      </p>
    </div>
  );
}
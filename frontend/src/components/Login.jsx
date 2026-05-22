import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    }
  };

  return (
    <div id="center" style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
        {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)' }}
        />
        <button type="submit" className="counter" style={{ width: '100%', cursor: 'pointer', display: 'justify-content' }}>Enter Diary</button>
      </form>
      <p style={{ fontSize: '14px' }}>
        New artist? <Link to="/signup" style={{ color: 'var(--accent)' }}>Create an account</Link>
      </p>
    </div>
  );
}
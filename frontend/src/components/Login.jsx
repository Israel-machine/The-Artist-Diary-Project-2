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
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--code-bg)', color: 'var(--text-h)' }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--code-bg)', color: 'var(--text-h)' }} />
        <button type="submit" className="counter" style={{ width: '100%', justifyContent: 'center', cursor: 'pointer' }}>Login</button>
        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
        <p style={{ fontSize: '14px' }}>New artisan? <Link to="/signup" style={{ color: 'var(--accent)' }}>Register Here</Link></p>
      </form>
    </section>
  );
}
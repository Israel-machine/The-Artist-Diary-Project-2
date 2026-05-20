import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await signup(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section id="center" style={{ padding: '40px max(20px, calc(50% - 200px))' }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <input 
          type="text" 
          placeholder="Choose Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--code-bg)', color: 'var(--text-h)' }}
        />
        <input 
          type="password" 
          placeholder="Choose Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--code-bg)', color: 'var(--text-h)' }}
        />
        <button type="submit" className="counter" style={{ width: '100%', justifyContent: 'center', cursor: 'pointer' }}>
          Register & Log In
        </button>
        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
        <p style={{ fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Sign In</Link>
        </p>
      </form>
    </section>
  );
}
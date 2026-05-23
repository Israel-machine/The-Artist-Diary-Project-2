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
    <div id="center" className="auth-page">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-form__error">{error}</div>}
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)}
          required
          className="auth-form__input"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)}
          required
          className="auth-form__input"
        />
        <button type="submit" className="counter auth-form__submit">Enter Diary</button>
      </form>
      <p className="auth-form__footer-text">
        New artist? <Link to="/signup" className="auth-form__footer-link">Create an account</Link>
      </p>
    </div>
  );
}
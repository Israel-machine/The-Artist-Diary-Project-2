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
      navigate('/login'); 
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div id="center" className="auth-page">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-form__error">{error}</div>}
        <input 
          type="text" 
          placeholder="Choose Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)}
          required
          className="auth-form__input"
        />
        <input 
          type="password" 
          placeholder="Choose Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)}
          required
          className="auth-form__input"
        />
        <button type="submit" className="counter auth-form__submit">Register Space</button>
      </form>
      <p className="auth-form__footer-text">
        Already registered? <Link to="/login" className="auth-form__footer-link">Sign in here</Link>
      </p>
    </div>
  );
}
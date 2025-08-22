import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './LoginPage.css'; // Import the dedicated CSS for styling

const LoginPage = () => {
  // State for the form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for handling loading and error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the login function from our AuthContext
  const { login } = useAuth();
  
  // Hooks from React Router for navigation
  const navigate = useNavigate();
  const location = useLocation();

  // Determine where to redirect the user after a successful login.
  // It checks if we were sent here from a protected route. If so, it will
  // redirect back to that route. Otherwise, it defaults to '/dashboard'.
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      // On successful login, navigate to the intended page
      navigate(from, { replace: true });
    } catch (err) {
      // If the API call fails, display an error message
      const errorMessage = err.response?.data?.msg || 'Failed to log in. Please check your credentials.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login to KalaKosha</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading} // Disable input while loading
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading} // Disable input while loading
            />
          </div>
          
          {error && <p className="login-error">{error}</p>}

          <div className="login-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </form>
        <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'underline' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './styles/Auth.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
      // In dev, we might show the token for testing if returned
      if (response.data.resetToken) {
        console.log('Reset Token (Dev only):', response.data.resetToken);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <img src="/logo.png" alt="CarTinder" style={{ width: '48px', height: '48px', margin: '0 auto 1rem', display: 'block', objectFit: 'contain' }} />
        <button className="back-btn-inline" onClick={() => navigate('/login')} style={{ alignSelf: 'flex-start', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          &larr; Back to Login
        </button>
        <h1>Reset Password</h1>
        <p>Enter your email to receive a reset link</p>
        
        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success" style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}
        
        {!message ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="Enter your email"
              />
            </div>
            
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <button className="auth-btn" onClick={() => navigate('/login')}>
            Return to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

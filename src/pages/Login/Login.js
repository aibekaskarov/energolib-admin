import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== 'admin') {
        setError('Доступ только для администраторов.');
        return;
      }
      navigate('/');
    } catch {
      setError('Неверный email или пароль.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{
        background: '#1a1a2e',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 40,
        width: 380,
      }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{
            fontSize: 24, fontWeight: 800,
            background: 'linear-gradient(135deg, #fff 0%, #00d9ff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>EnergoLib</div>
          <div style={{ fontSize: 13, color: '#6a6a8a', marginTop: 4 }}>Admin Panel</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: '#9090a0', display: 'block', marginBottom: 6 }}>Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              placeholder="admin@example.com"
              style={{
                width: '100%', padding: '10px 14px', background: '#0f0f1a',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                color: '#e0e0e0', fontSize: 14, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#9090a0', display: 'block', marginBottom: 6 }}>Пароль</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{
                width: '100%', padding: '10px 14px', background: '#0f0f1a',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                color: '#e0e0e0', fontSize: 14, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {error && <div style={{ color: '#ff6b6b', fontSize: 13 }}>{error}</div>}

          <button type="submit" disabled={loading} style={{
            padding: '12px', background: 'linear-gradient(135deg, #00d9ff 0%, #0099cc 100%)',
            color: '#0f0f1a', border: 'none', borderRadius: 8, fontSize: 14,
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, marginTop: 8,
          }}>
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

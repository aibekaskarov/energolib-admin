import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSuccess = async (credentialResponse) => {
    setError('');
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate('/');
    } catch (err) {
      if (err.message === 'not_admin') {
        setError('Доступ только для администраторов.');
      } else {
        setError('Ошибка входа через Google.');
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{
        background: '#1a1a2e',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: 40, width: 380,
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

        {error && (
          <div style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setError('Ошибка входа через Google.')}
            theme="filled_black"
            size="large"
            width="300"
            text="signin_with"
            locale="ru"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

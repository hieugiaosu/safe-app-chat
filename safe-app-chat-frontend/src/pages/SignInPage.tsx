import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useUser } from '../context/UserContext';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.accessToken) {
      navigate('/chat');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { accessToken, user } = response.data;
      setUser(user);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('tokenExpiry', (Date.now() + 3600000).toString()); // 1 hour from now
      navigate('/chat');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center bg-light">
      <div className="container text-center">
        <h1 className="display-4 fw-bold text-primary mb-4">Sign In</h1>
        <form onSubmit={handleSignIn} className="w-100" style={{ maxWidth: '400px', margin: '0 auto' }}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Sign In</button>
        </form>
        <p className="mt-3">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
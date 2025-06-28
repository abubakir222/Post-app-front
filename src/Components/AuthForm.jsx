import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, login } from '../api/authRequest';
import "../Components/AuthForm.css";

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    surname: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let response;
      if (isSignup) {
        response = await register(formData);
      } else {
        response = await login({ email: formData.email, password: formData.password });
        console.log(response);
        
      }
      const data = response.data;

      if (data && data.token && data.userId && data.user && typeof data.user.role !== 'undefined') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId.toString());
        localStorage.setItem('role', data.user.role.toString());

        toast.success(isSignup ? 'Signup Success' : 'Login Success', {
          position: "top-right",
          autoClose: 2000,
        });
        navigate('/home', { replace: true });
      } else {
        setError(data?.message || 'Serverdan noto‘g‘ri javob keldi');
        toast.error(isSignup ? 'Signup Denied' : 'Login Denied', {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || error.message || 'Server bilan ulanishda xatolik');
      toast.error(isSignup ? 'Signup Denied' : 'Login Denied', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && token !== 'null' && userId && userId !== 'null') {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2 className="auth-title">{isSignup ? 'Signup' : 'Login'}</h2>
          {error && <p className="auth-error">{error}</p>}
          {isSignup && (
            <>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="auth-input"
                autoComplete="username"
              />
              <input
                type="text"
                name="surname"
                placeholder="Surname"
                value={formData.surname}
                onChange={handleChange}
                required
                className="auth-input"
                autoComplete="family-name"
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="auth-input"
            autoComplete="email"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            className="auth-input"
            autoComplete={isSignup ? "new-password" : "current-password"}
          />
          <button type="submit" className="auth-btn">
            {isSignup ? 'Signup' : 'Login'}
          </button>
          <p className="auth-switch-text">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              className="auth-switch-link"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? 'Login' : 'Signup'}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
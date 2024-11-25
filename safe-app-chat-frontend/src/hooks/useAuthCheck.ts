import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import axiosInstance from '../api/axiosInstance';
import { useUser } from '../context/UserContext';

const useAuthCheck = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      const accessToken = localStorage.getItem('accessToken');
      if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenExpiry');
        setUser(null);
        navigate('/');
        return;
      }

      if (accessToken) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      }

      try {
        const response = await axiosInstance.get('/users/me');
        setUser(response.data);
        navigate('/chat');
      } catch (error) {
        if (isAxiosError(error) && error.response && error.response.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('tokenExpiry');
          setUser(null);
          navigate('/');
        }
      }
    };

    if (user && user.accessToken) {
      checkAuth();
    } else {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        checkAuth();
      } else {
        navigate('/signin');
      }
    }
  }, [user, setUser, navigate]);
};

export default useAuthCheck;
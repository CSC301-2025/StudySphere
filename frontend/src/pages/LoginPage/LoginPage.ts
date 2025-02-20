// src/pages/LoginPage/LoginPage.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Example: you'd have an actual API call. We’ll stub it here.
async function fakeLoginAPI(payload: Record<string, string>) {
  // Simulate server call
  console.log('Submitted to server:', payload);
  const { username, password } = payload;

  // Pretend "admin/admin" is valid:
  if (username === 'admin' && password === 'admin') {
    // Return a fake token
    return { token: 'FAKE_TOKEN_123' };
  } else {
    throw new Error('Invalid credentials');
  }
}

/** 
 * Custom hook for managing the login flow
 */
export function useLoginPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  // Called when the user submits the form
  async function handleSubmit(payload: Record<string, string>) {
    try {
      // In a real app, call your actual backend with fetch/axios:
      // const response = await axios.post('/api/auth/login', payload);
      // const data = response.data;
      // For demonstration, we'll use a fakeLoginAPI:
      const data = await fakeLoginAPI(payload);

      // If successful, store the token
      localStorage.setItem('authToken', data.token);

      // Navigate to a protected route, e.g. "/dashboard"
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setErrorMessage('Invalid username or password.');
    }
  }

  return {
    errorMessage,
    handleSubmit,
  };
}

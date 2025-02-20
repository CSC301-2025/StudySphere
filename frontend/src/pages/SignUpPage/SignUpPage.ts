import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function useSignUpPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Called when the user submits the sign-up form.
   * `payload` is an object with keys matching each input's "name" attribute.
   * For example: { first_name: '...', last_name: '...', email: '...', ... }
   */
  async function handleSignUp(payload: Record<string, string>) {
    try {
      // Replace with your actual backend signup endpoint:
      const response = await axios.post('http://localhost:8080/api/auth/signup', payload);

      // If signup is successful, you might redirect the user:
      navigate('/login'); // or /dashboard, etc.
    } catch (err) {
      console.error(err);
      setErrorMessage('Sign-up failed. Please try again.');
    }
  }

  return {
    errorMessage,
    handleSignUp,
  };
}

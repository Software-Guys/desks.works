import { useState, useEffect } from 'react';

const fetcher = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, { ...options });
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || 'Request failed');
  }
  return response.json();
};

export function useAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      setLoading(false); // Reset loading state on unmount
    };
  }, []);

  const login = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      setLoading(false);
      return result;
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Login failed. Please try again.');
      throw err;
    }
  };

  const register = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      setLoading(false);
      return result;
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Registration failed. Please try again.');
      throw err;
    }
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Handle successful registration (e.g., redirect to login page)
        console.log('Registration successful:', data);
      } else {
        // Handle registration error
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return { email, password, setEmail, setPassword, login, register, loading, error };
}
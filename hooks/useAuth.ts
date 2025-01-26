import { useState } from 'react';
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

  const login = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      setLoading(false);
      return result;
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
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
        body: JSON.stringify({ email, password })
      });
      setLoading(false);
      return result;
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  return { email, password, setEmail, setPassword, login, register, loading, error };
}
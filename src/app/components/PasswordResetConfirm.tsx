'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';  // Usar 'next/navigation' en lugar de 'next/router'

const PasswordResetConfirm = () => {
  const [token, setToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !newPassword) {
      setError('Both token and new password are required');
      return;
    }

    try {
      // Realizar la solicitud para cambiar la contraseña
      const response = await fetch('/api/password-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      if (response.ok) {
        // Redirigir al usuario a la página de login
        router.push('/login');
      } else {
        const data = await response.json();
        setError(data.detail || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to change password');
    }
  };

  return (
    <div>
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="token">Reset Token</label>
          <input
            id="token"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div>
          <button type="submit">Change Password</button>
        </div>
      </form>
    </div>
  );
};

export default PasswordResetConfirm;

'use client'; // Asegúrate de que este componente sea un cliente

import React, { useState } from 'react';

const PasswordResetRequest: React.FC = () => {
    const [email, setEmail] = useState<string>('');

    const getCSRFToken = (): string | null => {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return decodeURIComponent(value);
            }
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const csrftoken = getCSRFToken();
        if (!csrftoken) {
            alert('CSRF token not found');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/password_reset/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({ email }),
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Failed to send password reset request');
            alert('Password reset email sent!');
        } catch (error) {
            console.error(error);
            alert('An error occurred.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
            />
            <button type="submit">Send Reset Email</button>
        </form>
    );
};

export default PasswordResetRequest;

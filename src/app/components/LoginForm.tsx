'use client';  // Asegúrate de que esto se ejecute en el lado del cliente

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginForm: React.FC = () => {
  const router = useRouter();  // Usando useRouter de next/navigation
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Realiza la solicitud al backend para autenticar al usuario
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { access, user_type, user_data } = data;  // Desestructurando los valores del response

        // Guardar el token de acceso y los datos del usuario en localStorage
        localStorage.setItem('access_token', access);
        localStorage.setItem('user_type', user_type);  // Guardar el rol del usuario
        localStorage.setItem('user_data', JSON.stringify(user_data));  // Guardar los datos del usuario

        // Redirigir según el tipo de usuario
        if (user_type === 'admin') {
          router.push('/Administrador');  // Redirigir al administrador
        } else {
          router.push('/Usuario');  // Redirigir al usuario regular
        }
      } else {
        setErrorMessage('Credenciales incorrectas');  // Mostrar mensaje de error
      }
    } catch (error) {
      console.error('Login failed', error);
      setErrorMessage('Error en la conexión con el servidor');  // Mostrar error si no se puede conectar
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      
      {/* Mostrar mensaje de error si lo hay */}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default LoginForm;

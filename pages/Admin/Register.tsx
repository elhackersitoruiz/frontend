"use client"; // Asegúrate de que esto sea necesario para tu versión de Next.js

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../src/app/components/protected-route';


const RegistroUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    telefono: '',
    direccion: '',
    dni: '',
    password: '',
    is_staff: false, // Inicialmente, el usuario no es administrador
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Variable para mostrar mensaje de éxito

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value, // Maneja el cambio para el checkbox de is_staff
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validación del correo electrónico para que solo sea válido si termina en '@gmail.com'
    if (!formData.email.endsWith('@gmail.com')) {
      setError('El correo electrónico debe ser de tipo @gmail.com');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const result = await res.json();
        setSuccess('Usuario registrado con éxito');
        console.log('Usuario registrado:', result);
        router.push('/Administrador'); // Redirigir a una página de éxito
      } else {
        const errorResponse = await res.json();
        setError(errorResponse?.message || 'Hubo un problema al registrar el usuario');
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/'); // Redirigir al home o cualquier otra página en caso de cancelar
  };

  return (
    <ProtectedRoute roleRequired="admin"> 


    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-teal-600">Registro de Datos</h1>

      {/* Mensaje de error */}
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>} {/* Mensaje de éxito */}

      <form onSubmit={handleSubmit}>
        {/* Datos del Propietario */}
        <h2 className="text-2xl font-semibold mb-4 text-black">Datos del Propietario</h2>
        <div className="mb-4">
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Apellidos</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI</label>
          <input
            type="text"
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        {/* Datos del Usuario */}
        <h2 className="text-2xl font-semibold mb-4 text-black">Datos de Usuario</h2>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        {/* Campo para is_staff */}
        <div className="mb-4">
          <label htmlFor="is_staff" className="block text-sm font-medium text-gray-700">¿Es Administrador?</label>
          <input
            type="checkbox"
            id="is_staff"
            name="is_staff"
            checked={formData.is_staff}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        {/* Botones de enviar y cancelar */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="ml-4 w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
    </ProtectedRoute>

  );
};

export default RegistroUser;

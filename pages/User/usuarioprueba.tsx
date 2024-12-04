'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../src/app/components/protected-route';

const UsuarioPage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [selectedPetId, setSelectedPetId] = useState<string>(''); // Para manejar la mascota seleccionada

  useEffect(() => {
    const data = localStorage.getItem('user_data');
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  if (!userData) {
    return <p className="text-center text-lg text-gray-500">Cargando...</p>;
  }

  // Manejar la selección de mascota
  const handlePetSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPetId(event.target.value);
  };

  // Filtrar la mascota seleccionada
  const selectedPet = userData.pets.find((pet: any) => pet.id.toString() === selectedPetId);

  return (
    <ProtectedRoute roleRequired="user"> 
      <div className="container mx-auto p-6 bg-gradient-to-r from-blue-50 to-white min-h-screen">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Perfil del Usuario</h1>
        
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <p className="text-xl text-gray-700"><strong>Nombre:</strong> {userData.first_name} {userData.last_name}</p>
          <p className="text-lg text-gray-600"><strong>Email:</strong> {userData.email}</p>
          <p className="text-lg text-gray-600"><strong>Teléfono:</strong> {userData.telefono}</p>
          <p className="text-lg text-gray-600"><strong>Dirección:</strong> {userData.direccion}</p>
          <p className="text-lg text-gray-600"><strong>DNI:</strong> {userData.dni}</p>
        </div>

        {/* Seleccionar mascota */}
        {userData.pets && userData.pets.length > 0 ? (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Selecciona tu mascota:</h2>
            <select 
              value={selectedPetId} 
              onChange={handlePetSelect} 
              className="w-full max-w-xs p-3 border-2 border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona una mascota</option>
              {userData.pets.map((pet: any) => (
                <option key={pet.id} value={pet.id}>
                  {pet.namepet} 
                </option>
              ))}
            </select>

            {/* Mostrar detalles de la mascota seleccionada */}
            {selectedPet && (
              <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Detalles de la mascota: {selectedPet.namepet}</h3>
                <p><strong>Especie:</strong> {selectedPet.especie}</p>
                <p><strong>Raza:</strong> {selectedPet.raza}</p>
                <p><strong>Fecha de Nacimiento:</strong> {selectedPet.fecha_nacimientopet}</p>
                <p><strong>Color:</strong> {selectedPet.color}</p>
                <p><strong>Sexo:</strong> {selectedPet.sexo}</p>

                {/* Vacunas */}
                {selectedPet.vacunas && selectedPet.vacunas.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-700">Vacunas</h3>
                    {selectedPet.vacunas.map((vacuna: any, idx: number) => (
                      <div key={idx} className="bg-blue-50 p-4 mt-2 rounded-lg shadow-md">
                        <p><strong>Tipo:</strong> {vacuna.tipo}</p>
                        <p><strong>Fecha de Vacuna:</strong> {vacuna.fechavacuna}</p>
                        <p><strong>Próxima Vacuna:</strong> {vacuna.fecharevacuna}</p>
                        <p><strong>Descripción:</strong> {vacuna.descripcion}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Desparacitaciones */}
                {selectedPet.desparacitaciones && selectedPet.desparacitaciones.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-700">Desparasitaciones</h3>
                    {selectedPet.desparacitaciones.map((desparacitacion: any, idx: number) => (
                      <div key={idx} className="bg-green-50 p-4 mt-2 rounded-lg shadow-md">
                        <p><strong>Producto:</strong> {desparacitacion.producto}</p>
                        <p><strong>Fecha de Desparacitación:</strong> {desparacitacion.fechadespara}</p>
                        <p><strong>Peso:</strong> {desparacitacion.peso}</p>
                        <p><strong>Próxima Desparacitación:</strong> {desparacitacion.proxima}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Cirugías */}
                {selectedPet.cirugias && selectedPet.cirugias.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-700">Cirugías</h3>
                    {selectedPet.cirugias.map((cirugia: any, idx: number) => (
                      <div key={idx} className="bg-red-50 p-4 mt-2 rounded-lg shadow-md">
                        <p><strong>Tipo:</strong> {cirugia.tipo}</p>
                        <p><strong>Fecha de Cirugía:</strong> {cirugia.fechaciru}</p>
                        <p><strong>Fecha de Retiro:</strong> {cirugia.fechareti}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="mt-6 text-gray-500">No se han registrado mascotas.</p>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default UsuarioPage;

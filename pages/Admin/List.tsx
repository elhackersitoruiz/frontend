import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchUsersWithPets } from "../../src/app/services/auth";
import Swal from "sweetalert2";
import ProtectedRoute from '../../src/app/components/protected-route';
import Image from 'next/image';

export interface Pet {
  id: number;
  namepet: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  telefono: string;
  direccion: string;
  dni: string;
  is_staff: boolean;
  pets: Pet[];
}

const Listuser: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPet, setSelectedPet] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsersWithPets();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const handleAddPet = (userId: number) => {
    localStorage.setItem("ownerId", userId.toString());
    router.push(`/Pet`);
  };

  const handleCarnet = (petId: number) => {
    localStorage.setItem("petId", petId.toString());
    router.push(`/Carnet`);
  };

  const handleDelete = async (dni: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:8000/api/delete_user/${dni}/`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers(users.filter((user) => user.dni !== dni));
        Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
      } else {
        Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Ocurrió un error inesperado.", "error");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredUsuarios = users.filter(
    (usuario) =>
      usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.pets.some((pet) =>
        pet.namepet.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      usuario.dni.includes(searchTerm)
  );

  return (
    <ProtectedRoute roleRequired="admin">
      <div className="container mx-auto px-8 py-10 bg-white rounded-xl shadow-2xl text-black border border-gray-200">
        <h1 className="text-3xl font-bold mb-8 text-center text-teal-600">
          Listado de Usuarios Registrados
        </h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre de propietario, mascota o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-lg text-black">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Nombre del Propietario</th>
                <th className="px-4 py-2 border-b">DNI</th>
                <th className="px-4 py-2 border-b">Teléfono</th>
                <th className="px-4 py-2 border-b">Dirección</th>
                <th className="px-4 py-2 border-b">Nombre de la Mascota</th>
                <th className="px-4 py-2 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.length > 0 ? (
                filteredUsuarios.map((usuario) => (
                  <tr key={usuario.dni}>
                    <td className="px-4 py-2 border-b">
                      {usuario.first_name} {usuario.last_name}
                    </td>
                    <td className="px-4 py-2 border-b">{usuario.dni}</td>
                    <td className="px-4 py-2 border-b">{usuario.telefono}</td>
                    <td className="px-4 py-2 border-b">{usuario.direccion}</td>
                    <td className="px-4 py-2 border-b">
                      {usuario.pets.length > 0 ? (
                        <select
                          onChange={(e) => setSelectedPet(e.target.value)}
                          className="border border-gray-300 rounded-lg bg-white text-black px-4 py-2"
                          value={selectedPet || ""}
                        >
                          <option value="" disabled>
                            Selecciona una mascota
                          </option>
                          {usuario.pets.map((pet) => (
                            <option key={pet.id} value={pet.id.toString()}>
                              {pet.namepet}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span>No tiene mascotas</span>
                      )}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <div className="flex space-x-4">
                        <button
                          className="bg-blue-400 text-white rounded-full p-2 shadow-md hover:bg-blue-500"
                          onClick={() => handleAddPet(usuario.id)}
                        >
                          <Image
                            src="/images/controlar.png"
                            alt="Controlar"
                            width={32}
                            height={32}
                          />
                        </button>
                        {selectedPet && (
                          <button
                            className="bg-green-400 text-white rounded-full p-2 shadow-md hover:bg-green-500"
                            onClick={() => handleCarnet(Number(selectedPet))}
                          >
                            <Image
                              src="/images/Iconos/tarjeta-de-identificacion.png"
                              alt="Carnet"
                              width={32}
                              height={32}
                            />
                          </button>
                        )}
                        <button
                          className="bg-red-400 text-white rounded-full p-2 shadow-md hover:bg-red-500"
                          onClick={() => handleDelete(usuario.dni)}
                        >
                          <Image
                            src="/images/Iconos/basura.png"
                            alt="Eliminar"
                            width={32}
                            height={32}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-2 text-center">
                    No hay usuarios para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Listuser;

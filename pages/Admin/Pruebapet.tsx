import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProtectedRoute from '../../src/app/components/protected-route';


const Pet: React.FC = () => {
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    namepet: "",
    especie: "",
    raza: "",
    fecha_nacimientopet: "",
    color: "",
    sexo: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Obtener el ownerId desde localStorage
    const savedOwnerId = localStorage.getItem("ownerId");
    if (savedOwnerId) {
      setOwnerId(Number(savedOwnerId));
    } else {
      setError("No se ha seleccionado un propietario.");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar que el ownerId está disponible
    if (!ownerId) {
      setError("No se ha seleccionado un propietario.");
      return;
    }

    // Preparar los datos para enviar al servidor
    const petData = {
      ...formData,
      owner: ownerId,
    };

    try {
      const response = await fetch("http://localhost:8000/add-pet/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(petData),
      });

      if (!response.ok) {
        const errorHtml = await response.text();
        console.error("Error en la respuesta del servidor:", errorHtml);
        setError("Hubo un error al registrar la mascota.");
        return;
      }

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      // Limpiar el formulario si la respuesta es exitosa
      setFormData({
        namepet: "",
        especie: "",
        raza: "",
        fecha_nacimientopet: "",
        color: "",
        sexo: "",
      });
      setError(null); // Limpiar el error si es exitoso

    } catch (error) {
      console.error("Error en la solicitud:", error);
      setError("Error en la conexión con el servidor.");
    }
  };

  return (

    <ProtectedRoute roleRequired="admin"> 

    <div className="container mx-auto px-6 py-12">
    <h2 className="text-3xl font-bold mb-8 text-center text-teal-600">Registrar Mascota</h2>
    {error && <p className="text-red-500 mb-4">{error}</p>}
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="namepet" className="block text-sm font-medium text-gray-700">
          Nombre de la Mascota
        </label>
        <input
          type="text"
          id="namepet"
          name="namepet"
          value={formData.namepet}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
  
      <div>
        <label htmlFor="especie" className="block text-sm font-medium">
          Especie
        </label>
        <input
          type="text"
          id="especie"
          name="especie"
          value={formData.especie}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
  
      <div>
        <label htmlFor="raza" className="block text-sm font-medium">
          Raza
        </label>
        <input
          type="text"
          id="raza"
          name="raza"
          value={formData.raza}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
  
      <div>
        <label htmlFor="fecha_nacimientopet" className="block text-sm font-medium">
          Fecha de Nacimiento
        </label>
        <input
          type="date"
          id="fecha_nacimientopet"
          name="fecha_nacimientopet"
          value={formData.fecha_nacimientopet}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
  
      <div>
        <label htmlFor="color" className="block text-sm font-medium">
          Color
        </label>
        <input
          type="text"
          id="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
  
      <div>
  <label htmlFor="sexo" className="block text-sm font-medium">
    Sexo
  </label>
  <select
    id="sexo"
    name="sexo"
    value={formData.sexo}
    onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
    required
    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
  >
    <option value="" disabled>
      Selecciona el sexo
    </option>
    <option value="M">Macho</option>
    <option value="F">Hembra</option>
  </select>
</div>

      <button
        type="submit"
        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded"
      >
        Registrar Mascota
      </button>
    </form>
  </div>
  </ProtectedRoute>

  );
};

export default Pet;

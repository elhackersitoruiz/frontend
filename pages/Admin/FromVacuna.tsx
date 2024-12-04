import React, { useState } from "react";
import ProtectedRoute from '../../src/app/components/protected-route';


interface FormVacunaProps {
  petId: number | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const FormVacuna: React.FC<FormVacunaProps> = ({ petId, setError }) => {
  const [vacunaData, setVacunaData] = useState({
    fechavacuna: "",
    fecharevacuna: "",
    tipo: "",
    descripcion: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVacunaData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petId) {
      setError("No se ha seleccionado una mascota.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/register/vacuna/${petId}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pet: petId, ...vacunaData }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError("Error al registrar vacuna: " + errorText);
        return;
      }

      console.log("Vacuna registrada exitosamente.");
      setVacunaData({ fechavacuna: "", fecharevacuna: "", tipo: "", descripcion: "" });
      setError(null);

      // Refresca la página después de un registro exitoso
      window.location.reload();

    } catch (error) {
      setError("Error en la conexión con el servidor.");
    }
  };

  return (

    <ProtectedRoute roleRequired="admin"> 

    <form onSubmit={handleSubmit} className="container mx-auto px-8 py-10 bg-white rounded-xl shadow-lg text-black">
      <h2 className="text-3xl font-bold mb-8 text-center text-teal-600">Registrar Vacuna</h2>
      
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2" htmlFor="fechavacuna">Fecha de la vacuna</label>
          <input
            id="fechavacuna"
            type="date"
            name="fechavacuna"
            value={vacunaData.fechavacuna}
            onChange={handleChange}
            required
            className="w-50 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-teal-300 shadow-inner"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2" htmlFor="fecharevacuna">Fecha de revacunación</label>
          <input
            id="fecharevacuna"
            type="date"
            name="fecharevacuna"
            value={vacunaData.fecharevacuna}
            onChange={handleChange}
            required
            className="w-50 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-inner"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2" htmlFor="tipo">Tipo de vacuna</label>
          <input
            id="tipo"
            type="text"
            name="tipo"
            value={vacunaData.tipo}
            onChange={handleChange}
            placeholder="Ejemplo: Antirrábica"
            required
            className="w-50 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-inner"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2" htmlFor="descripcion">Descripción</label>
          <input
            id="descripcion"
            type="text"
            name="descripcion"
            value={vacunaData.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            required
            className="w-58 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-inner"
          />
        </div>

        <button
          type="submit"
          className="px-8 py-3 mt-6 bg-white text-teal-600 font-bold text-lg rounded-lg shadow-md hover:bg-gray-200 transition-transform transform hover:scale-105 focus:ring-4 focus:ring-teal-300"
        >
          Registrar
        </button>
      </div>
    </form>
    </ProtectedRoute>

  );
};

export default FormVacuna;

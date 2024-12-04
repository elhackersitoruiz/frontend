import React, { useState } from "react";
import ProtectedRoute from '../../src/app/components/protected-route';


interface FormDesparacitacionProps {
  petId: number | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const FormDesparacitacion: React.FC<FormDesparacitacionProps> = ({ petId, setError }) => {
  // Estado para los datos de la desparasitación
  const [desparacitacionData, setDesparacitacionData] = useState({
    producto: "",
    fechadespara: "",
    peso: "",
    proxima: "",
  });

  // Manejador para actualizar el estado al cambiar los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDesparacitacionData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejador para enviar los datos del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar si hay un `petId`
    if (!petId) {
      setError("No se ha seleccionado una mascota.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/register/desparacitacion/${petId}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pet: petId, ...desparacitacionData }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        setError("Error al registrar desparasitación: " + errorText);
        return;
      }

      console.log("Desparasitación registrada exitosamente.");
      // Reinicia el formulario
      setDesparacitacionData({ producto: "", fechadespara: "", peso: "", proxima: "" });
      setError(null);
      window.location.reload();

    } catch (error) {
      setError("Error en la conexión con el servidor.");
    }
  };

  return (
    <ProtectedRoute roleRequired="admin"> 


    <form onSubmit={handleSubmit} className="container mx-auto px-8 py-10 bg-white rounded-xl shadow-lg text-black">
  <h2 className="text-3xl font-bold mb-8 text-center text-teal-600">Registrar Desparasitación</h2>
  
  <div className="flex flex-wrap items-center gap-6">
    <div className="flex flex-col">
      <label className="text-lg font-medium mb-2" htmlFor="producto">Producto utilizado</label>
      <input
        id="producto"
        type="text"
        name="producto"
        value={desparacitacionData.producto}
        onChange={handleChange}
        placeholder="Producto utilizado"
        required
        className="w-50 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-teal-300 shadow-inner"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-lg font-medium mb-2" htmlFor="fechadespara">Fecha de desparasitación</label>
      <input
        id="fechadespara"
        type="date"
        name="fechadespara"
        value={desparacitacionData.fechadespara}
        onChange={handleChange}
        required
        className="w-50 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-inner"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-lg font-medium mb-2" htmlFor="peso">Peso de la mascota (kg)</label>
      <input
        id="peso"
        type="number"
        name="peso"
        value={desparacitacionData.peso}
        onChange={handleChange}
        placeholder="Peso de la mascota (kg)"
        required
        step="0.01"
        min="0"
        className="w-50 px-4 py-2 rounded-lg text-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-inner"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-lg font-medium mb-2" htmlFor="proxima">Fecha de próxima desparasitación</label>
      <input
        id="proxima"
        type="date"
        name="proxima"
        value={desparacitacionData.proxima}
        onChange={handleChange}
        required
        className="w-50 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-inner"
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

export default FormDesparacitacion;

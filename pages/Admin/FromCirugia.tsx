import React, { useState } from "react";
import ProtectedRoute from '../../src/app/components/protected-route';


interface FormCirugiaProps {
  petId: number | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const FormCirugia: React.FC<FormCirugiaProps> = ({ petId, setError }) => {
  // Estado para los datos de la cirugía
  const [cirugiaData, setCirugiaData] = useState({
    fechaciru: "",
    fechareti: "",
    tipo: "",
  });

  // Manejador para actualizar el estado al cambiar los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCirugiaData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejador para enviar los datos del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!petId) {
      setError("No se ha seleccionado una mascota.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/register/cirugia/${petId}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pet: petId, ...cirugiaData }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError("Error al registrar cirugía: " + errorText);
        return;
      }

      console.log("Cirugía registrada exitosamente.");
      setCirugiaData({ fechaciru: "", fechareti: "", tipo: "" });
      setError(null);
      window.location.reload();


    } catch (error) {
      setError("Error en la conexión con el servidor.");
    }
  };

  return (
    <ProtectedRoute roleRequired="admin"> 


<form onSubmit={handleSubmit} className="container mx-auto px-8 py-10 bg-white rounded-xl shadow-lg text-black">
<h2 className="text-3xl font-bold mb-8 text-center text-teal-600">Registrar Cirugía</h2>  
  <div className="flex flex-wrap items-center gap-6">
    <div className="flex flex-col">
      <label className="text-lg font-medium mb-2" htmlFor="fechaciru">Fecha de la cirugía</label>
      <input
        id="fechaciru"
        type="date"
        name="fechaciru"
        value={cirugiaData.fechaciru}
        onChange={handleChange}
        required
        className="w-50 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-teal-300 shadow-inner"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-lg font-medium mb-2" htmlFor="fechareti">Fecha de retirada</label>
      <input
        id="fechareti"
        type="date"
        name="fechareti"
        value={cirugiaData.fechareti}
        onChange={handleChange}
        required
        className="w-50 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-inner"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-lg font-medium mb-2" htmlFor="tipo">Tipo de cirugía</label>
      <input
        id="tipo"
        type="text"
        name="tipo"
        value={cirugiaData.tipo}
        onChange={handleChange}
        placeholder="Ejemplo: Esterilización"
        required
        className="w-60 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-inner"
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

export default FormCirugia;

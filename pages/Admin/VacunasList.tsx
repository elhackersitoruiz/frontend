import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ProtectedRoute from '../../src/app/components/protected-route';
import Image from "next/image";


interface Vacuna {
  id: number;
  fechavacuna: string;
  fecharevacuna: string;
  tipo: string;
  descripcion: string;
}

interface VacunasListProps {
  petId: number | null;
}

const VacunasList: React.FC<VacunasListProps> = ({ petId }) => {
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingVacuna, setEditingVacuna] = useState<Vacuna | null>(null);
  const [updatedVacuna, setUpdatedVacuna] = useState<Partial<Vacuna>>({});

  useEffect(() => {
    if (!petId) {
      setError("No se ha seleccionado una mascota.");
      return;
    }

    const fetchVacunas = async () => {
      try {
        const response = await fetch(`http://localhost:8000/pet/${petId}/vacunas/`);
        if (!response.ok) {
          const errorText = await response.text();
          setError("Error al obtener vacunas: " + errorText);
          return;
        }

        const data: Vacuna[] = await response.json();
        setVacunas(data);
        setError(null);
      } catch (error) {
        setError("Error en la conexión con el servidor.");
      }
    };

    fetchVacunas();
  }, [petId]);

  const handleDelete = async (vacunaId: number) => {
    if (!petId) return;
    const result = await Swal.fire({
      title: "¿Estás seguro de que deseas eliminar esta vacuna?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) {
      console.log("Eliminación cancelada.");
      return;
    }

  
    try {
      const response = await fetch(
        `http://localhost:8000/delete/vacuna/${petId}/${vacunaId}/`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al eliminar la vacuna.");
      }

      setVacunas((prevVacunas) =>
        prevVacunas.filter((vacuna) => vacuna.id !== vacunaId)
      );
      setError(null);
      Swal.fire("Eliminado", "La cirugía ha sido eliminada.", "success");
    } catch (err: any) {
      setError(err.message || "Error en la conexión con el servidor al intentar eliminar.");
      Swal.fire("Error", "Ocurrió un error inesperado.", "error");
    }
  };


  const handleEdit = (vacuna: Vacuna) => {
    setEditingVacuna(vacuna);
    setUpdatedVacuna({
      fechavacuna: vacuna.fechavacuna,
      fecharevacuna: vacuna.fecharevacuna,
      tipo: vacuna.tipo,
      descripcion: vacuna.descripcion,
    });
  };

  const handleUpdate = async () => {
    if (!petId || !editingVacuna) return;

    try {
      const response = await fetch(
        `http://localhost:8000/update/vacuna/${petId}/${editingVacuna.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedVacuna),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al actualizar la vacuna.");
      }

      const updatedData = await response.json();
      setVacunas((prevVacunas) =>
        prevVacunas.map((vacuna) =>
          vacuna.id === updatedData.id ? updatedData : vacuna
        )
      );
      setEditingVacuna(null);
      setUpdatedVacuna({});
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error en la conexión con el servidor al intentar actualizar.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedVacuna((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (vacunas.length === 0) {
    return <p className="text-1xl font-bold mb-8 text-center text-red-600">No hay vacunas registradas para esta mascota.</p>;
  }

  return (
    <ProtectedRoute roleRequired="admin"> 


<div className="container mx-auto px-8 py-10 bg-white rounded-xl shadow-lg text-black">
  <div className="flex overflow-x-auto space-x-6 py-4">
    {vacunas.map((vacuna) => (
      <div
        key={vacuna.id}
        className="flex-shrink-0 w-64 bg-gray-100 p-6 rounded-lg shadow-md"
      >
        <h3 className="text-lg font-bold text-gray-700 mb-4">Detalles de Vacuna</h3>
        <p className="text-gray-800">
          <strong>Fecha de Vacuna:</strong> {vacuna.fechavacuna}
        </p>
        <p className="text-gray-800">
          <strong>Fecha de Revacunación:</strong> {vacuna.fecharevacuna}
        </p>
        <p className="text-gray-800">
          <strong>Tipo:</strong> {vacuna.tipo}
        </p>
        <p className="text-gray-800">
          <strong>Descripción:</strong> {vacuna.descripcion}
        </p>
        <div className="flex justify-between mt-4">
  
       
        <button
  onClick={() => handleEdit(vacuna)}
  className="text-blue-600 hover:text-blue-800 flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full shadow-md hover:bg-blue-200 transition-transform transform hover:scale-105"
>
  <div className="w-8 h-8">
    <Image src="/images/Iconos/documento.png" alt="Editar" width={32} height={32} />
  </div>
</button>

<button
  onClick={() => handleDelete(vacuna.id)}
  className="text-red-600 hover:text-red-800 flex items-center justify-center w-12 h-12 bg-red-100 rounded-full shadow-md hover:bg-red-200 transition-transform transform hover:scale-105"
>
  <div className="w-8 h-8">
    <Image src="/images/Iconos/borrar.png" alt="Eliminar" width={32} height={32} />
  </div>
</button>


        </div>
      </div>
    ))}
  </div>

  {editingVacuna && (
    <div className="mt-6 p-6 bg-gray-100 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-teal-600">Actualizar Vacuna</h3>

      <div className="flex flex-wrap gap-6">
        <div className="flex flex-col w-64">
          <label className="text-lg font-medium mb-2" htmlFor="fechavacuna">Fecha de Vacuna</label>
          <input
            id="fechavacuna"
            type="text"
            name="fechavacuna"
            value={updatedVacuna.fechavacuna || ""}
            onChange={handleChange}
            placeholder="Fecha de Vacuna"
            className="px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-teal-300 shadow-inner"
          />
        </div>
        <div className="flex flex-col w-64">
          <label className="text-lg font-medium mb-2" htmlFor="fecharevacuna">Fecha de Revacunación</label>
          <input
            id="fecharevacuna"
            type="text"
            name="fecharevacuna"
            value={updatedVacuna.fecharevacuna || ""}
            onChange={handleChange}
            placeholder="Fecha de Revacunación"
            className="px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-inner"
          />
        </div>
        <div className="flex flex-col w-64">
          <label className="text-lg font-medium mb-2" htmlFor="tipo">Tipo</label>
          <input
            id="tipo"
            type="text"
            name="tipo"
            value={updatedVacuna.tipo || ""}
            onChange={handleChange}
            placeholder="Tipo"
            className="px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-inner"
          />
        </div>
        <div className="flex flex-col w-64">
          <label className="text-lg font-medium mb-2" htmlFor="descripcion">Descripción</label>
          <input
            id="descripcion"
            type="text"
            name="descripcion"
            value={updatedVacuna.descripcion || ""}
            onChange={handleChange}
            placeholder="Descripción"
            className="px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-inner"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={handleUpdate}
          className="px-8 py-3 bg-teal-500 text-white font-bold text-lg rounded-lg shadow-md hover:bg-teal-600 transition-transform transform hover:scale-105"
        >
          Actualizar
        </button>
        <button
          onClick={() => setEditingVacuna(null)}
          className="px-8 py-3 bg-gray-300 text-gray-800 font-bold text-lg rounded-lg shadow-md hover:bg-gray-400 transition-transform transform hover:scale-105"
        >
          Cancelar
        </button>
      </div>
    </div>
  )}
</div>
</ProtectedRoute>

  );
};

export default VacunasList;

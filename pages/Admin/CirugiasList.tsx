import React, { useState, useEffect } from "react";
import ProtectedRoute from '../../src/app/components/protected-route';
import Image from "next/image";


import Swal from "sweetalert2";


interface Cirugia {
  id: number;
  fechaciru: string;
  fechareti: string;
  tipo: string;
}

interface CirugiasListProps {
  petId: number | null;
}

const CirugiasList: React.FC<CirugiasListProps> = ({ petId }) => {
  const [cirugias, setCirugias] = useState<Cirugia[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingCirugia, setEditingCirugia] = useState<Cirugia | null>(null);
  const [updatedCirugia, setUpdatedCirugia] = useState<Partial<Cirugia>>({});

  useEffect(() => {
    if (!petId) {
      setError("No se ha seleccionado una mascota.");
      return;
    }

    const fetchCirugias = async () => {
      try {
        const response = await fetch(`http://localhost:8000/pet/${petId}/cirugias/`);
        if (!response.ok) {
          const errorText = await response.text();
          setError("Error al obtener cirugias: " + errorText);
          return;
        }

        const data: Cirugia[] = await response.json();
        setCirugias(data);
        setError(null);
      } catch (error) {
        setError("Error en la conexión con el servidor.");
      }
    };

    fetchCirugias();
  }, [petId]);

  const handleDelete = async (cirugiaId: number) => {
    if (!petId) return;
  
    const result = await Swal.fire({
      title: "¿Estás seguro de que deseas eliminar esta cirugía?",
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
        `http://localhost:8000/delete/cirugia/${petId}/${cirugiaId}/`,
        { method: "DELETE" }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al eliminar la cirugía.");
      }
  
      setCirugias((prevCirugias) =>
        prevCirugias.filter((cirugia) => cirugia.id !== cirugiaId)
      );
      setError(null);
      Swal.fire("Eliminado", "La cirugía ha sido eliminada.", "success");
    } catch (err: any) {
      setError(err.message || "Error en la conexión con el servidor al intentar eliminar.");
      Swal.fire("Error", "Ocurrió un error inesperado.", "error");
    }
  };

  const handleEdit = (cirugia: Cirugia) => {
    setEditingCirugia(cirugia);
    setUpdatedCirugia({
      fechaciru: cirugia.fechaciru,
      fechareti: cirugia.fechareti,
      tipo: cirugia.tipo,
      
    });
  };

  const handleUpdate = async () => {
    if (!petId || !editingCirugia) return;

    try {
      const response = await fetch(
        `http://localhost:8000/update/cirugia/${petId}/${editingCirugia.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCirugia),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al actualizar la cirugia.");
      }

      const updatedData = await response.json();
      setCirugias((prevCirugias) =>
        prevCirugias.map((cirugia) =>
          cirugia.id === updatedData.id ? updatedData : cirugia
        )
      );
      setEditingCirugia(null);
      setUpdatedCirugia({});
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error en la conexión con el servidor al intentar actualizar.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedCirugia((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (cirugias.length === 0) {
    return <p className="text-1xl font-bold mb-8 text-center text-red-600">No hay cirugias registradas para esta mascota.</p>;
  }

  return (

    <ProtectedRoute roleRequired="admin"> 

<div className="container mx-auto px-8 py-10 bg-white rounded-xl shadow-lg text-black">
  <div className="flex overflow-x-auto space-x-6 py-4">
    {cirugias.map((cirugia) => (
      <div
        key={cirugia.id}
        className="flex-shrink-0 w-64 bg-gray-100 p-6 rounded-lg shadow-md"
      >
        <h3 className="text-lg font-bold text-gray-700 mb-4">Detalles de la cirugia</h3>

            <p className="text-gray-800">
               <strong>Fecha de cirugía:</strong> {cirugia.fechaciru}
            </p>
            <p className="text-gray-800">
            <strong> Fecha de retirada de puntos:</strong> {cirugia.fechareti}
            </p>
        
            <p className="text-gray-800">
            <strong>Tipo:</strong> {cirugia.tipo}
            </p>
          
            <div className="flex justify-between mt-4">
            <button
  onClick={() => handleEdit(cirugia)}
  className="text-blue-600 hover:text-blue-800 flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full shadow-md hover:bg-blue-200 transition-transform transform hover:scale-105"
>
  <div className="w-8 h-8">
    <Image src="/images/Iconos/documento.png" alt="Editar" width={32} height={32} />
  </div>
</button>
<button
  onClick={() => handleDelete(cirugia.id)}
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

  {editingCirugia && (
    <div className="mt-6 p-6 bg-gray-100 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-teal-600">Actualizar Cirugía</h3>

      <div className="flex flex-wrap gap-6">
        <div className="flex flex-col w-64">
          <label className="text-lg font-medium mb-2" htmlFor="fechacirugia">
            Fecha de la Cirugía
          </label>
          <input
            id="fechacirugia"
            type="text"
            name="fechacirugia"
            value={updatedCirugia.fechaciru || ""}
            onChange={handleChange}
            placeholder="Fecha de la Cirugía"
            className="px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-teal-300 shadow-inner"
          />
        </div>

        <div className="flex flex-col w-64">
          <label className="text-lg font-medium mb-2" htmlFor="fecharetirada">
            Fecha de Retiro de puntos
          </label>
          <input
            id="fecharetirada"
            type="text"
            name="fecharetirada"
            value={updatedCirugia.fechareti || ""}
            onChange={handleChange}
            placeholder="Fecha de Retiro de puntos"
            className="px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-inner"
          />
        </div>

        <div className="flex flex-col w-64">
          <label className="text-lg font-medium mb-2" htmlFor="tipo">Tipo</label>
          <input
            id="tipo"
            type="text"
            name="tipo"
            value={updatedCirugia.tipo || ""}
            onChange={handleChange}
            placeholder="Tipo"
            className="px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-inner"
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
          onClick={() => setEditingCirugia(null)}
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

export default CirugiasList;

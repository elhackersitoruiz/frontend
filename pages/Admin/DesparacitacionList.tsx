import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ProtectedRoute from "../../src/app/components/protected-route";
import Image from "next/image";

interface Desparasitacion {
  id: number;
  producto: string;
  fechadespara: string;
  peso: number;
  proxima: string;
}

interface DesparacitacionesListProps {
  petId: number | null;
}

const DesparacitacionesList: React.FC<DesparacitacionesListProps> = ({ petId }) => {
  const [desparacitaciones, setDesparacitaciones] = useState<Desparasitacion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingDesparacitacion, setEditingDesparacitacion] = useState<Desparasitacion | null>(null);
  const [updatedDesparacitacion, setUpdatedDesparacitacion] = useState<Partial<Desparasitacion>>({});

  useEffect(() => {
    if (!petId) {
      setError("No se ha seleccionado una mascota.");
      return;
    }

    const fetchDesparacitaciones = async () => {
      try {
        const response = await fetch(`http://localhost:8000/pet/${petId}/desparacitacion/`);
        if (!response.ok) {
          const errorText = await response.text();
          setError("Error al obtener las desparasitaciones: " + errorText);
          return;
        }

        const data: Desparasitacion[] = await response.json();
        setDesparacitaciones(data);
        setError(null);
      } catch (err) {
        setError("Error en la conexión con el servidor.");
      }
    };

    fetchDesparacitaciones();
  }, [petId]);

  const handleDelete = async (desparacitacionId: number) => {
    if (!petId) return;

    const result = await Swal.fire({
      title: "¿Estás seguro de que deseas eliminar esta desparacitación?",
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
      const response = await fetch(
        `http://localhost:8000/delete/desparacitacion/${petId}/${desparacitacionId}/`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al eliminar la desparacitación.");
      }

      setDesparacitaciones((prev) =>
        prev.filter((desparacitacion) => desparacitacion.id !== desparacitacionId)
      );
      Swal.fire("Eliminado", "La desparacitación ha sido eliminada.", "success");
    } catch (err: any) {
      setError(err.message || "Error en la conexión con el servidor al intentar eliminar.");
      Swal.fire("Error", "Ocurrió un error inesperado.", "error");
    }
  };

  const handleEdit = (desparacitacion: Desparasitacion) => {
    setEditingDesparacitacion(desparacitacion);
    setUpdatedDesparacitacion({ ...desparacitacion });
  };

  const handleUpdate = async () => {
    if (!petId || !editingDesparacitacion) return;

    try {
      const response = await fetch(
        `http://localhost:8000/update/desparacitacion/${petId}/${editingDesparacitacion.id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedDesparacitacion),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al actualizar la desparacitación.");
      }

      const updatedData = await response.json();
      setDesparacitaciones((prev) =>
        prev.map((desparacitacion) =>
          desparacitacion.id === updatedData.id ? updatedData : desparacitacion
        )
      );
      setEditingDesparacitacion(null);
      setUpdatedDesparacitacion({});
    } catch (err: any) {
      setError(err.message || "Error al intentar actualizar.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedDesparacitacion((prev) => ({ ...prev, [name]: value }));
  };

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (desparacitaciones.length === 0) {
    return (
      <p className="text-1xl font-bold mb-8 text-center text-red-600">
        No hay desparasitaciones registradas para esta mascota.
      </p>
    );
  }

  return (
    <ProtectedRoute roleRequired="admin">
      <div className="container mx-auto px-8 py-10 bg-white rounded-xl shadow-lg text-black">
        <div className="flex overflow-x-auto space-x-6 py-4">
          {desparacitaciones.map((desparacitacion) => (
            <div key={desparacitacion.id} className="flex-shrink-0 w-64 bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-700 mb-4">Detalles de la desparacitación</h3>
              <p className="text-gray-800">
                <strong>Producto:</strong> {desparacitacion.producto}
              </p>
              <p className="text-gray-800">
                <strong>Fecha:</strong> {desparacitacion.fechadespara}
              </p>
              <p className="text-gray-800">
                <strong>Peso:</strong> {desparacitacion.peso}
              </p>
              <p className="text-gray-800">
                <strong>Próxima:</strong> {desparacitacion.proxima}
              </p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(desparacitacion)}
                  aria-label="Editar desparacitación"
                  className="text-blue-600 hover:text-blue-800 flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full shadow-md hover:bg-blue-200 transition-transform transform hover:scale-105"
                >
                  <Image
                    src="/images/Iconos/documento.png"
                    alt="Editar"
                    width={32}
                    height={32}
                  />
                </button>
                <button
                  onClick={() => handleDelete(desparacitacion.id)}
                  aria-label="Eliminar desparacitación"
                  className="text-red-600 hover:text-red-800 flex items-center justify-center w-12 h-12 bg-red-100 rounded-full shadow-md hover:bg-red-200 transition-transform transform hover:scale-105"
                >
                  <Image
                    src="/images/Iconos/borrar.png"
                    alt="Eliminar"
                    width={32}
                    height={32}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {editingDesparacitacion && (
          <div className="mt-6 p-6 bg-gray-100 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-teal-600">Actualizar Desparacitación</h3>
            <div className="flex flex-wrap gap-6">
              {/* Input fields for editing */}
            </div>
            <div className="mt-6 flex justify-between">
              <button onClick={handleUpdate} className="btn-primary">
                Actualizar
              </button>
              <button onClick={() => setEditingDesparacitacion(null)} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default DesparacitacionesList;

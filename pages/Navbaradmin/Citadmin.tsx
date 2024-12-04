import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Image from 'next/image';


interface Cita {
  id: number;
  namecita: string;
  correocita: string;
  celularcita: string;
  serviciocita: string;
  fechacita: string;
  horacita: string;
  mensajecita: string;
  validada: boolean;
}

const CitasList = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState<boolean>(true);  // Controla si se muestran citas validadas o no validadas

  useEffect(() => {
    const fetchCitas = async () => {
      setLoading(true);  // Establecer loading en true antes de hacer la solicitud
      try {
        const url = isValidated
          ? "http://localhost:8000/citas/lista/"  // Citas validadas
          : "http://localhost:8000/citas/lista/sin/";  // Citas no validadas

        const response = await axios.get(url);
        setCitas(response.data);
      } catch (err) {
        console.error("Error fetching citas:", err);
        setError("Error al cargar las citas");
      } finally {
        setLoading(false);  // Establecer loading en false después de obtener los datos
      }
    };

    fetchCitas();
  }, [isValidated]);  // Se ejecuta cada vez que se cambia el valor de isValidated

  const filteredCitas = citas.filter((cita) =>
    cita.namecita.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
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
    if (!result.isConfirmed) {
      console.log("Eliminación cancelada por el administrador.");
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/citas/delete/${id}/`);
      
      // Si la eliminación es exitosa, actualiza la lista de citas
      setCitas(citas.filter(cita => cita.id !== id));
      Swal.fire("Eliminado", "La solicitud ha sido eliminada.", "success");
    } catch (error) {
      Swal.fire("Error", "Ocurrió un error inesperado.", "error");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-100">
      <div className="container mx-auto px-8 py-10 bg-white rounded-xl shadow-2xl text-black border border-gray-200">
        <h1 className="text-3xl font-bold mb-8 text-center text-teal-600">
          Listado de Citas Registradas
        </h1>

        {/* Botón para alternar entre citas validadas y no validadas */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsValidated(true)}
            className={`px-4 py-2 mr-4 border rounded-md ${isValidated ? "bg-teal-500 text-white" : "bg-gray-200"}`}
          >
            Citas Validadas
          </button>
          <button
            onClick={() => setIsValidated(false)}
            className={`px-4 py-2 border rounded-md ${!isValidated ? "bg-teal-500 text-white" : "bg-gray-200"}`}
          >
            Citas No Validadas
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre de cita..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Tabla de citas */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Nombre</th>
                <th className="px-4 py-2 border-b">Correo</th>
                <th className="px-4 py-2 border-b">Celular</th>
                <th className="px-4 py-2 border-b">Servicio</th>
                <th className="px-4 py-2 border-b">Fecha</th>
                <th className="px-4 py-2 border-b">Hora</th>
                <th className="px-4 py-2 border-b">Mensaje</th>
                <th className="px-4 py-2 border-b">Cita Valida</th>
                <th className="px-4 py-2 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCitas.length > 0 ? (
                filteredCitas.map((cita) => (
                  <tr key={cita.id}>
                    <td className="px-4 py-2 border-b">{cita.namecita}</td>
                    <td className="px-4 py-2 border-b">{cita.correocita}</td>
                    <td className="px-4 py-2 border-b">{cita.celularcita}</td>
                    <td className="px-4 py-2 border-b">{cita.serviciocita}</td>
                    <td className="px-4 py-2 border-b">{cita.fechacita}</td>
                    <td className="px-4 py-2 border-b">{cita.horacita}</td>
                    <td className="px-4 py-2 border-b">{cita.mensajecita}</td>
                    <td className="px-4 py-2 border-b">{cita.validada ? "Sí" : "No"}</td>
                    <td className="px-4 py-2 border-b">
                      {/* Botones de acciones */}
                      <div className="flex justify-between mt-4">
                        {/* Botón de editar */}


                        {/* Botón de eliminar */}
                        <button
  onClick={() => handleDelete(cita.id)}
  className="text-red-900 hover:text-red-100 flex items-center justify-center w-12 h-12 bg-red-400 rounded-full shadow-md hover:bg-red-500 transition-transform transform hover:scale-105"
>
  <div className="w-6 h-6">
    <Image src="/images/Iconos/eliminar.png" alt="Eliminar" width={24} height={24} />
  </div>
</button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-2 text-center">
                    No hay citas para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CitasList;

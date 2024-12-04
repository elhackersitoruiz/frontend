import React, { useState, useEffect } from "react";
import FormDesparacitacion from "./FromDesparacitacion";
import FormVacuna from "./FromVacuna";
import FormCirugia from "./FromCirugia";
import VacunasList from "./VacunasList";
import CirugiasList from "./CirugiasList";
import ErrorMessage from "./ErrorMessage";
import DesparacitacionesList from "./DesparacitacionList";
import ProtectedRoute from '../../src/app/components/protected-route';
import router from "next/router";
import Swal from "sweetalert2";




const Carnet: React.FC = () => {
    const [petId, setPetId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
  
    useEffect(() => {
      const savedPetId = localStorage.getItem("petId");
      if (savedPetId) {
        setPetId(Number(savedPetId));
      } else {
        setError("No se ha seleccionado una mascota.");
      }
    }, []);
    const handleDeletePet = async () => {
        if (!petId) {
          console.error("No hay una mascota seleccionada para eliminar.");
          return;
        }
      
        // Confirmación con SweetAlert2
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
          console.log("Eliminación cancelada por el usuario.");
          return;
        }
      
        try {
          const response = await fetch(`http://localhost:8000/pets/${petId}/delete/`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          if (response.ok) {
            console.log("Mascota eliminada con éxito.");
            await Swal.fire(
              "Eliminada",
              "La mascota ha sido eliminada exitosamente.",
              "success"
            );
            router.push("/Administrador"); // Redirigir tras eliminación exitosa
          } else if (response.status === 403) {
            console.error("No tienes permisos para realizar esta acción.");
            await Swal.fire(
              "Sin permisos",
              "No tienes autorización para eliminar esta mascota.",
              "error"
            );
          } else {
            const data = await response.json();
            console.error(data.message || "Error al eliminar la mascota.");
            await Swal.fire("Error", data.message || "Error al eliminar la mascota.", "error");
          }
        } catch (error) {
          console.error("Error de red o servidor:", error);
          await Swal.fire("Error", "Ocurrió un error de red o servidor.", "error");
        }
      };
      
      
  
    return (
      <ProtectedRoute roleRequired="admin"> 

      <div>
        <ErrorMessage message={error} />
        {success && <div className="success-message">{success}</div>}
        <FormVacuna petId={petId} setError={setError} />
        {petId && <VacunasList petId={petId} />}
  
        <FormCirugia petId={petId} setError={setError} />
        {petId && <CirugiasList petId={petId} />}
  
        <FormDesparacitacion petId={petId} setError={setError} />
        {petId && <DesparacitacionesList petId={petId} />}
  
        {petId && (
     <div className="flex justify-center items-center h-full">
     <button
       onClick={handleDeletePet}
       className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:bg-red-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 active:bg-red-800 active:scale-95"
     >
       Eliminar Mascota
     </button>
   </div>
   

        )}
      </div>
      </ProtectedRoute>

    );
  };
  
  export default Carnet;
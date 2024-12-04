import React from "react";
import { useRouter } from "next/router"; // Importa useRouter desde Next.js
import Closeadmin from "./Closeadmin";

const Data = () => {
    const router = useRouter(); // Inicializa el hook de Next.js

    const handleNavigation = (path: string) => {
        router.push(path); // Redirige a la ruta especificada
    };

    return (
        <div className="rounded-md max-w-sm w-full mx-auto">
            <div className="flex-1 space-y-4 py-1">
                <div className="sm:block">
                    <div className="space-y-1 px-5 pt-2 pb-3">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                        <button
                            className="text-xl font-semibold bg-transparent py-4 px-6 rounded-full hover:bg-navyblue hover:text-white"
                            onClick={() => handleNavigation("/Administrador")}
                            >
                            Lista
                        </button>
                        </div>

                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                        <button
                            className="text-xl font-semibold bg-transparent py-4 px-6 rounded-full hover:bg-navyblue hover:text-white"
                            onClick={() => handleNavigation("/Solicitud")}
                        >
                         Solicitud
                        </button>
                        </div>

                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            {/* Botón para redirigir a /registro */}
                            <button
                                className="text-xl font-semibold bg-transparent py-4 px-6 rounded-full hover:bg-navyblue hover:text-white"
                                onClick={() => handleNavigation("/Registro")}
                            >
                                Registro
                            </button>
                            </div>
    
                        <div className="flex items-center pr-2 sm:pr-0">
                            <Closeadmin />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Data;

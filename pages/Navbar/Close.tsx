import React  from "react";
import { Disclosure } from '@headlessui/react';
import { useRouter } from 'next/router';
import Swal from "sweetalert2";
const Close = () => {
    const router = useRouter();

    const handleLogout = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Cerrar sesión terminará tu sesión actual.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                router.push('/');
            }
        });
    };
    


    return (   
        <><Disclosure /><div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
                type="button"
                className="flex justify-end text-xl font-medium  text-[#39b0ec] py-4 px-4 lg:px-8 navbutton rounded-full hover:text-white hover:bg-[#39b0ec]"
                onClick={handleLogout}
            >
                Cerrar Sesión
            </button>

        </div><Disclosure /></>
            )
        }
        
    export default Close;
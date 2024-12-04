import { Disclosure } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import Drawerdatadmin from './Drawerdatadmin';
import Draweradmin from './Draweradmin';
import Closeadmin from './Closeadmin';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const Navbar = () => {
    // Declare the useState hook here in the component
    const [isOpen, setIsOpen] = React.useState(false);

    const handleLogout = () => {
        // Aquí puedes agregar la lógica para cerrar sesión (por ejemplo, eliminar tokens, etc.)
        console.log("Cerrando sesión...");
        // Redirigir a la página de inicio
        window.location.href = '/';
    };

    return (
        <Disclosure as="nav" className="navbar">
            <>
                <div className="mx-auto max-w-7xl p-3 md:p-6 lg:px-8">
                    <div className="relative flex h-12 sm:h-20 items-center">
                        <div className="flex flex-1 items-center sm:justify-between">

                            {/* LOGO */}
                            <div className="flex sm:hidden flex-shrink-0 items-center border-right">
                                <Image src="/images/Logo/Logoperro.png" alt="logo" width={36} height={36} />
                                <Link href="/" className='text-2xl font-semibold text-black ml-4'>
                                    Can & Fel
                                </Link>
                            </div>
                            <div className="hidden sm:flex flex-shrink-0 items-center border-right">
                                <Image src="/images/Logo/Logoperro.png" alt="logo" width={56} height={56} />
                                <Link href="/" className='text-2xl font-semibold text-black ml-4'>
                                    Can & Fel
                                </Link>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className='gap-6 hidden lg:flex'>
                            <div className='flex items-center gap-2'>
                                <Link href="/Administrador">
                                    <button className="text-xl font-semibold bg-transparent py-4 px-6 rounded-full hover:bg-navyblue hover:text-white">
                                        Lista
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className='gap-6 hidden lg:flex'>
                            <div className='flex items-center gap-2'>
                                <Link href="/Solicitud">
                                    <button className="text-xl font-semibold bg-transparent py-4 px-6 rounded-full hover:bg-navyblue hover:text-white">
                                        Solicitud
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className='gap-6 hidden lg:flex'>
                            <div className='flex items-center gap-2'>
                                <Link href="/Registro">
                                    <button className="text-xl font-semibold bg-transparent py-4 px-6 rounded-full hover:bg-navyblue hover:text-white">
                                        Registro
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* DRAWER FOR MOBILE VIEW */}
                        <div className='block lg:hidden'>
                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" onClick={() => setIsOpen(true)} />
                        </div>

                        {/* DRAWER LINKS DATA */}
                        <Draweradmin isOpen={isOpen} setIsOpen={setIsOpen}>
                            <Drawerdatadmin />
                        </Draweradmin>

                        <div className='gap-6 hidden lg:flex'>
                            <div className='flex items-center gap-2'>
                                {/* Add Logout or other content if needed */}
                            </div>
                        </div>
                        
                        <div className='gap-6 hidden lg:flex'>
                            <div className='flex items-center gap-2'>
                                <Closeadmin />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </Disclosure>
    );
}

export default Navbar;

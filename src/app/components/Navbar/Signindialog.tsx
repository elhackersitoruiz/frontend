import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import Image from 'next/image';
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from 'next/navigation';
import Swal from "sweetalert2";



const Signin = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [captchaValido, setCaptchaValido] = useState(false);
    const [usuarioValido, setUsuarioValido] = useState(true);
    const [isAccountLocked, setIsAccountLocked] = useState(false);
    const [lockMessage, setLockMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const closeModal = () => {
        setIsOpen(false);
        resetErrorMessage();
    };

    const openModal = () => {
        setIsOpen(true);
    };

    const resetErrorMessage = () => {
        setErrorMessage('');
        setUsuarioValido(true);
    };

    const handleCaptcha = (value: string | null) => {
        setCaptchaValido(!!value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isAccountLocked) {
            Swal.fire({
                icon: "warning",
                title: "Cuenta bloqueada",
                text: "Espera 15 minutos antes de intentar nuevamente.",
                confirmButtonColor: "#318dc9",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const { access, user_type, user_data } = data;

                localStorage.setItem('access_token', access);
                localStorage.setItem('user_type', user_type);
                localStorage.setItem('user_data', JSON.stringify(user_data));

                Swal.fire({
                    icon: "success",
                    title: "Inicio de sesión exitoso",
                    text: "Bienvenido a tu cuenta.",
                    confirmButtonColor: "#318dc9",
                }).then(() => {
                    if (user_type === 'admin') {
                        router.push('/Administrador');
                    } else {
                        router.push('/Usuario');
                    }
                });
            } else if (response.status === 403) {
                lockAccount();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error de inicio de sesión",
                    text: "Credenciales incorrectas. Intenta nuevamente.",
                    confirmButtonColor: "#318dc9",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error inesperado",
                text: "Hubo un problema al procesar tu solicitud. Intenta de nuevo más tarde.",
                confirmButtonColor: "#318dc9",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const lockAccount = () => {
        setIsAccountLocked(true);
        setLockMessage("Demasiados intentos fallidos. Espera 15 minutos antes de intentar nuevamente.");
    
        Swal.fire({
            icon: "warning",
            title: "Cuenta bloqueada",
            text: lockMessage, // Mensaje de bloqueo
            confirmButtonColor: "#318dc9",
        }).then(() => {
            router.push('/'); // Redirigir a la página de login
        });
    
        // Restablecer el bloqueo después de 15 minutos
        setTimeout(() => {
            setIsAccountLocked(false);
            setLockMessage('');
        }, 15 * 60 * 1000); // 15 minutos
    };
    


    return (
        <>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="hidden md:block">
                    <button
                        type="button"
                        className="flex justify-end text-xl font-medium bg-bg[#39b0ec] text-[#39b0ec] py-4 px-4 lg:px-8 navbutton rounded-full hover:text-white hover:bg-[#39b0ec]"
                        onClick={openModal}>
                        Iniciar Sesión
                    </button>
                </div>
            </div>

            {/* Login Modal */}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                                        <div className="w-full max-w-md space-y-8">
                                            <div className="flex items-center justify-center">
                                                <Image src="/images/Logo/Logoperro.png" alt="logo" width={46} height={46} />
                                                <Link href="/" className="text-2xl font-semibold text-black ml-4">
                                                    Cat & Fel
                                                </Link>
                                            </div>

                                            <h2 className="mt-10 text-center text-3xl font-bold tracking-tight text-lightgrey">
                                                Inicia sesión en tu cuenta
                                            </h2>

                                            {isAccountLocked ? (
                                                <div className="error text-red-500">{lockMessage}</div>
                                            ) : (
                                                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                                                    <div className="-space-y-px rounded-md shadow-sm">
                                                        <div>
                                                            <label htmlFor="username" className="sr-only">Nombre de usuario</label>
                                                            <input
                                                                id="username"
                                                                name="username"
                                                                type="text"
                                                                value={username}
                                                                onChange={(e) => setUsername(e.target.value)}
                                                                autoComplete="username"
                                                                required
                                                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-lightgrey border-opacity-40 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                placeholder="Nombre de usuario"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="password" className="sr-only">Contraseña</label>
                                                            <input
                                                                id="password"
                                                                name="password"
                                                                type="password"
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                autoComplete="current-password"
                                                                required
                                                                className="relative block w-full appearance-none rounded-none rounded-b-md border border-lightgrey border-opacity-40 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                placeholder="Contraseña"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <input
                                                                id="remember-me"
                                                                name="remember-me"
                                                                type="checkbox"
                                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                            />
                                                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                                                Recuérdame
                                                            </label>
                                                        </div>

                                                    </div>
                                                    <div className="recaptcha">
                                                        <ReCAPTCHA
                                                            sitekey="6Lf8YUoqAAAAAN43ogNY8IRPCZ2afgRgL7lPmD-3"
                                                            onChange={handleCaptcha}
                                                        />
                                                    </div>

                                                    {!captchaValido && (
                                                        <div className="error text-red-500">Por favor acepta el Captcha.</div>
                                                    )}
                                                    {!usuarioValido && (
                                                        <div className="error text-red-500">{errorMessage}</div>
                                                    )}

                                                    <div>
                                                        <button
                                                            type="submit"
                                                            disabled={isAccountLocked}
                                                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#39b0ec] py-2 px-4 text-sm font-medium text-white hover:bg-[#39b0ec] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                        >
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                                <LockClosedIcon className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                                                            </span>
                                                            Iniciar sesión
                                                        </button>
                                                    </div>
                                                    {errorMessage && (
                                                        <div className="text-red-500 mt-4">{errorMessage}</div>
                                                    )}
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>




        </>
    );
};

export default Signin;

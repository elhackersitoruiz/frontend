import { useRef } from 'react';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const PasswordReset: React.FC = () => {

    const newPasswordRef = useRef<HTMLInputElement | null>(null);
    const confirmPasswordRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter();



    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newPassword = newPasswordRef.current?.value;
        const confirmPassword = confirmPasswordRef.current?.value;

        if (newPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden. Por favor, inténtelo de nuevo.");
            return;
        }

        console.log(`Nueva contraseña: ${newPassword}`);

        router.push('/login');
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="flex items-center justify-center">
                    <Image src="/images/Logo/Logoperro.png" alt="logo" width={46} height={46} />
                    <Link href="/" className="text-2xl font-semibold text-black ml-4">
                        Cat & Fel
                    </Link>
                </div>

                <h2 className="mt-10 text-center text-3xl font-bold tracking-tight text-lightgrey">
                    Restablece tu contraseña
                </h2>
                <form className="mt-8 space-y-6" onSubmit={submit}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="new-password" className="sr-only">
                                Nueva contraseña
                            </label>
                            <input
                                id="new-password"
                                name="new-password"
                                type="password"
                                ref={newPasswordRef}
                                required
                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-lightgrey border-opacity-40 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Nueva contraseña"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="sr-only">
                                Repite la contraseña
                            </label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                ref={confirmPasswordRef}
                                required
                                className="relative block w-full appearance-none rounded-none rounded-b-md border border-lightgrey border-opacity-40 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Repite la contraseña"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#39b0ec] py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                        </span>
                        Cambiar Contraseña
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordReset;

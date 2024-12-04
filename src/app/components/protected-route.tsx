import { useRouter } from 'next/router';
import { useEffect, ReactNode, useState } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    roleRequired: 'admin' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roleRequired }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);  // Estado para manejar la carga

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const role = localStorage.getItem('user_type');

        if (!token || role !== roleRequired) {
            router.push('/');
        } else {
            setIsLoading(false);  // Cuando ya se verificó el token y rol, detiene la carga
        }
    }, [router, roleRequired]);

    if (isLoading) {
        return <div>Loading...</div>;  // Puedes mostrar un cargando o pantalla en blanco
    }

    return <>{children}</>;
};

export default ProtectedRoute;

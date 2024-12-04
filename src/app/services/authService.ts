import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:8000/api/token/';  // URL de tu API Django

// Definimos tipos para la respuesta de JWT
interface AuthResponse {
  access: string;
  refresh: string;
}

// Función para hacer login
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(API_URL, {
      username,
      password,
    });
    // Almacenar el token en las cookies
    Cookies.set('access_token', response.data.access, { expires: 1 / 24 }); // Expira en 1 hora
    Cookies.set('refresh_token', response.data.refresh, { expires: 1 });
    return response.data;
  } catch (error) {
    console.error('Error al hacer login', error);
    throw error;
  }
};

// Función para hacer logout
export const logout = (): void => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
};

// Función para obtener el token de acceso
export const getAccessToken = (): string | undefined => {
  return Cookies.get('access_token');
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
  return !!Cookies.get('access_token');
};

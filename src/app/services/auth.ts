import axios from 'axios';

interface LoginResponse {
    token: string;
    role: string;
    user_id: number; 
}
export interface Vacuna {
  id: number;
  pet: number;
  fechavacuna: string;
  fecharevacuna: string;
  tipo: string;
  descripcion: string;
}

export interface Desparacitacion {
  id: number;
  pet: number;
  producto: string;
  fechadespara: string;
  peso: number;
  proxima: string;
}

export interface Cirugia {
  id: number;
  pet: number;
  fechaciru: string;
  fechareti: string;
  tipo: string;
}

export interface Pet {
  id: number;
  namepet: string;
  especie: string;
  raza: string;
  fecha_nacimientopet: string;
  color: string;
  sexo: string;
  vacunas: Vacuna[];
  desparacitaciones: Desparacitacion[];
  cirugias: Cirugia[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  telefono: string;
  direccion: string;
  dni: string;
  is_staff: boolean;
  pets: Pet[];
}


const API_BASE_URL = "http://localhost:8000";

export async function login(username: string, password: string): Promise<boolean> {
    try {
        const response = await axios.post<LoginResponse>(`${API_BASE_URL}/api/token/`, { username, password });
        console.log("Respuesta del backend:", response.data);  // Verifica la respuesta aquí

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('user_id', String(response.data.user_id));


        return true;
    } catch (error) {
        console.error('Error durante el login:', error);
        return false;
    }
}



// Función para obtener usuarios con sus mascotas
export const fetchUsersWithPets = async (): Promise<User[]> => {
    try {
        const response = await axios.get<User[]>(`${API_BASE_URL}/users-with-pets/`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener usuarios con mascotas:", error);
        throw error;
    }
};


export const updateUser = async (id: number, userData: User) => {
  const response = await fetch(`http://localhost:8000/api/update_user/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el usuario");
  }

  return response;
};


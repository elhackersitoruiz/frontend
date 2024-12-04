import './global.css'
import Navbar from './Navbar';
import Usuario from './User/usuarioprueba';
 // Ajusta la ruta para que apunte a la carpeta pages


  
export default function Home() {
    return (
        <main>
            <Navbar /> {/* Agrega el Navbar aquí */}
            <Usuario />
        </main>
    );
}


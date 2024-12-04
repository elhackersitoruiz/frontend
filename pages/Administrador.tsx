import './global.css'
import Prueba from './Admin/Prueba1'
import Navbaradmin from './Navbaradmin'

export const dynamic = "force-dynamic"; 

export default function Home() {
    return (
        <main>
            <Navbaradmin />
            <Prueba/>

        </main>
    );
}
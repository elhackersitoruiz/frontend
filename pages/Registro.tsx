import './global.css'
import RegistroUser from './Admin/Register';
import Navbaradmin from './Navbaradmin';





export default function Home() {
    return (
        <main>
            <Navbaradmin/>
            <RegistroUser/>
   

        </main>
    );
}
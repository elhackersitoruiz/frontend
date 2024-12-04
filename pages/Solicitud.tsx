import './global.css'
import Navbaradmin from './Navbaradmin';

import Citadmin from './Navbaradmin/Citadmin';

export default function Home() {
    return (
        <main>
            <Navbaradmin />
            <Citadmin/>
        </main>
    );
}
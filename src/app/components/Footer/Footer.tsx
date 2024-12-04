import Link from "next/link";
import Image from "next/image";

interface SocialLink {
    imgSrc: string;
    link: string;
    width: number;
}

const socialLinks: SocialLink[] = [
    {
        imgSrc: '/images/Footer/facebook.svg',
        link: 'https://facebook.com',
        width: 24 // Aumenta el tamaño del icono
    },
    {
        imgSrc: '/images/Footer/insta.svg',
        link: 'https://instagram.com',
        width: 24 // Aumenta el tamaño del icono
    },
    {
        imgSrc: '/images/Footer/twitter.svg',
        link: 'https://twitter.com',
        width: 24 // Aumenta el tamaño del icono
    },
];

const Footer = () => {
    return (
        <div className="mx-auto max-w-2xl pt-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="my-12 flex flex-col items-center">
                {/* LOGO Y DESCRIPCIÓN */}
                <div className="flex flex-shrink-0 items-center mb-6">
                    <Image src="/images/Logo/Logoperro.png" alt="logo" width={56} height={56} />
                    <Link href="/" className='text-2xl font-semibold text-black ml-4'>
                        Can & Fel.
                    </Link>
                </div>
                
                <h3 className='text-textbl text-xs font-medium text-center mb-4 lg:mb-6'>
                    Tu veterinaria de confianza para el cuidado de tu mascota. Nos dedicamos a proporcionar los mejores servicios de salud, bienestar, y estética para tu amigo peludo. 
                    ¡Siempre aquí para ti y tu mascota!
                </h3>

                {/* Invitación a visitar redes sociales */}
                <p className='text-textbl text-xs font-medium text-center mb-4 lg:mb-6'>
                    ¡Únete a nuestra comunidad en redes sociales! Síguenos para obtener consejos de cuidado, actualizaciones sobre nuestros servicios, y contenido exclusivo.
                </p>
                <p className='text-textbl text-xs font-medium text-center mb-4 lg:mb-6'>
                    Queremos ser más que tu veterinaria, queremos ser tu aliado en el cuidado y bienestar de tu mascota.
                </p>

                {/* ICONOS DE REDES SOCIALES */}
                <div className='flex justify-center gap-6 mt-6 mb-6'>
                    {socialLinks.map((item, i) => (
                        <Link href={item.link} key={i}>
                            <div className="bg-white h-14 w-14 shadow-xl text-base rounded-full flex items-center justify-center footer-icons hover:bg-[#39b0ec]">
                                <Image src={item.imgSrc} alt={item.imgSrc} width={item.width} height={item.width} className="sepiaa" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

  
        </div>
    );
}

export default Footer;

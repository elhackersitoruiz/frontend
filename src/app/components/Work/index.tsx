"use client";
import Image from 'next/image';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Fade } from "react-awesome-reveal";
import { useState } from 'react';

interface cardDataType {
    imgSrc: string;
    heading: string;
    subheading: string;
    link: string;
}

const cardData: cardDataType[] = [
    {
        imgSrc: '/images/Servicios/informe-medico.png',
        heading: "Consultas Médicas",
        subheading: "Cuidamos de la salud de tu mascota con dedicación. Ofrecemos consultas para chequeos generales y tratamiento de enfermedades, siempre con el cariño y la atención que merecen. ¡Tu mascota en las mejores manos!",
        link: 'Mostrar más'
    },
    {
        imgSrc: '/images/Servicios/vacuna.png',
        heading: "Vacunación",
        subheading: "Protegemos a tu mascota con el plan de vacunación más completo. Aplicamos todas las vacunas necesarias para mantener a tu perro o gato saludable y libre de enfermedades. ¡Cuida a tu mascota con nosotros!",
        link: 'Mostrar más'
    },
    {
        imgSrc: '/images/Servicios/salud.png',
        heading: "Cirugías",
        subheading: "Realizamos cirugías seguras para el bienestar de tu mascota. Desde procedimientos menores hasta intervenciones más complejas, nuestro equipo veterinario está preparado para cuidar de tu perro o gato con la máxima profesionalidad. Confía en nosotros para la salud de tu mascota.",
        link: 'Mostrar más'
    },
    {
        imgSrc: '/images/Servicios/mesa.png',
        heading: "Estética",
        subheading: "Cuidamos la apariencia de tu mascota con nuestros servicios de estética. Ofrecemos baños, cortes de pelo y arreglo de uñas para que tu perro o gato se vea y se sienta genial. ¡Haz que tu mascota luzca espectacular!",
        link: 'Mostrar más'
    }
];

const Work = () => {
    const [expanded, setExpanded] = useState<boolean[]>(Array(cardData.length).fill(false));

    const toggleText = (index: number) => {
        setExpanded(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    return (
        <div>
        <div className='mx-auto max-w-7xl py-40 px-6' id="about-section">
            <div className='text-center mb-14'>
                <Fade direction={'up'} delay={400} cascade damping={0.1} triggerOnce={true}>
                    <h3 className='text-[#39b0ec] text-lg font-normal mb-3 ls-51 uppercase'>Nuestros Servicios</h3>
                </Fade>
                <Fade direction={'up'} delay={800} cascade damping={0.1} triggerOnce={true}>
                    <p className='text-3xl lg:text-5xl font-semibold text-lightgrey'>Cuidamos a tu mascota con dedicación</p>
                </Fade>
            </div>

            <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-y-20 gap-x-5 mt-32'>
                <Fade direction={'up'} delay={1000} cascade damping={0.1} triggerOnce={true}>
                    {cardData.map((items, i) => (
                        <div className='card-b p-8 relative rounded-3xl flex flex-col items-center' key={i}>
                            {/* Ajuste de tamaño del contenedor de la imagen */}
                            <div className='relative w-[300px] h-[180px] mb-10'> {/* Cambié mb-6 a mb-10 para mayor separación */}
                                <Image 
                                    src={items.imgSrc} 
                                    alt={items.heading} 
                                    fill 
                                    style={{ objectFit: 'contain' }} 
                                />
                            </div>
                            {/* Incremento del margen superior para mayor separación */}
                            <h3 className='text-2xl text-black font-semibold text-center mb-2 mt-0'>{items.heading}</h3>
                            <p className='text-lg font-normal text-black text-opacity-50 text-center mb-4 mt-[-10px]'>
                                {expanded[i] ? items.subheading : `${items.subheading.slice(0, 70)}...`}
                            </p>
                            <div className='flex items-center justify-center'>
                                <button onClick={() => toggleText(i)} className='text-lg font-medium text-pink hover-underline flex items-center'>
                                    {expanded[i] ? 'Mostrar menos' : 'Mostrar más'} <ChevronRightIcon width={20} height={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </Fade>
            </div>
        </div>
    </div>
);
};

export default Work;

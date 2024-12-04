import React from "react";
import Link from "next/link";
import Contactusform from "./Contactus";
import Signindialog from "./Signindialog";

interface NavigationItem {
    name: string;
    href: string;
    current: boolean;
}

const navigation: NavigationItem[] = [
    { name: 'Inicio', href: '#home-section', current: false },
    { name: 'Servicioss', href: '#about-section', current: false },
    { name: 'Especialistas', href: '#equipo-section', current: false },
    { name: 'Galeria', href: '#gallery-section', current: false },
]


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const Data = () => {
    return (
        <div className="rounded-md max-w-sm w-full mx-auto">
            <div className="flex-1 space-y-4 py-1">
                <div className="sm:block">
                    <div className="space-y-1 px-5 pt-2 pb-3">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                    item.current ? 'bg-gray-900 text-purple' : 'text-black  hover:text-purple',
                                    'block  py-2 rounded-md text-base font-medium'
                                )}
                                aria-current={item.current ? 'page' : undefined}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="flex items-center pr-2 sm:pr-0"></div>
                            <Signindialog/>
                        <div className="flex items-center pr-2 sm:pr-0"></div>
                            <Contactusform/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Data;

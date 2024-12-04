import React from "react";
import Cita from "./Cita";
import Close from "./Close";


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const Data = () => {
    return (
        <div className="rounded-md max-w-sm w-full mx-auto">
            <div className="flex-1 space-y-4 py-1">
                <div className="sm:block">
                    <div className="space-y-1 px-5 pt-2 pb-3">
                 
                        

                        <div className="flex items-center pr-2 sm:pr-0"></div>
                            <Cita/>
                            <Close/>


                    </div>
                </div>
            </div>
        </div>
    );
}

export default Data;

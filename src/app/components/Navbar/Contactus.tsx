import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState } from 'react';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import Swal from 'sweetalert2';

const Contactusform = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [nuevaCita, setNuevaCita] = useState({
    namecita: '',
    correocita: '',
    celularcita: '',
    serviciocita: '',
    fechacita: '',
    horacita: '',
    mesajecita: '',
  });
  const [captchaValido, setCaptchaValido] = useState<boolean | null>(null);
  const captcha = useRef<ReCAPTCHA | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevaCita((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCaptcha = () => {
    setCaptchaValido(true);
    console.log('El usuario ha verificado el captcha.');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    // Validación de correo
    if (!nuevaCita.correocita.endsWith('@gmail.com')) {
      Swal.fire({
        title: 'Correo no válido',
        text: 'Por favor ingresa un correo electrónico válido de Gmail.',
        icon: 'error',
        confirmButtonText: 'Entendido',
      });
      return;
    }
  
    // Validación de teléfono
    const telefonoValido = /^9\d{8}$/;
    if (!telefonoValido.test(nuevaCita.celularcita)) {
      Swal.fire({
        title: 'Teléfono no válido',
        text: 'El número de teléfono debe tener 9 dígitos y comenzar con 9.',
        icon: 'error',
        confirmButtonText: 'Entendido',
      });
      return;
    }
  
    if (!captchaValido) {
      console.log('Por favor acepta el Captcha');
      setCaptchaValido(false);
      return;
    }
  
    // Verificación de la disponibilidad de la cita
    try {
      // Llamada al backend para verificar si ya existe una cita a la misma hora
      const response = await axios.get(`http://localhost:8000/verificar_cita/?fecha=${nuevaCita.fechacita}&hora=${nuevaCita.horacita}`);
  
      // Si ya existe una cita a esa hora, muestra el error
      if (response.data.existe) {
        Swal.fire({
          title: 'Hora no disponible',
          text: response.data.mensaje,
          icon: 'error',
          confirmButtonText: 'Entendido',
        });
        return;
      }
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al verificar la disponibilidad de la hora. Intenta de nuevo.',
        icon: 'error',
        confirmButtonText: 'Entendido',
      });
      return;
    }
  
    setLoading(true);
  
    try {
      // Si no hay conflictos, registra la cita
      await axios.post('http://localhost:8000/citas/', nuevaCita);
      Swal.fire({
        title: 'Cita registrada',
        text: 'Revisa tu correo para verificarla.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error: any) {
      if (error.response?.status === 429) {
        Swal.fire({
          title: 'Límite alcanzado',
          text: 'Solo puedes registrar hasta 3 citas por día desde este dispositivo.',
          icon: 'error',
          confirmButtonText: 'Entendido',
        });
      } else {
        console.error('Error al registrar la cita:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al registrar la cita. Por favor, inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Entendido',
        });
      }
    } finally {
      setLoading(false);
    }
  };
  


  const isDisabled = Object.values(nuevaCita).some((value) => value === '') || !captchaValido;

  return (
    <>
      <div className="flex items-center pr-2 sm:pr-0">
        <button
          type="button"
          className="text-xl font-semibold bg-transparent py-4 px-6 rounded-full hover:bg-navyblue hover:text-white"
          onClick={() => setIsOpen(true)}
        >
          Contáctanos
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="py-8 px-4 mx-auto max-w-screen-md">
                    <div className="flex items-center justify-center">
                      <Link href="/" className="text-2xl sm:text-4xl font-semibold text-black">
                        Contáctanos
                      </Link>
                    </div>
                    <p className="mb-2 text-center text-gray-500 sm:text-xl">
                      Horario: 11:00 am - 7:00 pm
                    </p>
                    <p className="mb-8 lg:mb-16 mt-2 font-light text-center text-gray-500 sm:text-xl">
                      ¿Quieres contactarnos? ¿Deseas separar una cita?
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div>
                        <label htmlFor="namecita" className="block mb-2 text-sm font-medium text-gray-900">
                          Tu Nombre
                        </label>
                        <input
                          type="text"
                          id="namecita"
                          name="namecita"
                          value={nuevaCita.namecita}
                          onChange={handleChange}
                          required
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label htmlFor="correocita" className="block mb-2 text-sm font-medium text-gray-900">
                          Tu Correo Electrónico
                        </label>
                        <input
                          id="correocita"
                          name="correocita"
                          value={nuevaCita.correocita}
                          onChange={handleChange}
                          type="email"
                          required
                          className="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="celularcita" className="block mb-2 text-sm font-medium text-gray-900">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          id="celularcita"
                          name="celularcita"
                          value={nuevaCita.celularcita}
                          onChange={handleChange}
                          required
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label htmlFor="serviciocita" className="block mb-2 text-sm font-medium text-gray-900">
                          Selecciona el servicio
                        </label>
                        <select
                          id="serviciocita"
                          name="serviciocita"
                          value={nuevaCita.serviciocita}
                          onChange={handleChange}
                          required
                          className="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Seleccione una opción...</option>
                          <option value="CONSULTA">Consulta Médica</option>
                          <option value="VACUNACION">Vacunación</option>
                          <option value="CIRUGIAS">Cirugías</option>
                          <option value="ESTETICA">Estética</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="fechacita" className="block mb-2 text-sm font-medium text-gray-900">
                          Selecciona la fecha
                        </label>
                        <input
                          type="date"
                          id="fechacita"
                          name="fechacita"
                          value={nuevaCita.fechacita}
                          onChange={handleChange}
                          required
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label htmlFor="horacita" className="block mb-2 text-sm font-medium text-gray-900">
                          Selecciona la hora
                        </label>
                        <select
                          id="horacita"
                          name="horacita"
                          value={nuevaCita.horacita}
                          onChange={handleChange}
                          required
                          className="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Seleccione una hora...</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="11:30 AM">11:30 AM</option>
                          <option value="12:00 PM">12:00 PM</option>
                          <option value="12:30 PM">12:30 PM</option>
                          <option value="1:00 PM">1:00 PM</option>
                          <option value="1:30 PM">1:30 PM</option>
                          <option value="2:00 PM">2:00 PM</option>
                          <option value="2:30 PM">2:30 PM</option>
                          <option value="3:00 PM">3:00 PM</option>
                          <option value="3:30 PM">3:30 PM</option>
                          <option value="4:00 PM">4:00 PM</option>
                          <option value="4:30 PM">4:30 PM</option>
                          <option value="5:00 PM">5:00 PM</option>
                          <option value="5:30 PM">5:30 PM</option>
                          <option value="6:00 PM">6:00 PM</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="mesajecita" className="block mb-2 text-sm font-medium text-gray-900">
                          Tu Mensaje
                        </label>
                        <textarea
                          id="mesajecita"
                          name="mesajecita"
                          value={nuevaCita.mesajecita}
                          onChange={handleChange}
                          rows={4}
                          required
                          className="w-full p-2 border border-gray-300 rounded"
                        ></textarea>
                      </div>
                      <div>
                        <ReCAPTCHA
                            sitekey="6Lf8YUoqAAAAAN43ogNY8IRPCZ2afgRgL7lPmD-3"
                          ref={captcha}
                          onChange={handleCaptcha}
                        />
                        {captchaValido === false && (
                          <p className="text-red-500 text-sm">Por favor acepta el CAPTCHA</p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={isDisabled || loading}
                        className={`w-full text-white py-2 px-4 rounded ${
                          isDisabled || loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                        {loading ? 'Enviando...' : 'Enviar'}
                      </button>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Contactusform;

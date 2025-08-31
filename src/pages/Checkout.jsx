import React, { useState } from 'react';
import { useCartStore } from "../store/useCartStore";
import { useNavigate } from 'react-router-dom';
import {formatPrice} from "../utils/formatPrice.js";

const Checkout = () => {
    const cart = useCartStore((state) => state.cart);
    const clearCart = useCartStore((state) => state.clearCart);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');
    const [shippingMethod, setShippingMethod] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'El nombre es obligatorio.';
        if (!address.trim()) newErrors.address = 'La dirección es obligatoria.';
        if (!whatsapp.trim()) newErrors.whatsapp = 'El número de WhatsApp es obligatorio.';
        else if (!/^\d{10,15}$/.test(whatsapp)) newErrors.whatsapp = 'Ingrese un número válido.';
        if (!email.trim()) newErrors.email = 'El email es obligatorio.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email no válido.';
        if (!shippingMethod) newErrors.shippingMethod = 'Seleccione un método de envío.';
        if (!paymentMethod) newErrors.paymentMethod = 'Seleccione un método de pago.';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        const newErrors = validate();
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setIsProcessing(true);

            fetch('/api/sendMail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    cart,
                    total,
                    whatsapp,
                }),
            })
                .then(res => {
                    if (!res.ok) throw new Error('Error al enviar el mail', res);
                    return res.json();
                })
                .then(() => {
                    setShowModal(true);
                    clearCart();
                    setTimeout(() => {
                        setShowModal(false);
                        navigate('/');
                    }, 3000);
                })
                .catch(err => {
                    console.error(err);
                    alert('Hubo un error al enviar el mail 😢');
                })
                .finally(() => {
                    setIsProcessing(false);
                });
        }
    };

    return (
        <div className="container mx-auto p-4">
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-60 backdrop-blur-sm z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm mx-auto">
                        <h3 className="text-2xl font-bold mb-2">¡Gracias por tu compra! 🎉</h3>
                        <p className="text-gray-600 mb-4">En breve serás redirigido al inicio.</p>
                        <div className="loader mx-auto border-t-4 border-[#a5732db5] border-solid rounded-full w-8 h-8 animate-spin"></div>
                    </div>
                </div>
            )}

            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Finaliza tu Compra</h2>
                {cart.length === 0 ? (
                    <p className="text-gray-500">No hay productos en el carrito.</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                            {submitted && errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Dirección</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                            {submitted && errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
                            <input
                                type="text"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                placeholder="Ej: 1123456789"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                            {submitted && errors.whatsapp && <p className="text-red-500 text-sm">{errors.whatsapp}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ej: ejemplo@mail.com"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                            {submitted && errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Método de Envío</label>
                            <select
                                value={shippingMethod}
                                onChange={(e) => setShippingMethod(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="envio">Envío a domicilio</option>
                                <option value="retiro">Retiro en punto de venta</option>
                            </select>
                            {submitted && errors.shippingMethod &&
                                <p className="text-red-500 text-sm">{errors.shippingMethod}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="efectivo">Efectivo</option>
                                <option value="transferencia">Transferencia bancaria</option>
                            </select>
                            {submitted && errors.paymentMethod &&
                                <p className="text-red-500 text-sm">{errors.paymentMethod}</p>}
                        </div>

                        <div className="text-right">
                            <div className="mt-4">
                                <p className="text-lg font-semibold">Total: {formatPrice(total)}</p>
                            </div>
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className={`bg-[#a5732db5] cursor-pointer w-1/3 text-white px-4 py-4 my-8 rounded hover:bg-[#a5732db5]-700 transition ${
                                    isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#a5732db5]-700'
                                }`}
                            >
                                {isProcessing ? 'Procesando...' : 'Confirmar Compra'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Checkout;

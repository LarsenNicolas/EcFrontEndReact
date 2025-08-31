import { Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full bg-[#a5732db5] text-black py-8 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

                {/* Información de la tienda */}
                <div>
                    <h3 className="text-xl font-bold font-serif mb-3">Aeternum</h3>
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Aeternum. Todos los derechos reservados.
                    </p>
                    <p className="text-sm mt-2">
                        Envíos gratis a partir de compras de <span className="font-semibold">$45.000</span>.
                    </p>
                </div>

                {/* Contacto */}
                <div>
                    <h3 className="text-xl font-bold font-serif mb-3">Contacto</h3>
                    <p className="text-sm">aeternumaccesoriosventas@gmail.com</p>
                </div>

                {/* Redes sociales */}
                <div className="flex flex-col items-center md:items-end">
                    <h3 className="text-xl font-bold font-serif mb-3">Seguinos</h3>
                    <a
                        href="https://www.instagram.com/aeternum.accesorios"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-pink-400 transition-colors"
                    >
                        <Instagram className="w-6 h-6" />
                        <span>@aeternum.accesorios</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}

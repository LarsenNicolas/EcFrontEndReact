import { useParams } from "react-router-dom";
import products from "../../mock/products";
import { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import Button from "../components/Button.jsx";
import { toast } from "react-toastify";
import { CheckCircle } from "lucide-react";
import sizeList from "../../mock/size.js";
import color from "../../mock/color.js";
import qualitiesList from "../../mock/qualities.js";

const ProductDetail = () => {
    const { id } = useParams();
    const product = products.find((p) => String(p.id) === id);
    const [quantity, setQuantity] = useState(1);
    const [currentImage, setCurrentImage] = useState(0);
    const addToCart = useCartStore((state) => state.addToCart);

    if (!product) {
        return (
            <div className="text-center mt-16">
                <h2 className="text-2xl font-semibold text-gray-700">
                    Producto no encontrado
                </h2>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.success(`Agregaste ${product.name} a tu carrito.`, {
            icon: <CheckCircle className="text-[#a5732db5]" />,
            style: {
                color: "#a5732db5",
                borderRadius: "8px",
                fontSize: "18px",
                width: "100%",
            },
        });
    };

    // Formatear precio
    const formattedPrice = new Intl.NumberFormat("es-AR").format(product.price);

    return (
        <div className="container mx-auto mt-16 mb-24 px-4">
            <div className="flex flex-col md:flex-row gap-10 md:gap-16">
                {/* CARRUSEL */}
                <div className="w-full md:w-1/2">
                    <div className="relative rounded-xl overflow-hidden shadow-lg">
                        <img
                            src={product.image[currentImage]}
                            alt={`Imagen de ${product.name}`}
                            className="w-full h-[500px] object-cover transition-all duration-500"
                        />

                        {/* Controles */}
                        {product.image.length > 1 && (
                            <>
                                <button
                                    onClick={() =>
                                        setCurrentImage(
                                            (currentImage - 1 + product.image.length) %
                                            product.image.length
                                        )
                                    }
                                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                                >
                                    ◀
                                </button>
                                <button
                                    onClick={() =>
                                        setCurrentImage((currentImage + 1) % product.image.length)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                                >
                                    ▶
                                </button>
                            </>
                        )}
                    </div>

                    {/* Miniaturas */}
                    {product.image.length > 1 && (
                        <div className="flex gap-3 mt-4 justify-center">
                            {product.image.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`${product.name} ${index}`}
                                    onClick={() => setCurrentImage(index)}
                                    className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-2 transition ${
                                        currentImage === index
                                            ? "border-[#a5732db5]"
                                            : "border-transparent hover:border-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* INFO */}
                <div className="w-full md:w-1/2 flex flex-col justify-between">
                    <div className="space-y-6">
                        <h1 className="text-4xl font-bold text-gray-900">
                            {product.name}
                        </h1>

                        <p className="text-gray-600 text-lg">{product.description}</p>

                        {product.longDescription && (
                            <p className="text-gray-700 text-base italic leading-relaxed">
                                {product.longDescription}
                            </p>
                        )}

                        <div className="space-y-2 text-gray-700 text-base">
                            {product.size.length > 0 && (
                                <p>
                                    <span className="font-semibold">Color:</span>{" "}
                                    {product.color
                                        .map((id) => color.find((s) => s.id === id)?.name)
                                        .join(", ")}
                                </p>
                            )}

                            {product.size.length > 0 && (
                                <p>
                                    <span className="font-semibold">Talle:</span>{" "}
                                    {product.size
                                        .map((id) => sizeList.find((s) => s.id === id)?.name)
                                        .join(", ")}
                                </p>
                            )}
                        </div>

                        {product.qualities.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {product.qualities.map((id) => {
                                    const q = qualitiesList.find((q) => q.id === id);
                                    return (
                                        <span
                                            key={id}
                                            className="px-3 py-1 text-sm rounded-full bg-[#e8e2db] text-[#7a5b2d] font-medium"
                                        >
                      {q?.name}
                    </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* PRECIO + CANTIDAD + BOTÓN */}
                    <div className="mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
                        <p className="text-3xl font-bold text-primary mb-6 sm:mb-0">
                            ${formattedPrice}
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                            <input
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="w-full sm:w-20 px-3 py-2 border border-gray-300 rounded-md text-center text-lg"
                            />
                            <Button
                                onClick={handleAddToCart}
                                className="w-full sm:w-auto px-6 py-3 text-lg"
                            >
                                Agregar al carrito
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* BLOQUE DE CUIDADOS */}
            {product.care && (
                <div className="mt-16 p-8 bg-[#f9f7f4] rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Cuidados del producto
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                        facilisi. Suspendisse potenti. Ut ac ipsum vel dui volutpat varius.
                        Sed dignissim, lectus non hendrerit pretium, odio urna convallis
                        augue, a fermentum justo nisl at risus.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;

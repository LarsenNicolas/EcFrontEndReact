import { Link, useParams } from "react-router-dom";
import products from "../../mock/products";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import categoriesData from "../../mock/categories";
import {formatPrice} from "../utils/formatPrice.js";


const Products = () => {
    const { id } = useParams();
    const categoryIdFromParams = parseInt(id);

    // Filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(categoryIdFromParams || "");
    const [sortOrder, setSortOrder] = useState(""); // "", "asc", "desc"

    // Derivar categorías únicas
    const categories = Array.from(new Set(products.map((p) => p.category)));

    // Productos filtrados y ordenados
    const filteredAndSortedProducts = useMemo(() => {
        let result = products;

        if (selectedCategory !== "") {
            result = result.filter(p => p.category === parseInt(selectedCategory));
        }

        if (searchTerm.trim() !== "") {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortOrder === "asc") {
            result = [...result].sort((a, b) => a.price - b.price);
        } else if (sortOrder === "desc") {
            result = [...result].sort((a, b) => b.price - a.price);
        }

        return result;
    }, [searchTerm, selectedCategory, sortOrder]);

    useEffect(() => {
        if (filteredAndSortedProducts.length === 0) {
            toast.warning("No hay productos disponibles con los filtros aplicados.");
        }
    }, [filteredAndSortedProducts]);

    return (
        <div className="container mx-auto mt-8 px-4">
            {/* Filtros */}
            <div className="mb-6 flex flex-col md:flex-row items-center gap-4 justify-between">
                {/* Búsqueda */}
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border px-4 py-2 rounded-md w-full md:w-1/3"
                />

                {/* Categoría */}
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border px-4 py-2 rounded-md w-full md:w-1/3"
                >
                    <option value="">Todas las categorías</option>
                    {categoriesData.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* Orden */}
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="border px-4 py-2 rounded-md w-full md:w-1/3"
                >
                    <option value="">Ordenar por precio</option>
                    <option value="asc">Menor a mayor</option>
                    <option value="desc">Mayor a menor</option>
                </select>
            </div>

            {/* Productos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {filteredAndSortedProducts.map((product) => (
                    <Link key={product.id} to={`/product/${product.id}`}>
                        <div className="relative w-full h-[32rem] rounded-md overflow-hidden shadow-lg group">
                            <img
                                src={product.image[0]}
                                alt={`Imagen de ${product.name}`}
                                className={`w-full h-full object-cover rounded-md transition-all duration-300 
                                ${product.stock === 0 ? "brightness-10" : "brightness-100 md:brightness-50 md:group-hover:brightness-100"}`}
                            />

                            {/* Overlay de información */}
                            <div className="absolute bottom-0 left-0 w-full bg-[#a5732db5] bg-opacity-60 text-white px-4 py-4">
                                <h2 className="text-xl font-semibold truncate">{product.name}</h2>
                                <p className="text-lg font-medium">{formatPrice(product.price)}</p>
                                <p className="text-sm mt-1 truncate">{product.description}</p>
                            </div>

                            {/* Overlay "Sin stock" */}
                            {product.stock === 0 && (
                                <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center text-white text-2xl font-bold">
                                    Sin stock
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Products;

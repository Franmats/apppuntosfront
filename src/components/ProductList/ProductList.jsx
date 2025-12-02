import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductList.css";

const apiUrl = import.meta.env.VITE_API_URL;

const formatCategoryLabel = (category) => {
  if (!category) return "";
  if (category === "canjes") return "Canjes";
  if (category === "ofertas") return "Ofertas";
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // 🔥 para el modal
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/products/${category}`);
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        const data = await response.json();
        console.log("Productos obtenidos:", data);
        setProducts(data);
        setError(null);
        setSelectedProduct(null); // reset modal al cambiar categoría
      } catch (err) {
        setError("Error al cargar los productos");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <section className="promotions-section">
          <p className="error-message">{error}</p>
          <div className="bottom-buttons">
            <button className="close-button" onClick={() => navigate(-1)}>
              Volver
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header reutilizando el estilo general */}
      <header className="header">
        <div className="logo-container">
          <img src="/shopicon.png" alt="Logo" />
          <h1>Cerutti Deportes</h1>
        </div>
        <p className="welcome">
          {category === "canjes"
            ? "Elegí el producto que querés canjear con tus puntos"
            : "Mirá los productos disponibles en esta categoría"}
        </p>
      </header>

      {/* Sección principal con mismo estilo que promociones */}
      <section className="promotions-section products-section">
        <h2 className="promotions-title">
          {category === "canjes"
            ? "Productos para canjear"
            : `Productos - ${formatCategoryLabel(category)}`}
        </h2>

        {products.length === 0 ? (
          <p className="no-products">
            No hay productos disponibles en esta categoría.
          </p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <article
                key={product._id}
                className="product-card"
                onClick={() => handleProductClick(product)}
              >
                {product.image && (
                  <div className="product-image-wrapper">
                    <img
                      src={`/${product.image}`}
                      alt={product.name}
                      className="product-image"
                    />
                  </div>
                )}

                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>

                  {product.description && (
                    <p className="product-description">
                      {product.description}
                    </p>
                  )}

                  <p className="product-price">
                    {product.price != null
                      ? `$${product.price.toLocaleString("es-AR")}`
                      : "$0"}
                  </p>

                  <p className="product-points">
                    {(product.puntos ?? 0).toLocaleString("es-AR")} puntos
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* MODAL MOBILE: detalle del producto seleccionado */}
      {selectedProduct && (
        <div className="product-modal-overlay" onClick={handleCloseModal}>
          <div
            className="product-modal"
            onClick={(e) => e.stopPropagation()} // evita cerrar al tocar dentro
          >
            <div className="product-modal-header">
              <h3 className="product-modal-title">{selectedProduct.name}</h3>
              <button
                className="product-modal-close"
                type="button"
                onClick={handleCloseModal}
              >
                ✕
              </button>
            </div>

            {selectedProduct.image && (
              <div className="product-modal-image-wrapper">
                <img
                  src={`/${selectedProduct.image}`}
                  alt={selectedProduct.name}
                  className="product-modal-image"
                />
              </div>
            )}

            <div className="product-modal-body">
              {selectedProduct.description && (
                <p className="product-modal-description">
                  {selectedProduct.description}
                </p>
              )}

              <p className="product-modal-price">
                Precio:{" "}
                {selectedProduct.price != null
                  ? `$${selectedProduct.price.toLocaleString("es-AR")}`
                  : "$0"}
              </p>

              <p className="product-modal-points">
                Necesitás{" "}
                {(selectedProduct.puntos ?? 0).toLocaleString("es-AR")} puntos
              </p>

              <button
                className="button-1 product-modal-main-button"
                type="button"
                onClick={() => navigate("/comercios")}
              >
                Buscar dónde canjear
              </button>

              <button
                className="settings-button product-modal-secondary-button"
                type="button"
                onClick={handleCloseModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bottom-buttons">
        <button className="close-button" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    </div>
  );
};

export default ProductList;
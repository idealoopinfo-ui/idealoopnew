import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./ProductDetailPage.css";

export default function ProductDetailPage() {

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {

    const fetchProduct = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.log(error);
        setLoading(false);
        return;
      }

      setProduct(data);

      // set default image
      setSelectedImage(data.image_url);

      setLoading(false);
    };

    fetchProduct();

  }, [id]);

  if (loading) {
    return (
      <div className="product-status">
        <div className="loading-spinner"></div>
        <span>Loading product...</span>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="product-status">
        Product not found
      </div>
    );
  }

  // IMAGE ARRAY (based on your DB structure)
  const images = [
    product.image_url,
    product.image2_url,
    product.image3_url,
  ].filter(Boolean);

  return (
    <div className="product-detail-page">

      {/* LEFT SIDE */}
      <div className="product-detail-left">

  <div className="image-wrapper">
    <img
      src={selectedImage}
      alt={product.title}
      className="product-detail-image"
    />
  </div>

  {images.length > 0 && (
    <div className="thumbnails">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt="thumbnail"
          className={`thumb ${selectedImage === img ? "active" : ""}`}
          onClick={() => setSelectedImage(img)}
        />
      ))}
    </div>
  )}
     
      </div>

      {/* RIGHT SIDE */}
      <div className="product-detail-right">

        {/* TITLE */}
      <h1 className="product-title">{product.title}</h1>

      {/* PRODUCT ID */}
      {product.product_id && (
      <p className="product-id">{product.product_id}</p>
      )}

        {/* SHORT DESCRIPTION (optional) */}
        {product.short_description && (
          <p className="product-short-desc">
            {product.short_description}
          </p>
        )}

        {/* FULL DESCRIPTION */}
        <p className="product-description">
          {product.description}
        </p>

        {/* FEATURES */}
        {product.description_points?.length > 0 && (
          <ul className="product-features">
            {product.description_points.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}

        {/* BUTTON */}
        {product.amazon_url && (
          <a href={product.amazon_url} target="_blank" rel="noreferrer">
            <button className="amazon-btn">
              Shop Now
            </button>
          </a>
        )}

      </div>

    </div>
  );
}
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { supabase } from "../../lib/supabaseClient";

import "./ProductDetailPage.css";

export default function ProductDetailPage() {

  const { id } = useParams();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /* =========================
     FETCH PRODUCT
  ========================= */
  useEffect(() => {

    const fetchProduct = async () => {

      setLoading(true);

      const { data, error } =
        await supabase
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

      setLoading(false);
    };

    fetchProduct();

  }, [id]);

  /* =========================
     LOADING
  ========================= */
  if (loading) {

    return (
      <div className="product-loading">
        Loading product...
      </div>
    );
  }

  /* =========================
     NOT FOUND
  ========================= */
  if (!product) {

    return (
      <div className="product-loading">
        Product not found
      </div>
    );
  }

  return (

    <div className="product-detail-page">

      {/* LEFT SIDE */}
      <div className="product-detail-left">

        <img
          src={
            product.image_url ||
            "https://via.placeholder.com/400"
          }

          alt={product.title}

          className="product-detail-image"
        />

      </div>

    {/* RIGHT SIDE */}
<div className="product-detail-right">

{/* TITLE */}
<h1 className="product-title">
  {product.title}
</h1>

{/* PRODUCT ID */}
{product.product_id && (
  <div className="product-id">
    Product ID: {product.product_id}
  </div>
)}

{/* DESCRIPTION */}
<p className="product-description">
  {product.short_description}
</p>

        {/* FEATURES */}
        {product.description_points?.length > 0 && (

          <ul className="product-features">

            {product.description_points.map(
              (item, i) => (

                <li key={i}>
                  ✔ {item}
                </li>

              )
            )}

          </ul>

        )}

        {/* AMAZON BUTTON */}
        {product.amazon_url && (

          <a
            href={product.amazon_url}
            target="_blank"
            rel="noreferrer"
          >
            <button className="amazon-btn">
              Shop on Amazon
            </button>
          </a>

        )}

      </div>

    </div>
  );
}
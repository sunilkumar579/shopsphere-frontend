import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  api,
  messageOf,
} from "../lib/api";

import type {
  Product,
} from "../types";

import {
  useApp,
} from "../context/AppContext";

import Spinner from "../components/Spinner";
import ProductCard from "../components/ProductCard";


export default function ProductDetail() {

  const { id } =
    useParams();

  const [
    product,
    setProduct,
  ] = useState<Product | null>(
    null
  );

  const [
    related,
    setRelated,
  ] = useState<Product[]>([]);

  const [
    qty,
    setQty,
  ] = useState(1);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const {
    user,
    wishlist,
    addToCart,
    toggleWishlist,
  } = useApp();

  const nav =
    useNavigate();


  /*
   * =========================================================
   * LOAD PRODUCT
   * =========================================================
   */

  useEffect(() => {

    let cancelled = false;

    Promise.all([
      api.get(
        `/products/${id}`
      ),

      api.get(
        "/products",
        {
          params: {
            category: "",
            page: 0,
            size: 8,
            sort: "rating",
          },
        }
      ),
    ])
      .then(
        ([
          productResponse,
          all,
        ]) => {

          if (cancelled) {
            return;
          }

          setProduct(
            productResponse.data
          );

          setRelated(
            (
              all.data.content as Product[]
            )
              .filter(
                (item) =>
                  item.id !==
                  Number(id)
              )
              .slice(0, 4)
          );

        }
      )
      .catch((error) => {

        console.error(
          "Unable to load product",
          error
        );

      })
      .finally(() => {

        if (!cancelled) {
          setLoading(false);
        }

      });

    return () => {
      cancelled = true;
    };

  }, [id]);


  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return <Spinner />;
  }


  /*
   * =========================================================
   * NOT FOUND
   * =========================================================
   */

  if (!product) {

    return (
      <div className="container empty-state">

        <h2>
          Product not found
        </h2>

        <Link
          className="primary-btn"
          to="/products"
        >
          Back to shop
        </Link>

      </div>
    );

  }


  const discount =
    Math.round(
      (
        1 -
        product.price /
          product.originalPrice
      ) * 100
    );


  const liked =
    wishlist.some(
      (item) =>
        item.id === product.id
    );


  /*
   * =========================================================
   * ADD TO BAG
   * =========================================================
   */

  const add = async () => {

    if (!user) {

      nav(
        "/login?next=" +
          encodeURIComponent(
            window.location.pathname
          )
      );

      return;
    }

    try {

      await addToCart(
        product.id,
        qty
      );

      nav("/cart");

    } catch (error) {

      alert(
        messageOf(error)
      );

    }

  };


  /*
   * =========================================================
   * WISHLIST
   * =========================================================
   */

  const wish = async () => {

    if (!user) {

      nav(
        "/login?next=" +
          encodeURIComponent(
            window.location.pathname
          )
      );

      return;
    }

    try {

      await toggleWishlist(
        product.id
      );

    } catch (error) {

      console.error(
        "Unable to update wishlist",
        error
      );

    }

  };


  /*
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <main
      className="container detail-page"
    >

      <div className="breadcrumbs">

        Home / Clothing /{" "}
        {product.name}

      </div>


      <div className="detail-grid">

        {/* PRODUCT IMAGE */}

        <div className="detail-image">

          <img
            src={product.imageUrl}
            alt={product.name}
          />

          {product.badge && (

            <span className="badge">
              {product.badge}
            </span>

          )}

        </div>


        {/* PRODUCT DETAILS */}

        <div className="detail-copy">

          <div className="product-brand">
            {product.brand}
          </div>


          <h1>
            {product.name}
          </h1>


          <p className="detail-desc">
            {product.description}
          </p>


          <div className="rating-row big">

            <span className="rating-chip">

              {product.rating.toFixed(1)}

              <Star
                size={14}
                fill="currentColor"
              />

            </span>


            <span className="reviews">

              {product.reviewCount.toLocaleString(
                "en-IN"
              )}{" "}
              verified ratings

            </span>

          </div>


          <div className="detail-price">

            <strong>

              ₹
              {product.price.toLocaleString(
                "en-IN"
              )}

            </strong>


            <del>

              ₹
              {product.originalPrice.toLocaleString(
                "en-IN"
              )}

            </del>


            <span>
              {discount}% OFF
            </span>

          </div>


          {product.sizeInfo && (

            <div className="detail-meta">

              <strong>
                Size
              </strong>

              <span>
                {product.sizeInfo}
              </span>

            </div>

          )}


          {product.color && (

            <div className="detail-meta">

              <strong>
                Colour
              </strong>

              <span>
                {product.color}
              </span>

            </div>

          )}


          <div className="qty-row">

            <strong>
              Quantity
            </strong>


            <div className="qty-control">

              <button
                onClick={() =>
                  setQty(
                    Math.max(
                      1,
                      qty - 1
                    )
                  )
                }
                type="button"
              >
                <Minus size={16} />
              </button>


              <span>
                {qty}
              </span>


              <button
                onClick={() =>
                  setQty(
                    Math.min(
                      product.stock,
                      qty + 1
                    )
                  )
                }
                type="button"
              >
                <Plus size={16} />
              </button>

            </div>


            <small>
              {product.stock} left
            </small>

          </div>


          <div className="detail-actions">

            <button
              className="primary-btn grow"
              onClick={add}
              type="button"
            >
              <ShoppingBag />
              Add to bag
            </button>


            <button
              className={`secondary-btn wish-large ${
                liked
                  ? "liked"
                  : ""
              }`}
              onClick={wish}
              type="button"
            >

              <Heart
                fill={
                  liked
                    ? "currentColor"
                    : "none"
                }
              />

              {liked
                ? "Saved"
                : "Wishlist"}

            </button>

          </div>


          <div className="benefit-box">

            <div>

              <Truck />

              <span>

                <b>
                  Fast delivery
                </b>

                <small>
                  Usually delivered in
                  2–5 days
                </small>

              </span>

            </div>


            <div>

              <ShieldCheck />

              <span>

                <b>
                  Secure payments
                </b>

                <small>
                  Your payment information
                  is protected
                </small>

              </span>

            </div>


            <div>

              <RotateCcw />

              <span>

                <b>
                  Easy returns
                </b>

                <small>
                  7-day returns on eligible
                  products
                </small>

              </span>

            </div>

          </div>

        </div>

      </div>


      {related.length > 0 && (

        <section className="section related">

          <div className="section-head">

            <div>

              <span className="eyebrow">
                YOU MAY ALSO LIKE
              </span>

              <h2>
                More to explore
              </h2>

            </div>

          </div>


          <div className="product-grid">

            {related.map(
              (relatedProduct) => (

                <ProductCard
                  key={
                    relatedProduct.id
                  }
                  product={
                    relatedProduct
                  }
                />

              )
            )}

          </div>

        </section>

      )}

    </main>
  );
}

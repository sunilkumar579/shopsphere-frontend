import {
  Heart,
  ShoppingBag,
  Star,
  Check,
  Package,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";


import type { Product } from "../types";

import {
  useApp,
} from "../context/AppContext";

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const {
    user,
    wishlist,
    addToCart,
    toggleWishlist,
  } = useApp();

  const navigate = useNavigate();

  const [adding, setAdding] = useState(false);
  const [packing, setPacking] = useState(false);
  const [added, setAdded] = useState(false);

  const liked = wishlist.some(
    (item) => item.id === product.id
  );

  const discount = Math.round(
    (1 - product.price / product.originalPrice) * 100
  );

  /*
   * Find the currently visible Bag icon.
   */
  const getVisibleBag = (): HTMLElement | null => {
    const bags = Array.from(
      document.querySelectorAll(
        '[data-bag-target="true"]'
      )
    ) as HTMLElement[];

    for (const bag of bags) {
      const rect =
        bag.getBoundingClientRect();

      const style =
        window.getComputedStyle(bag);

      const visible =
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0";

      if (visible) {
        return bag;
      }
    }

    return null;
  };

  /*
   * Strong, visible product-to-bag animation.
   */
  const packThenFlyToBag = (
    button: HTMLButtonElement
  ): Promise<void> => {
    return new Promise((resolve) => {
      const card =
        button.closest(".product-card");

      const image =
        card?.querySelector(
          ".product-image-wrap img"
        ) as HTMLImageElement | null;

      const bag = getVisibleBag();

      if (!image || !bag) {
        resolve();
        return;
      }

      const imageRect =
        image.getBoundingClientRect();

      /*
       * Outer parcel.
       */
      const parcel =
        document.createElement("div");

      parcel.className =
        "pack-flight";

      parcel.style.left =
        `${imageRect.left}px`;

      parcel.style.top =
        `${imageRect.top}px`;

      parcel.style.width =
        `${imageRect.width}px`;

      parcel.style.height =
        `${imageRect.height}px`;

      /*
       * Product image inside parcel.
       */
      const parcelImage =
        image.cloneNode(
          true
        ) as HTMLImageElement;

      parcelImage.className =
        "pack-product-image";

      /*
       * Packaging panels.
       */
      const top =
        document.createElement("div");

      top.className =
        "pack-panel pack-top";

      const bottom =
        document.createElement("div");

      bottom.className =
        "pack-panel pack-bottom";

      const left =
        document.createElement("div");

      left.className =
        "pack-panel pack-left";

      const right =
        document.createElement("div");

      right.className =
        "pack-panel pack-right";

      /*
       * Tape across the parcel.
       */
      const tape =
        document.createElement("div");

      tape.className =
        "pack-tape";

      /*
       * Packed label.
       */
      const label =
        document.createElement("div");

      label.className =
        "pack-label";

      label.textContent =
        "PACKED";

      parcel.appendChild(
        parcelImage
      );

      parcel.appendChild(top);
      parcel.appendChild(bottom);
      parcel.appendChild(left);
      parcel.appendChild(right);
      parcel.appendChild(tape);
      parcel.appendChild(label);

      document.body.appendChild(
        parcel
      );

      /*
       * STEP 1
       *
       * Product lifts slightly.
       */
      const liftAnimation =
        parcel.animate(
          [
            {
              transform:
                "translate3d(0,0,0) " +
                "scale(1) " +
                "rotateX(0deg) " +
                "rotateZ(0deg)",
            },
            {
              transform:
                "translate3d(0,-14px,80px) " +
                "scale(1.06) " +
                "rotateX(8deg) " +
                "rotateZ(-2deg)",
            },
          ],
          {
            duration: 350,
            easing:
              "cubic-bezier(.2,.8,.2,1)",
            fill: "forwards",
          }
        );

      liftAnimation.finished
        .then(() => {
          /*
           * Reset the lift before packaging.
           */
          liftAnimation.cancel();

          /*
           * STEP 2
           *
           * Close the packaging around product.
           */
          parcel.classList.add("is-expanding");

          return new Promise<void>((expandResolve) => {
            setTimeout(() => {
              parcel.classList.remove("is-expanding");
              parcel.classList.add("is-packing");
              setTimeout(expandResolve, 820);
            }, 280);
          });
        })
        .then(() => {
          /*
           * STEP 3
           *
           * Product is now visibly packed.
           */
          parcel.classList.add(
            "is-packed"
          );

          return new Promise<void>(
            (packedResolve) => {
              setTimeout(
                packedResolve,
                300
              );
            }
          );
        })
        .then(() => {
          /*
           * Get the bag position AFTER
           * packaging has finished.
           */
          const targetBag =
            getVisibleBag() || bag;

          const bagRect =
            targetBag.getBoundingClientRect();

          const deltaX =
            bagRect.left +
            bagRect.width / 2 -
            (
              imageRect.left +
              imageRect.width / 2
            );

          const deltaY =
            bagRect.top +
            bagRect.height / 2 -
            (
              imageRect.top +
              imageRect.height / 2
            );

          /*
           * STEP 4
           *
           * The PACKED PARCEL flies to Bag.
           */
          const flight =
            parcel.animate(
              [
                {
                  transform:
                    "translate3d(0,0,0) " +
                    "scale(1) " +
                    "rotateX(0deg) " +
                    "rotateY(0deg) " +
                    "rotateZ(0deg)",

                  opacity: 1,
                },

                {
                  transform:
                    `translate3d(${deltaX * 0.3}px, ${deltaY * 0.15 - 90}px, 160px) ` +
                    "scale(.72) " +
                    "rotateX(22deg) " +
                    "rotateY(-25deg) " +
                    "rotateZ(-12deg)",

                  opacity: 1,
                },

                {
                  transform:
                    `translate3d(${deltaX * 0.72}px, ${deltaY * 0.72}px, 70px) ` +
                    "scale(.35) " +
                    "rotateX(48deg) " +
                    "rotateY(30deg) " +
                    "rotateZ(15deg)",

                  opacity: .9,
                },

                {
                  transform:
                    `translate3d(${deltaX}px, ${deltaY}px, 0) ` +
                    "scale(.08) " +
                    "rotateX(75deg) " +
                    "rotateY(40deg) " +
                    "rotateZ(25deg)",

                  opacity: .08,
                },
              ],
              {
                duration: 900,
                easing:
                  "cubic-bezier(.16,.76,.24,1)",
                fill: "forwards",
              }
            );

          return flight.finished.then(
            () => {
              createBagSuccessEffect(
                targetBag
              );

              parcel.remove();

              /*
               * Tell Header to open the Bag Drawer
               * after the parcel reaches the Bag.
               */
              window.dispatchEvent(
                new CustomEvent(
                  "open-bag-drawer"
                )
              );

              resolve();
            }
          );
        })
        .catch(() => {
          parcel.remove();
          resolve();
        });
    });
  };

  /*
   * Small visual confirmation at the Bag.
   */
  const createBagSuccessEffect = (
    bag: HTMLElement
  ) => {
    bag.classList.add(
      "bag-receiving"
    );

    const success =
      document.createElement("div");

    success.className =
      "bag-success-check";

    success.innerHTML =
      "✓";

    const bagRect =
      bag.getBoundingClientRect();

    success.style.left =
      `${bagRect.left + bagRect.width / 2}px`;

    success.style.top =
      `${bagRect.top - 8}px`;

    document.body.appendChild(
      success
    );

    setTimeout(() => {
      bag.classList.remove(
        "bag-receiving"
      );
    }, 850);

    setTimeout(() => {
      success.remove();
    }, 1000);
  };

  const handleAddToBag = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    // IMPORTANT:
    // Save the button BEFORE the await.
    // After await, event.currentTarget may no longer be available.
    const clickedButton = event.currentTarget;

    if (!user) {
      navigate(
        "/login?next=" +
          encodeURIComponent(
            `/product/${product.id}`
          )
      );

      return;
    }

    if (
      product.stock === 0 ||
      adding ||
      packing ||
      added
    ) {
      return;
    }

    setAdding(true);

    try {
      // 1. Actually add the product to cart
      await addToCart(product.id);

      // 2. Now animate using the saved button
      setPacking(true);

      await packThenFlyToBag(
        clickedButton
      );

      setPacking(false);

      // 3. Change button state
      setAdded(true);

      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: "Added to bag",
        })
      );

      // 4. Return button to normal
      setTimeout(() => {
        setAdded(false);
      }, 2200);
    } catch (error) {
      console.error(
        "Unable to add product to bag",
        error
      );

      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: "Unable to add to bag",
        })
      );
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      navigate(
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

      window.dispatchEvent(
        new CustomEvent(
          "toast",
          {
            detail: liked
              ? "Removed from wishlist"
              : "Added to wishlist",
          }
        )
      );
    } catch (error) {
      console.error(
        "Unable to update wishlist",
        error
      );
    }
  };

  return (
    <article
      className={`product-card ${
        added
          ? "product-card-added"
          : ""
      }`}
    >
      <Link
        to={`/product/${product.id}`}
        className="product-image-wrap"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          data-product-image={product.id}
        />

        <div className="image-overlay" />

        {product.stock > 0 && (
          <div className="delivery-pill">
            🚚 Fast delivery
          </div>
        )}
      </Link>

      <button
        className={`wish-fab ${
          liked
            ? "liked"
            : ""
        }`}
        onClick={handleWishlist}
        aria-label={
          liked
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        type="button"
      >
        <Heart
          fill={
            liked
              ? "currentColor"
              : "none"
          }
        />
      </button>

      {product.badge && (
        <div className="badge">
          {product.badge}
        </div>
      )}

      <div className="product-content">
        <div className="product-brand">
          {product.brand}
        </div>

        <Link
          to={`/product/${product.id}`}
          className="product-name"
        >
          {product.name}
        </Link>

        <div className="rating-row">
          <span className="rating-chip">
            {product.rating.toFixed(1)}
            <Star
              size={12}
              fill="currentColor"
            />
          </span>

          <span className="reviews">
            {product.reviewCount.toLocaleString()}{" "}
            reviews
          </span>
        </div>

        <div className="price-row">
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
            {discount}% off
          </span>
        </div>

        {product.stock > 0 &&
          product.stock <= 5 && (
            <div className="stock-warning">
              Only {product.stock} left
            </div>
          )}

        <button
          className={`add-btn ${
            added
              ? "added-btn"
              : ""
          } ${
            adding
              ? "adding-btn"
              : ""
          }`}
          disabled={
            product.stock === 0 ||
            adding ||
            packing ||
            added
          }
          onClick={handleAddToBag}
          type="button"
        >
          {added ? (
            <>
              <Check size={17} />
              Added to bag
            </>
          ) : packing ? (
            <>
              <Package size={17} />
              Packing...
            </>
          ) : adding ? (
            <>
              <span className="button-spinner" />
              Adding...
            </>
          ) : product.stock === 0 ? (
            <>
              <ShoppingBag size={17} />
              Out of stock
            </>
          ) : (
            <>
              <ShoppingBag size={17} />
              Add to bag
            </>
          )}
        </button>
      </div>
    </article>
  );
}

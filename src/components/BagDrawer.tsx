import {
  X,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Trash2,
} from "lucide-react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useApp } from "../context/AppContext";

type BagDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function BagDrawer({
  open,
  onClose,
}: BagDrawerProps) {
  const {
    user,
    cart,
    updateCart,
    removeCart,
  } = useApp();

  const navigate = useNavigate();

  /*
   * Prevent the page behind the drawer
   * from scrolling.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const items = cart?.items ?? [];

  const subtotal =
    cart?.subtotal ?? 0;

  /*
   * Increase quantity.
   */
  const increaseQuantity = async (
    productId: number,
    quantity: number
  ) => {
    try {
      await updateCart(
        productId,
        quantity + 1
      );
    } catch (error) {
      console.error(
        "Unable to increase quantity",
        error
      );
    }
  };

  /*
   * Decrease quantity.
   */
  const decreaseQuantity = async (
    productId: number,
    quantity: number
  ) => {
    try {
      if (quantity <= 1) {
        await removeCart(productId);
        return;
      }

      await updateCart(
        productId,
        quantity - 1
      );
    } catch (error) {
      console.error(
        "Unable to decrease quantity",
        error
      );
    }
  };

  /*
   * Remove item completely.
   */
  const deleteItem = async (
    productId: number
  ) => {
    try {
      await removeCart(productId);
    } catch (error) {
      console.error(
        "Unable to remove product",
        error
      );
    }
  };

  /*
   * Open the full cart page.
   */
  const handleViewBag = () => {
    onClose();
    navigate("/cart");
  };

  /*
   * Open checkout.
   */
  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <div className="bag-drawer-layer">
      {/* Dark background */}
      <button
        className="bag-drawer-backdrop"
        onClick={onClose}
        type="button"
        aria-label="Close shopping bag"
      />

      {/* Drawer */}
      <aside
        className="bag-drawer"
        aria-label="Shopping bag"
      >
        {/* Drawer header */}
        <div className="bag-drawer-header">
          <div>
            <div className="bag-drawer-title">
              Your Bag
            </div>

            <div className="bag-drawer-count">
              {cart?.itemCount ?? 0}{" "}
              {cart?.itemCount === 1
                ? "item"
                : "items"}
            </div>
          </div>

          <button
            className="bag-drawer-close"
            onClick={onClose}
            type="button"
            aria-label="Close shopping bag"
          >
            <X size={21} />
          </button>
        </div>

        {/* Empty bag */}
        {items.length === 0 ? (
          <div className="bag-empty">
            <div className="bag-empty-icon">
              <ShoppingBag size={30} />
            </div>

            <h3>
              Your bag is empty
            </h3>

            <p>
              Looks like you haven't added
              anything yet.
            </p>

            <button
              className="primary-btn"
              onClick={() => {
                onClose();
                navigate("/products");
              }}
              type="button"
            >
              Start Shopping
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            {/* Bag items */}
            <div className="bag-drawer-items">
              {items.map((item) => (
                <div
                  className="bag-drawer-item"
                  key={item.productId}
                >
                  {/* Product image */}
                  <div className="bag-drawer-image">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                    />
                  </div>

                  {/* Product information */}
                  <div className="bag-drawer-info">
                    <div className="bag-drawer-brand">
                      {item.brand}
                    </div>

                    <div className="bag-drawer-name">
                      {item.name}
                    </div>

                    <div className="bag-drawer-price">
                      ₹
                      {item.price.toLocaleString(
                        "en-IN"
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="bag-drawer-actions">
                      <div className="drawer-qty">
                        <button
                          onClick={() =>
                            decreaseQuantity(
                              item.productId,
                              item.quantity
                            )
                          }
                          type="button"
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          <Minus size={13} />
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(
                              item.productId,
                              item.quantity
                            )
                          }
                          type="button"
                          aria-label={`Increase quantity for ${item.name}`}
                          disabled={
                            item.quantity >=
                            item.stock
                          }
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        className="drawer-remove"
                        onClick={() =>
                          deleteItem(
                            item.productId
                          )
                        }
                        type="button"
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Item total */}
                  <div className="bag-drawer-line-total">
                    ₹
                    {item.lineTotal.toLocaleString(
                      "en-IN"
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bag-drawer-footer">
              <div className="bag-drawer-subtotal">
                <span>
                  Subtotal
                </span>

                <strong>
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div className="bag-drawer-note">
                Taxes and delivery charges are
                calculated at checkout.
              </div>

              <button
                className="bag-drawer-secondary"
                onClick={handleViewBag}
                type="button"
              >
                View Bag
              </button>

              <button
                className="bag-drawer-checkout"
                onClick={handleCheckout}
                type="button"
              >
                Checkout
                <ArrowRight size={17} />
              </button>
            </div>
          </>
        )}

        {!user && (
          <div className="bag-login-note">
            Sign in to save your bag and
            complete your order.
          </div>
        )}
      </aside>
    </div>
  );
}
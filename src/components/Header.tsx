import {
  Heart,
  ShoppingBag,
  UserCircle,
  Search,
  Menu,
  X,
  LogOut,
  Package,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  useApp,
} from "../context/AppContext";

import BagDrawer from "./BagDrawer";

export default function Header() {
  const {
    user,
    cart,
    wishlist,
    logout,
  } = useApp();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    bagOpen,
    setBagOpen,
  ] = useState(false);

  const navigate = useNavigate();

  /*
   * Search
   */
  const submitSearch = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedQuery =
      query.trim();

    if (!trimmedQuery) {
      navigate("/products");
      setSearchOpen(false);
      return;
    }

    navigate(
      `/products?q=${encodeURIComponent(
        trimmedQuery
      )}`
    );

    setSearchOpen(false);
    setMobileOpen(false);
  };

  /*
   * Popular search
   */
  const goToSearch = (
    value: string
  ) => {
    setQuery(value);

    navigate(
      `/products?q=${encodeURIComponent(
        value
      )}`
    );

    setSearchOpen(false);
    setMobileOpen(false);
  };

  /*
   * Logout
   */
  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    setBagOpen(false);
    navigate("/");
  };

  /*
   * Close mobile menu
   */
  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  /*
   * Open bag drawer
   */
  const openBag = (
    event?: React.MouseEvent
  ) => {
    event?.preventDefault();
    event?.stopPropagation();

    setMobileOpen(false);
    setBagOpen(true);
  };

  /*
   * Close bag drawer
   */
  const closeBag = () => {
    setBagOpen(false);
  };

  /*
   * Allows ProductCard animation to tell
   * the Header:
   *
   * "The parcel reached the Bag."
   *
   * The drawer then opens automatically.
   */
  useEffect(() => {
    const handleOpenBag = () => {
      setBagOpen(true);
    };

    window.addEventListener(
      "open-bag-drawer",
      handleOpenBag
    );

    return () => {
      window.removeEventListener(
        "open-bag-drawer",
        handleOpenBag
      );
    };
  }, []);

  return (
    <>
      {/* =====================================================
          TOP PROMOTIONAL STRIP
         ===================================================== */}

      <div className="top-strip">
        <div className="container top-strip-inner">
          <span>
            Free delivery on orders above ₹999
          </span>

          <span className="top-strip-dot">
            •
          </span>

          <span>
            Easy 7-day returns
          </span>

          <span className="top-strip-dot desktop-only">
            •
          </span>

          <span className="desktop-only">
            New pieces, every week
          </span>
        </div>
      </div>

      {/* =====================================================
          MAIN HEADER
         ===================================================== */}

      <header className="site-header">

        <div className="container header-row">

          {/* Mobile hamburger */}

          <button
            className="icon-btn mobile-menu-btn"
            onClick={() =>
              setMobileOpen(
                (value) => !value
              )
            }
            aria-label={
              mobileOpen
                ? "Close navigation"
                : "Open navigation"
            }
            type="button"
          >
            {mobileOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

          {/* Logo */}

          <Link
            to="/"
            className="logo"
            onClick={() => {
              closeMobileMenu();
              setBagOpen(false);
            }}
            aria-label="Morrow Studio home"
          >
            <span>MORROW</span>
            <strong>STUDIO</strong>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
             ================================================= */}

          <nav className="main-nav desktop-nav">

            <Link to="/products?category=Fashion">
              New in
              <ChevronDown size={13} />
            </Link>
            <Link to="/products?category=Fashion">
              Clothing
              <ChevronDown size={13} />
            </Link>
            <Link to="/products?category=Fashion&sort=rating">
              Bestsellers
            </Link>

            <Link
              to="/products?category=Fashion&sort=priceLow"
              className="nav-deal-link"
            >
              <Sparkles size={14} />
              Under ₹1,000
            </Link>

          </nav>

          {/* =================================================
              DESKTOP SEARCH
             ================================================= */}

          <div className="search-wrapper">

            <form
              className="search"
              onSubmit={submitSearch}
            >

              <Search
                size={18}
                className="search-icon"
              />

              <input
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value
                  )
                }
                onFocus={() =>
                  setSearchOpen(true)
                }
                placeholder="Search clothes, shoes and accessories"
                aria-label="Search products"
              />

              {query && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() =>
                    setQuery("")
                  }
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}

              <button
                type="submit"
                className="search-submit"
              >
                Search
              </button>

            </form>

            {searchOpen && (
              <div
                className="search-suggestions"
                onMouseDown={(event) =>
                  event.preventDefault()
                }
              >

                <div className="search-suggestion-title">
                  Popular searches
                </div>

                <button
                  type="button"
                  onClick={() =>
                    goToSearch("T-shirts")
                  }
                >
                  T-shirts
                </button>

                <button
                  type="button"
                  onClick={() =>
                    goToSearch("Sneakers")
                  }
                >
                  Sneakers
                </button>

                <button
                  type="button"
                  onClick={() =>
                    goToSearch("shirts")
                  }
                >
                  Shirts
                </button>

                <button
                  type="button"
                  onClick={() =>
                    goToSearch("jackets")
                  }
                >
                  Jackets
                </button>

                <button
                  type="button"
                  onClick={() =>
                    goToSearch("denim")
                  }
                >
                  Denim
                </button>

              </div>
            )}

          </div>

          {/* =================================================
              DESKTOP ACTIONS
             ================================================= */}

          <nav className="header-actions desktop-actions">

            {/* Wishlist */}

            <Link
              to="/wishlist"
              className="action-link"
            >
              <span className="action-icon-wrapper">

                <Heart size={21} />

                {user &&
                  wishlist.length > 0 && (
                    <b>
                      {wishlist.length}
                    </b>
                  )}

              </span>

              <span>
                Wishlist
              </span>
            </Link>

            {/* Orders */}

            {user && (
              <Link
                to="/orders"
                className="action-link"
              >
                <Package size={21} />

                <span>
                  Orders
                </span>
              </Link>
            )}

            {/* =================================================
                BAG
               ================================================= */}

            <button
  className="action-link bag-action-button"
  data-bag-target="true"
  onClick={openBag}
  type="button"
  aria-label="Open shopping bag"
>

              <span className="action-icon-wrapper">

                <ShoppingBag size={21} />

                {cart &&
                  cart.itemCount > 0 && (
                    <b>
                      {cart.itemCount}
                    </b>
                  )}

              </span>

              <span>
                Bag
              </span>

            </button>

            {/* Account */}

            {user ? (
              <div className="user-menu">

                <Link
                  to="/profile"
                  className="profile-shortcut"
                >

                  <span className="profile-avatar">
                    {user.name
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                  <span className="profile-name">
                    {user.name.split(
                      " "
                    )[0]}
                  </span>

                </Link>

                <button
                  className="ghost-btn logout"
                  onClick={handleLogout}
                  type="button"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>

              </div>
            ) : (
              <Link
                to="/login"
                className="login-btn"
              >
                <UserCircle size={19} />
                Login
              </Link>
            )}

            {/* Admin */}

            {user?.role === "ADMIN" && (
              <Link
                to="/admin"
                className="admin-link"
              >
                <ShieldCheck size={16} />
                Admin
              </Link>
            )}

          </nav>

        </div>

        {/* =====================================================
            MOBILE SEARCH
           ===================================================== */}

        <div className="container mobile-search-wrapper mobile-only">

          <div className="search-wrapper">

            <form
              className="search"
              onSubmit={submitSearch}
            >

              <Search
                size={18}
                className="search-icon"
              />

              <input
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value
                  )
                }
                placeholder="Search clothes, shoes and accessories"
                aria-label="Search products"
              />

              <button
                type="submit"
                className="mobile-search-submit"
              >
                <Search size={17} />
              </button>

            </form>

          </div>

        </div>

        {/* =====================================================
            MOBILE MENU
           ===================================================== */}

        {mobileOpen && (
          <div className="mobile-menu-panel">

            <div className="container mobile-menu-inner">

              {user ? (
                <div className="mobile-user-card">

                  <div className="profile-avatar large">
                    {user.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>

                    <div className="mobile-user-name">
                      {user.name}
                    </div>

                    <div className="mobile-user-email">
                      {user.email}
                    </div>

                  </div>

                </div>
              ) : (
                <Link
                  to="/login"
                  className="mobile-login-card"
                  onClick={
                    closeMobileMenu
                  }
                >
                  <UserCircle size={22} />

                  <span>
                    Login / Create Account
                  </span>
                </Link>
              )}

              {/* Shop section */}

              <div className="mobile-menu-section">

                <div className="mobile-menu-heading">
                  Shop
                </div>

                <Link
                  to="/products"
                  onClick={
                    closeMobileMenu
                  }
                >
                  Shop all clothing
                </Link>

                <Link
                  to="/products?category=Fashion"
                  onClick={
                    closeMobileMenu
                  }
                >
                  New arrivals
                </Link>

                <Link
                  to="/products?category=Fashion&sort=rating"
                  onClick={
                    closeMobileMenu
                  }
                >
                  Bestsellers
                </Link>

                <Link
                  to="/products?category=Fashion&sort=priceLow"
                  onClick={
                    closeMobileMenu
                  }
                >
                  Under ₹1,000
                </Link>

              </div>

              {/* Account section */}

              <div className="mobile-menu-section">

                <div className="mobile-menu-heading">
                  Your account
                </div>

                {user && (
                  <>
                    <Link
                      to="/profile"
                      onClick={
                        closeMobileMenu
                      }
                    >
                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={
                        closeMobileMenu
                      }
                    >
                      My Orders
                    </Link>
                  </>
                )}

                <Link
                  to="/wishlist"
                  onClick={
                    closeMobileMenu
                  }
                >
                  Wishlist

                  {user &&
                    wishlist.length > 0 && (
                      <span className="mobile-count">
                        {wishlist.length}
                      </span>
                    )}
                </Link>

                {/* Mobile menu Bag */}

                <Link
                  to="/cart"
                  onClick={openBag}
                >
                  Shopping Bag

                  {cart &&
                    cart.itemCount > 0 && (
                      <span className="mobile-count">
                        {cart.itemCount}
                      </span>
                    )}
                </Link>

                {user?.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    onClick={
                      closeMobileMenu
                    }
                  >
                    <ShieldCheck size={17} />
                    Admin Dashboard
                  </Link>
                )}

              </div>

              {user && (
                <button
                  className="mobile-logout-btn"
                  onClick={handleLogout}
                  type="button"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              )}

            </div>

          </div>
        )}

        {/* =====================================================
            DESKTOP CATEGORY STRIP
           ===================================================== */}

        <div className="category-nav desktop-only">

          <div className="container category-row">

            <Link to="/products?category=Fashion">
              NEW IN
            </Link>

            <Link to="/products?category=Fashion">
              CLOTHING
            </Link>

            <Link to="/products?category=Fashion&sort=rating">
              BESTSELLERS
            </Link>

            <Link to="/products?category=Fashion&sort=priceLow">
              UNDER ₹1,000
            </Link>

          </div>

        </div>

      </header>

      {/* =======================================================
          MOBILE BOTTOM NAVIGATION
         ======================================================= */}

      <nav className="mobile-bottom-nav mobile-only">

        <Link
          to="/"
          onClick={
            closeMobileMenu
          }
        >
          <span>⌂</span>
          <small>Home</small>
        </Link>

        <Link
          to="/products"
          onClick={
            closeMobileMenu
          }
        >
          <Search size={19} />
          <small>Shop</small>
        </Link>

        <Link
          to="/wishlist"
          onClick={
            closeMobileMenu
          }
        >
          <span className="bottom-nav-icon">

            <Heart size={19} />

            {user &&
              wishlist.length > 0 && (
                <b>
                  {wishlist.length}
                </b>
              )}

          </span>

          <small>Wishlist</small>
        </Link>

        {/* Mobile bottom Bag */}

        <button
  className="mobile-bottom-bag"
  data-bag-target="true"
  onClick={openBag}
  type="button"
  aria-label="Open shopping bag"
>

          <span className="bottom-nav-icon">

            <ShoppingBag size={19} />

            {cart &&
              cart.itemCount > 0 && (
                <b>
                  {cart.itemCount}
                </b>
              )}

          </span>

          <small>
            Bag
          </small>

        </button>

        <Link
          to={
            user
              ? "/profile"
              : "/login"
          }
          onClick={
            closeMobileMenu
          }
        >
          <UserCircle size={19} />
          <small>Account</small>
        </Link>

      </nav>

      {/* =======================================================
          BAG DRAWER
         ======================================================= */}

      <BagDrawer
        open={bagOpen}
        onClose={closeBag}
      />

    </>
  );
}

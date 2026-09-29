import { ArrowRight, Truck, ShieldCheck, RotateCcw, Ruler } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { api } from '../lib/api';
import type { Product } from '../types';

const edits = [
  ['Everyday layers', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85'],
  ['The denim edit', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=85'],
  ['Weekend dressing', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=85'],
  ['Finishing touches', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85'],
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/featured')
      .then((response) => setProducts(response.data.filter((product: Product) => product.category === 'Fashion')))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return <main>
    <section className="hero fashion-hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">A NEW SEASON, YOUR WAY</span>
          <h1>Getting dressed<br />should feel <em>like you.</em></h1>
          <p>Considered clothes for real life. Find the pieces you reach for, wear on repeat, and make your own.</p>
          <div className="hero-cta">
            <Link className="primary-btn" to="/products?category=Fashion">Shop the collection <ArrowRight size={18} /></Link>
            <Link className="text-link" to="/products?category=Fashion&sort=newest">Discover new arrivals</Link>
          </div>
          <div className="fashion-hero-note">Easy pieces. Better outfits. More you.</div>
        </div>
        <div className="hero-art"><img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=90" alt="Model wearing a modern seasonal look" /></div>
      </div>
    </section>

    <section className="container trust-row fashion-trust">
      <div><Truck /><span><strong>Complimentary delivery</strong><small>On orders over ₹999</small></span></div>
      <div><RotateCcw /><span><strong>Easy returns</strong><small>Try it on at home</small></span></div>
      <div><Ruler /><span><strong>Made for your fit</strong><small>Size details on every piece</small></span></div>
      <div><ShieldCheck /><span><strong>Thoughtful quality</strong><small>Pieces worth keeping</small></span></div>
    </section>

    <section className="container section fashion-edits">
      <div className="section-head"><div><span className="eyebrow">DRESS FOR THE DAYS AHEAD</span><h2>Find your kind of style</h2></div><Link className="text-link" to="/products?category=Fashion">Explore everything <ArrowRight size={16} /></Link></div>
      <div className="category-grid">{edits.map(([name, image]) => <Link key={name} to="/products?category=Fashion" className="category-card"><img src={image} alt="" /><div><span>{name}</span><ArrowRight size={18} /></div></Link>)}</div>
    </section>

    <section className="section tint fashion-featured"><div className="container">
      <div className="section-head"><div><span className="eyebrow">THE PIECES YOU LOVE</span><h2>In good company</h2></div><Link className="text-link" to="/products?category=Fashion&sort=rating">Shop bestsellers <ArrowRight size={16} /></Link></div>
      {loading ? <Spinner /> : products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p className="fashion-empty">New favourites are on their way. Browse the collection to find your next go-to.</p>}
    </div></section>

    <section className="container promo fashion-promo"><div><span className="eyebrow">A LITTLE MORE ROOM TO PLAY</span><h2>Good outfits begin with the pieces you love.</h2><p>Explore relaxed essentials, everyday favourites, and the details that make a look yours.</p><Link className="primary-btn" to="/products?category=Fashion">Find your next favourite <ArrowRight size={18} /></Link></div><div className="promo-note"><div>WEAR</div><span>what feels like you</span></div></section>
  </main>;
}

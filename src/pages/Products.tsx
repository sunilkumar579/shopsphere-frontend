import { SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';

type ProductPage = { content: Product[]; totalElements: number; totalPages: number; number: number };

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState<ProductPage>({ content: [], totalElements: 0, totalPages: 0, number: 0 });
  const [loading, setLoading] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);
  const query = params.get('q') || '';
  const category = 'Fashion';
  const sort = params.get('sort') || 'newest';
  const page = Number(params.get('page') || 0);

  useEffect(() => {
    setLoading(true);
    api.get('/products', { params: { q: query || undefined, category, sort, page, size: 12 } })
      .then((response) => setData(response.data))
      .finally(() => setLoading(false));
  }, [query, sort, page]);

  const change = (name: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    if (name !== 'page') next.delete('page');
    setParams(next);
  };

  return <main className="container products-page">
    <div className="breadcrumbs">Home / Clothing {query && ` / “${query}”`}</div>
    <div className="products-layout">
      <aside className={`filters ${mobileFilters ? 'open' : ''}`}>
        <div className="filter-header"><h3>Refine your edit</h3><button className="icon-btn" onClick={() => setMobileFilters(false)} aria-label="Close filters"><X /></button></div>
        <div className="filter-group"><div className="filter-title">Collection</div><label><input type="radio" checked readOnly /> Clothing</label></div>
        <div className="filter-group"><div className="filter-title">Sort by</div>{[['newest', 'New arrivals'], ['rating', 'Bestsellers'], ['priceLow', 'Price: low to high'], ['priceHigh', 'Price: high to low']].map(([value, label]) => <label key={value}><input type="radio" checked={sort === value} onChange={() => change('sort', value)} /> {label}</label>)}</div>
      </aside>
      <section className="products-main">
        <div className="listing-head"><div><span className="eyebrow">THE MORROW COLLECTION</span><h1>{query ? `Looking for “${query}”` : 'Clothing, made for living'}</h1><p>{data.totalElements.toLocaleString('en-IN')} pieces to make your own</p></div><button className="secondary-btn filter-mobile" onClick={() => setMobileFilters(true)}><SlidersHorizontal size={17} /> Refine</button><select value={sort} onChange={(event) => change('sort', event.target.value)} aria-label="Sort clothing"><option value="newest">New arrivals</option><option value="rating">Bestsellers</option><option value="priceLow">Price: low to high</option><option value="priceHigh">Price: high to low</option></select></div>
        {loading ? <Spinner /> : <>{data.content.length ? <div className="product-grid">{data.content.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><h2>No pieces found</h2><p>Try another search to find your next favourite.</p></div>}<div className="pagination">{Array.from({ length: data.totalPages }, (_, index) => <button key={index} className={index === data.number ? 'active' : ''} onClick={() => change('page', String(index))}>{index + 1}</button>)}</div></>}
      </section>
    </div>
  </main>;
}

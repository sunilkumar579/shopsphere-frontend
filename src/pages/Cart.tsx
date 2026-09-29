import {Minus,Plus,Trash2,ShoppingBag,ArrowRight} from 'lucide-react';
import {Link,useNavigate} from 'react-router-dom';
import {useApp} from '../context/AppContext';

export default function Cart(){
  const {cart,updateCart,removeCart,user}=useApp();
  const nav=useNavigate();
  if(!user)return null;
  if(!cart?.items.length)
    return <main className="container empty-state cart-empty"><ShoppingBag size={58}/><h1>Your bag is empty</h1><p>Discover fresh picks and add something you love.</p><Link className="primary-btn" to="/products">Start shopping <ArrowRight size={17}/></Link></main>;
  return <main className="container checkout-page">
    <div className="checkout-heading"><div><span className="eyebrow">YOUR BAG</span><h1>Shopping bag</h1><p>{cart.itemCount} item{cart.itemCount===1?'':'s'}</p></div></div>
    <div className="checkout-grid">
      <section>{cart.items.map(i=><div className="cart-item" key={i.productId}>
        <Link to={`/product/${i.productId}`} className="cart-image"><img src={i.imageUrl} alt={i.name}/></Link>
        <div className="cart-info"><Link to={`/product/${i.productId}`} className="cart-name">{i.name}</Link><span>{i.brand}</span><small>₹{i.price.toLocaleString('en-IN')} each</small>
          <div className="cart-actions"><div className="qty-control"><button disabled={i.quantity<=1} onClick={()=>updateCart(i.productId,i.quantity-1)}><Minus size={15}/></button><span>{i.quantity}</span><button disabled={i.quantity>=i.stock} onClick={()=>updateCart(i.productId,i.quantity+1)}><Plus size={15}/></button></div><button className="text-btn danger" onClick={()=>removeCart(i.productId)}><Trash2 size={15}/> Remove</button></div>
        </div>
        <strong className="line-total">₹{i.lineTotal.toLocaleString('en-IN')}</strong>
      </div>)}</section>
      <aside className="summary-card"><h3>Price details</h3><div><span>Subtotal</span><b>₹{cart.subtotal.toLocaleString('en-IN')}</b></div><div><span>Shipping</span><b>{cart.shippingFee===0?'FREE':'₹'+cart.shippingFee}</b></div><div className="summary-total"><span>Total</span><b>₹{cart.total.toLocaleString('en-IN')}</b></div><button className="primary-btn full" onClick={()=>nav('/checkout')}>Proceed to checkout <ArrowRight size={17}/></button><p className="summary-note">You can review your address and payment method on the next step.</p></aside>
    </div>
  </main>;
}

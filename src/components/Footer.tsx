import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return <footer><div className="container footer-grid">
    <div><div className="logo footer-logo"><span>MORROW</span> STUDIO</div><p className="muted">Clothes for the everyday. Thoughtful fits, easy layers, and the pieces that feel like you.</p><div className="socials"><Facebook /><Instagram /><Twitter /></div></div>
    <div><h4>The collection</h4><Link to="/products?category=Fashion">Shop all clothing</Link><Link to="/products?category=Fashion&sort=newest">New arrivals</Link><Link to="/products?category=Fashion&sort=rating">Bestsellers</Link><Link to="/products?category=Fashion&sort=priceLow">Under ₹1,000</Link></div>
    <div><h4>Your account</h4><Link to="/profile">Profile</Link><Link to="/orders">Orders</Link><Link to="/wishlist">Saved pieces</Link><Link to="/cart">Shopping bag</Link></div>
    <div><h4>Here to help</h4><div className="contact-line"><MapPin size={15} /> Hyderabad, India</div><div className="contact-line"><Phone size={15} /> +91 90000 00000</div><div className="contact-line"><Mail size={15} /> support@shopsphere.com</div></div>
  </div><div className="footer-bottom">© 2026 Morrow Studio. Made for your everyday.</div></footer>;
}

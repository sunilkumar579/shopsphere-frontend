import {createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
import {api,messageOf} from '../lib/api'; import type {Cart,Product,User} from '../types';

type Ctx={user:User|null;loading:boolean;cart:Cart|null;wishlist:Product[];login:(email:string,password:string)=>Promise<void>;register:(d:any)=>Promise<void>;logout:()=>void;refreshCart:()=>Promise<void>;addToCart:(productId:number,quantity?:number)=>Promise<void>;updateCart:(productId:number,quantity:number)=>Promise<void>;removeCart:(productId:number)=>Promise<void>;toggleWishlist:(productId:number)=>Promise<void>;refreshWishlist:()=>Promise<void>;error:string;setError:(x:string)=>void};
const AppCtx=createContext<Ctx|null>(null);
export function AppProvider({children}:{children:React.ReactNode}){const [user,setUser]=useState<User|null>(null);const [cart,setCart]=useState<Cart|null>(null);const [wishlist,setWishlist]=useState<Product[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState('');
 const refresh=useCallback(async()=>{const token=localStorage.getItem('shopsphere_token');if(!token){setLoading(false);return;}try{const [me,c]=await Promise.all([api.get('/auth/me'),api.get('/cart')]);setUser(me.data);setCart(c.data);if(me.data) {try{setWishlist((await api.get('/wishlist')).data)}catch{}}}catch{localStorage.removeItem('shopsphere_token');setUser(null);setCart(null);}finally{setLoading(false)}},[]);
 useEffect(()=>{refresh()},[refresh]);
 const login=async(email:string,password:string)=>{setError('');try{const r=await api.post('/auth/login',{email,password});localStorage.setItem('shopsphere_token',r.data.token);setUser(r.data.user);setCart((await api.get('/cart')).data);try{setWishlist((await api.get('/wishlist')).data)}catch{}}catch(e){const m=messageOf(e);setError(m);throw new Error(m)}};
 const register=async(d:any)=>{setError('');try{const r=await api.post('/auth/register',d);localStorage.setItem('shopsphere_token',r.data.token);setUser(r.data.user);setCart((await api.get('/cart')).data)}catch(e){const m=messageOf(e);setError(m);throw new Error(m)}};
 const logout=()=>{localStorage.removeItem('shopsphere_token');setUser(null);setCart(null);setWishlist([])};
 const refreshCart=async()=>{if(!user)return;setCart((await api.get('/cart')).data)};
 const addToCart=async(productId:number,quantity=1)=>{if(!user)throw new Error('LOGIN_REQUIRED');try{setCart((await api.post('/cart/items',{productId,quantity})).data)}catch(e){const m=messageOf(e);setError(m);throw new Error(m)}};
 const updateCart=async(productId:number,quantity:number)=>{try{setCart((await api.put(`/cart/items/${productId}`,{quantity})).data)}catch(e){const m=messageOf(e);setError(m);throw new Error(m)}};
 const removeCart=async(productId:number)=>{try{setCart((await api.delete(`/cart/items/${productId}`)).data)}catch(e){const m=messageOf(e);setError(m);throw new Error(m)}};
 const refreshWishlist=async()=>{if(user)setWishlist((await api.get('/wishlist')).data)};
 const toggleWishlist=async(productId:number)=>{if(!user)throw new Error('LOGIN_REQUIRED');setWishlist((await api.post(`/wishlist/${productId}`)).data)};
 const value=useMemo(()=>({user,loading,cart,wishlist,login,register,logout,refreshCart,addToCart,updateCart,removeCart,toggleWishlist,refreshWishlist,error,setError}),[user,loading,cart,wishlist,error]);
 return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
export const useApp=()=>{const v=useContext(AppCtx);if(!v)throw new Error('AppProvider missing');return v};

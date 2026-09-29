import axios from 'axios';
export const api=axios.create({baseURL:import.meta.env.VITE_API_URL || '/api',headers:{'Content-Type':'application/json'}});
api.interceptors.request.use(config=>{const token=localStorage.getItem('shopsphere_token');if(token)config.headers.Authorization=`Bearer ${token}`;return config;});
api.interceptors.response.use(r=>r,e=>{if(e.response?.status===401&&location.pathname!=='/login'){localStorage.removeItem('shopsphere_token');}return Promise.reject(e);});
export const messageOf=(e:any)=>e?.response?.data?.message||e?.message||'Something went wrong';

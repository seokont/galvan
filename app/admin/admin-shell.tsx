'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {adminApi} from './admin-api';
export default function AdminShell({children}:{children:React.ReactNode}) {
  const router=useRouter();
  const [user,setUser]=useState<{email:string}|null>(null);
  const [error,setError]=useState('');
  useEffect(()=>{const expired=()=>router.replace('/admin/login');window.addEventListener('atelier-admin-session-expired',expired);return()=>window.removeEventListener('atelier-admin-session-expired',expired);},[router]);
  useEffect(()=>{let active=true;adminApi<{email:string}>('auth/session').then(data=>{if(active)setUser(data);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[]);
  async function logout(){try{await adminApi('auth/logout',{method:'POST'});}finally{router.replace('/admin/login');}}
  if(!user) return <main className="admin-loading" role="status">{error||'Проверяем вход…'}</main>;
  return <><header className="admin-header"><Link className="admin-wordmark" href="/admin/products">Atelier <span>управление каталогом</span></Link><nav><Link href="/admin/products">Товары</Link><Link href="/" target="_blank">Открыть сайт ↗</Link></nav><div className="admin-account"><span>{user.email}</span><button onClick={logout}>Выйти</button></div></header><main className="admin-content">{children}</main></>;
}

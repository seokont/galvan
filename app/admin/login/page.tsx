'use client';
import {useState,type FormEvent} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {adminApi} from '../admin-api';
export default function AdminLogin() {
  const router=useRouter();const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();const form=new FormData(event.currentTarget);setBusy(true);setError('');
    try{await adminApi('auth/login',{method:'POST',body:JSON.stringify({email:form.get('email'),password:form.get('password')})});router.replace('/admin/products');}
    catch(e){setError(e instanceof Error?e.message:'Не удалось войти');setBusy(false);}
  }
  return <main className="admin-login"><div className="admin-login-card"><p className="admin-eyebrow">Atelier · управление каталогом</p><h1>Вход администратора</h1><p>Редактируйте товары, фотографии и характеристики сайта.</p><form onSubmit={submit}><label>Email<input name="email" type="email" autoComplete="username" required maxLength={254}/></label><label>Пароль<input name="password" type="password" autoComplete="current-password" required maxLength={256}/></label>{error&&<p className="admin-error" role="alert">{error}</p>}<button className="admin-primary" disabled={busy}>{busy?'Входим…':'Войти'}</button></form><Link href="/">← Вернуться на сайт</Link></div></main>;
}

'use client';
export class AdminApiError extends Error {
  constructor(message:string,readonly status:number){super(message);}
}
export async function adminApi<T>(path:string,options:RequestInit={}):Promise<T> {
  const headers=new Headers(options.headers);
  if(options.body&&!(options.body instanceof FormData)) headers.set('Content-Type','application/json');
  const response=await fetch('/api/admin/'+path,{...options,headers,cache:'no-store'});
  if(!response.ok) {
    const error=await response.json().catch(()=>({message:"Unable to complete the request"}));
    if(response.status===401) window.dispatchEvent(new Event('atelier-admin-session-expired'));
    throw new AdminApiError(error.message||"Request failed",response.status);
  }
  return response.json() as Promise<T>;
}

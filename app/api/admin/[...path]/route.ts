import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'atelier_admin';
async function boundedBody(request: NextRequest, maximum: number) {
  if (Number(request.headers.get('content-length') || 0) > maximum) throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) return Buffer.alloc(0);
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const {done,value} = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maximum) { await reader.cancel(); throw new RangeError(); }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

async function proxy(request: NextRequest, {params}: {params:Promise<{path:string[]}>}) {
  const {path} = await params;
  const route = path.join('/'); const method = request.method;
  const login = route === 'auth/login' && method === 'POST';
  const allowed = login || (route==='auth/logout'&&method==='POST') || (['auth/session','metadata','products','enquiries'].includes(route)&&method==='GET')
    || (/^enquiries\/\d+$/.test(route)&&method==='PATCH')
    || (/^products\/\d+$/.test(route)&&['GET','PATCH'].includes(method)) || (route==='media'&&method==='POST')
    || (/^images\/[a-f0-9]{64}\.(jpg|png|webp|gif)$/.test(route)&&method==='GET');
  if (!allowed) return NextResponse.json({message:'Не найдено'},{status:404});
  const token=request.cookies.get(COOKIE)?.value;
  if (!login && (!token || !/^[A-Za-z0-9_-]{43}$/.test(token))) return NextResponse.json({message:'Требуется вход администратора'},{status:401});
  if (method!=='GET') {
    const expectedOrigin=process.env.ADMIN_PUBLIC_ORIGIN || request.nextUrl.protocol+'//'+request.headers.get('host');
    if(request.headers.get('origin')!==expectedOrigin) return NextResponse.json({message:'Запрос с другого сайта запрещён'},{status:403});
  }
  try {
    const url=new URL((process.env.BACKEND_URL||'http://127.0.0.1:3001').replace(/\/$/,'')+'/admin/'+route);
    if((route==='products'||route==='enquiries')&&method==='GET') for(const key of route==='enquiries'?['q','status','page']:['q','brand','visibility','page','limit']) {
      const values=request.nextUrl.searchParams.getAll(key);
      if(values.length>1) return NextResponse.json({message:'Недопустимый запрос'},{status:400});
      if(values[0]) url.searchParams.set(key,values[0]);
    }
    const headers=new Headers();
    if(!login) headers.set('authorization','Bearer '+token);
    if(method!=='GET') headers.set('content-type',request.headers.get('content-type')||'application/json');
    const body=method==='GET'?undefined:await boundedBody(request,route==='media'?9*1024*1024:256*1024);
    const upstream=await fetch(url,{method,headers,body,cache:'no-store',redirect:'error',signal:AbortSignal.timeout(30000)});
    const responseHeaders=new Headers({'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    if(!upstream.ok) {
      let message='Ошибка сервера. Повторите попытку';
      if(upstream.status<500) {const error=await upstream.json().catch(()=>null); if(typeof error?.message==='string') message=error.message;}
      const response=NextResponse.json({message},{status:upstream.status,headers:responseHeaders});
      if((upstream.status===401&&!login)||route==='auth/logout') response.cookies.set(COOKIE,'',{path:'/',maxAge:0});
      return response;
    }
    if(login) {
      const data=await upstream.json();
      const response=NextResponse.json({admin:data.admin},{headers:responseHeaders});
      response.cookies.set(COOKIE,data.token,{httpOnly:true,sameSite:'strict',secure:request.nextUrl.protocol==='https:'||request.headers.get('x-forwarded-proto')==='https',path:'/',maxAge:8*60*60});
      return response;
    }
    responseHeaders.set('Content-Type',upstream.headers.get('content-type')||'application/json');
    const response=new NextResponse(upstream.body,{status:upstream.status,headers:responseHeaders});
    if(route==='auth/logout') response.cookies.set(COOKIE,'',{path:'/',maxAge:0});
    return response;
  } catch(error) {
    const response=NextResponse.json({message:error instanceof RangeError?'Файл или запрос слишком большой':'Сервер временно недоступен'},{status:error instanceof RangeError?413:503,headers:{'Cache-Control':'no-store'}});
    if(route==='auth/logout')response.cookies.set(COOKIE,'',{path:'/',maxAge:0});
    return response;
  }
}
export {proxy as GET,proxy as POST,proxy as PATCH};

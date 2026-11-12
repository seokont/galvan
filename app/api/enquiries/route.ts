import { NextRequest, NextResponse } from 'next/server';
import { takeEnquiryQuota } from './rate-limit';
export async function POST(request: NextRequest) {
  if(request.headers.get('origin')!==request.nextUrl.origin) return NextResponse.json({message:'Request not allowed'},{status:403});
  if(!request.headers.get('content-type')?.startsWith('application/json')) return NextResponse.json({message:'Invalid request'},{status:415});
  // Trust visitor IP headers only at Vercel's managed boundary, not on the public Nest endpoint.
  if(process.env.VERCEL==='1'&&!takeEnquiryQuota((request.headers.get('x-vercel-forwarded-for')||'').split(',')[0].trim())) return NextResponse.json({message:'Please wait a few minutes before trying again.'},{status:429,headers:{'Cache-Control':'no-store'}});
  try {
    const reader=request.body?.getReader();
    if(!reader) return NextResponse.json({message:'Invalid request'},{status:400});
    const chunks:Uint8Array[]=[];let size=0;
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>20000){await reader.cancel();return NextResponse.json({message:'Message too large'},{status:413});}chunks.push(value);}
    const body=Buffer.concat(chunks).toString('utf8');JSON.parse(body);
    const base=(process.env.BACKEND_URL||'http://127.0.0.1:3001').trim().replace(/\/$/,'');
    const response=await fetch(base+'/enquiries',{method:'POST',headers:{'content-type':'application/json'},body,cache:'no-store',redirect:'error',signal:AbortSignal.timeout(15000)});
    if(response.ok) return NextResponse.json({ok:true},{status:201,headers:{'Cache-Control':'no-store'}});
    const status=[400,409,413,429].includes(response.status)?response.status:503;
    return NextResponse.json({message:status===429?'Please wait a few minutes before sending another enquiry.':status===409?'Your earlier enquiry was saved. Change a field to send a new enquiry.':status===400?'Please check your contact details and message.':'We could not send your enquiry. Please try again.'},{status,headers:{'Cache-Control':'no-store'}});
  } catch(error) {
    return NextResponse.json({message:error instanceof SyntaxError?'Invalid request':'We could not send your enquiry. Please try again.'},{status:error instanceof SyntaxError?400:503,headers:{'Cache-Control':'no-store'}});
  }
}

"use client";
import { useRef, useState, type FormEvent } from "react";
export default function ContactEnquiry() {
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);
  const [failed,setFailed]=useState(false);
  const submissionId=useRef('');
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(busy)return;
    const form=event.currentTarget;const data=new FormData(form);
    if(!submissionId.current)submissionId.current=crypto.randomUUID();
    setBusy(true);setStatus('');setFailed(false);
    try{
      const response=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({submissionId:submissionId.current,...Object.fromEntries(data)}),signal:AbortSignal.timeout(20000)});
      const result=await response.json();if(!response.ok)throw new Error(result.message||'Please try again.');
      form.reset();submissionId.current='';setStatus('Thank you. Your enquiry has been sent to Atelier. We’ll be in touch.');
    }catch(error){setFailed(true);setStatus(error instanceof Error&&error.name!=='TimeoutError'?error.message:'We could not confirm delivery. Please try again; your enquiry will not be duplicated.');}
    finally{setBusy(false);}
  }
  return <form className="contact-form" onSubmit={submit} onChange={()=>{submissionId.current='';}} aria-busy={busy}>
    <div className="contact-form__row">
      <label>Your name<input name="name" autoComplete="name" placeholder="Full name" required maxLength={120} disabled={busy}/></label>
      <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} disabled={busy}/></label>
    </div>
    <label>Phone number (optional)<input name="phone" type="tel" autoComplete="tel" maxLength={50} placeholder="Your phone number" disabled={busy}/></label>
    <label>I’d like to know about<select name="subject" defaultValue="A dress" disabled={busy}><option>A dress</option><option>Sizing &amp; fit</option><option>An appointment</option><option>Something else</option></select></label>
    <label>Your message<textarea name="message" rows={5} placeholder="Tell us what you have in mind…" required maxLength={4000} disabled={busy}/></label>
    <div aria-hidden="true" style={{position:'absolute',left:'-10000px',width:1,height:1,overflow:'hidden'}}><label>Website<input name="website" tabIndex={-1} autoComplete="off" maxLength={200}/></label></div>
    <p className="contact-form__note">We’ll use your contact details to respond to your enquiry.</p>
    <button className="contact-copy-button" type="submit" disabled={busy}>{busy?'Sending…':'Send my enquiry'} <span aria-hidden="true">↗</span></button>
    <p className="contact-form__status" role={failed?'alert':'status'}>{status}</p>
  </form>;
}

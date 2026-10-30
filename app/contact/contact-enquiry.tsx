"use client";

import { useState, type FormEvent } from "react";

export default function ContactEnquiry() {
  const [status, setStatus] = useState("");
  const [draft, setDraft] = useState("");

  async function copyEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = `Enquiry for Atelier\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nSubject: ${data.get("subject")}\n\n${data.get("message")}`;
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Your enquiry has been copied. It has not been sent.");
      setDraft("");
    } catch {
      setDraft(text);
      setStatus("Please select and copy your enquiry below. It has not been sent.");
    }
  }

  return (
    <form className="contact-form" onSubmit={copyEnquiry}>
      <div className="contact-form__row">
        <label>Your name<input name="name" autoComplete="name" placeholder="Full name" required maxLength={120} /></label>
        <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /></label>
      </div>
      <label>I’d like to know about<select name="subject" defaultValue="A dress"><option>A dress</option><option>Sizing & fit</option><option>An appointment</option><option>Something else</option></select></label>
      <label>Your message<textarea name="message" rows={5} placeholder="Tell us what you have in mind…" required maxLength={4000} /></label>
      <p className="contact-form__note">This creates a copy for you. Your message is not sent or saved on our server.</p>
      <button className="contact-copy-button" type="submit">Copy my enquiry <span aria-hidden="true">↗</span></button>
      <p className="contact-form__status" role="status">{status}</p>
      {draft && <label>Your enquiry<textarea value={draft} readOnly rows={8} onFocus={(event) => event.currentTarget.select()} /></label>}
    </form>
  );
}

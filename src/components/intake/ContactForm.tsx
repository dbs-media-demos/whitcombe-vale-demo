"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import clsx from "clsx";
import { WaxSeal } from "./WaxSeal";

type Fields = { name: string; email: string; phone: string; topic: string; message: string; consent: boolean };
const TOPICS = ["Family law", "Estate planning or probate", "Business law", "Billing", "Something else"];

/** Short general-enquiry form. Validates, then shows a sealed confirmation. Sends nothing (concept site). */
export function ContactForm() {
  const uid = useId();
  const [f, setF] = useState<Fields>({ name: "", email: "", phone: "", topic: TOPICS[0], message: "", consent: false });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const done = useRef<HTMLHeadingElement>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const er: typeof errors = {};
    if (!f.name.trim()) er.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) er.email = "Please enter a valid email address.";
    if (f.phone && f.phone.replace(/\D/g, "").length < 10) er.phone = "Please enter a 10-digit phone number, or leave it blank.";
    if (f.message.trim().length < 10) er.message = "A sentence or two is enough.";
    if (!f.consent) er.consent = "Please confirm you've read this notice.";
    setErrors(er);
    const first = Object.keys(er)[0];
    if (first) return document.getElementById(`${uid}-${first}`)?.focus();
    setState("sending");
    window.setTimeout(() => {
      setState("done");
      requestAnimationFrame(() => done.current?.focus());
    }, 1000);
  }

  if (state === "done")
    return (
      <div className="border border-line-strong p-10 text-center">
        <WaxSeal className="mx-auto h-28 w-28 -rotate-6" />
        <h3 ref={done} tabIndex={-1} className="t-display mt-6 text-3xl outline-none">
          Message received, {f.name.split(" ")[0]}.
        </h3>
        <p className="mt-3 text-muted">We reply within one business day. (Concept site: nothing was sent.)</p>
      </div>
    );

  const input = (k: keyof Fields) =>
    clsx(
      "mt-2 block min-h-12 w-full border-b bg-transparent py-2 font-serif text-lg outline-none transition-colors focus:border-accent",
      errors[k] ? "border-oxblood" : "border-line-strong",
    );
  const msg = (k: keyof Fields) =>
    errors[k] && (
      <p id={`${uid}-${k}-err`} role="alert" className="mt-2 text-sm text-oxblood">
        {errors[k]}
      </p>
    );
  const a11y = (k: keyof Fields) => ({ id: `${uid}-${k}`, "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${uid}-${k}-err` : undefined });

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 sm:grid-cols-2">
      <div>
        <label htmlFor={`${uid}-name`} className="t-caps-sm text-muted">
          Name
        </label>
        <input {...a11y("name")} autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={input("name")} />
        {msg("name")}
      </div>
      <div>
        <label htmlFor={`${uid}-email`} className="t-caps-sm text-muted">
          Email
        </label>
        <input {...a11y("email")} type="email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className={input("email")} />
        {msg("email")}
      </div>
      <div>
        <label htmlFor={`${uid}-phone`} className="t-caps-sm text-muted">
          Phone <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input {...a11y("phone")} type="tel" autoComplete="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={input("phone")} />
        {msg("phone")}
      </div>
      <div>
        <label htmlFor={`${uid}-topic`} className="t-caps-sm text-muted">
          Topic
        </label>
        <select id={`${uid}-topic`} value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })} className={clsx(input("topic"), "cursor-pointer appearance-none")}>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${uid}-message`} className="t-caps-sm text-muted">
          Message
        </label>
        <textarea {...a11y("message")} rows={4} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} className={clsx(input("message"), "resize-none")} />
        {msg("message")}
        <p className="mt-2 text-sm text-faint">Please don&rsquo;t include confidential details until we&rsquo;ve completed a conflict check.</p>
      </div>
      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-4">
          <input {...a11y("consent")} type="checkbox" checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} className="mt-1 h-5 w-5 shrink-0 accent-[var(--accent)]" />
          <span className="text-[0.95rem]">I understand that contacting the firm does not create an attorney-client relationship.</span>
        </label>
        {msg("consent")}
      </div>
      <div className="sm:col-span-2">
        <button type="submit" disabled={state === "sending"} className="group relative min-h-12 overflow-hidden rounded-full bg-accent px-8 font-medium text-accent-fg">
          <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-fg transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
          <span className="relative transition-colors duration-500 group-hover:text-bg">{state === "sending" ? "Sending…" : "Send message"}</span>
        </button>
      </div>
    </form>
  );
}

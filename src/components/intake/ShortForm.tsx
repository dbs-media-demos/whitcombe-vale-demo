"use client";

import { useId, useState, type FormEvent } from "react";
import clsx from "clsx";
import { useBiz } from "@/components/preview/BizContext";
import { L } from "@/lib/biz-core";
import { WaxSeal } from "./WaxSeal";

const TOPICS = ["Family law", "Estate planning or probate", "Business law", "Something else"];

/**
 * The short form the phone bar jumps to, and the Serbian contact section's form: a name, a phone
 * number and what it's about. Validates, then confirms. Sends nothing (concept site).
 */
export function ShortForm({ className }: { className?: string }) {
  const biz = useBiz();
  const sr = biz.lang === "sr";
  const uid = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState(sr ? "" : TOPICS[0]);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [done, setDone] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const er: typeof errors = {};
    if (!name.trim()) er.name = L(biz, "Please enter your name.", "Unesite ime.");
    if (phone.replace(/\D/g, "").length < 6) er.phone = L(biz, "Please enter a phone number.", "Unesite broj telefona.");
    setErrors(er);
    const first = Object.keys(er)[0];
    if (first) return document.getElementById(`${uid}-${first}`)?.focus();
    setDone(true);
  }

  if (done)
    return (
      <div role="status" className={clsx("border border-line-strong p-7 text-center", className)}>
        {!sr && <WaxSeal className="mx-auto h-20 w-20 -rotate-6" />}
        <p className="t-display mt-4 text-[1.7rem] leading-tight">{L(biz, `Request received, ${name.trim().split(" ")[0]}.`, "Poruka je zabeležena.")}</p>
        <p className="mt-2 text-muted">{L(biz, "We reply within one business day. (Concept site: nothing was sent.)", "Ovo je pregled sajta: ništa nije poslato.")}</p>
      </div>
    );

  const input = (bad?: string) =>
    clsx("mt-1 block min-h-12 w-full border-b bg-transparent py-2 font-sans text-[1.05rem] outline-none transition-colors focus:border-accent", bad ? "border-oxblood" : "border-line-strong");
  const msg = (k: "name" | "phone") =>
    errors[k] && (
      <p id={`${uid}-${k}-err`} role="alert" className="mt-1.5 text-sm text-oxblood">
        {errors[k]}
      </p>
    );

  return (
    <form onSubmit={submit} noValidate className={clsx("short-form grid gap-4", className)}>
      <div>
        <label htmlFor={`${uid}-name`} className="t-caps-sm text-muted">
          {L(biz, "Name", "Ime i prezime")}
        </label>
        <input id={`${uid}-name`} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}-name-err` : undefined} className={input(errors.name)} />
        {msg("name")}
      </div>
      <div>
        <label htmlFor={`${uid}-phone`} className="t-caps-sm text-muted">
          {L(biz, "Phone", "Telefon")}
        </label>
        <input id={`${uid}-phone`} type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${uid}-phone-err` : undefined} className={input(errors.phone)} />
        {msg("phone")}
      </div>
      <div>
        <label htmlFor={`${uid}-about`} className="t-caps-sm text-muted">
          {L(biz, "What it’s about", "Poruka")}
        </label>
        {sr ? (
          <textarea id={`${uid}-about`} rows={2} value={about} onChange={(e) => setAbout(e.target.value)} className={clsx(input(), "resize-none")} />
        ) : (
          <select id={`${uid}-about`} value={about} onChange={(e) => setAbout(e.target.value)} className={clsx(input(), "cursor-pointer appearance-none")}>
            {TOPICS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        )}
      </div>
      <p className="text-[0.82rem] leading-snug text-faint">
        {L(biz, "Names only for now: we run a conflict check first. Contacting the firm does not create an attorney-client relationship.", "Molimo da u poruci ne navodite poverljive detalje. Slanje poruke ne zasniva odnos advokata i stranke.")}
      </p>
      <button type="submit" className="min-h-12 rounded-full bg-accent px-7 font-medium text-accent-fg">
        {L(biz, "Request my call", "Pošaljite")}
      </button>
    </form>
  );
}

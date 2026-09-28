"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import clsx from "clsx";
import { practices } from "@/content/practice";
import { site } from "@/content/site";
import { WaxSeal } from "./WaxSeal";

type Group = "family" | "legacy" | "enterprise" | "other";
type Question = { id: string; label: string; options: string[] };

const SOON: Question = { id: "urgency", label: "How soon do you need help?", options: ["This week", "This month", "Just planning ahead"] };

const QUESTIONS: Record<Group, Question[]> = {
  family: [
    { id: "filed", label: "Has anything been filed in court yet?", options: ["No, not yet", "I've been served", "I filed", "Not sure"] },
    { id: "children", label: "Are children involved?", options: ["Yes", "No"] },
    { id: "county", label: "Which county do you live in?", options: ["Dallas", "Collin", "Denton", "Tarrant", "Elsewhere in Texas"] },
    SOON,
  ],
  legacy: [
    { id: "for", label: "Who is this for?", options: ["Me / us", "A parent or relative", "An estate I'm handling"] },
    { id: "married", label: "What's your marital status?", options: ["Married", "Single", "Widowed", "Divorced"] },
    { id: "home", label: "Do you own a home?", options: ["In Texas", "In Texas and another state", "No"] },
    SOON,
  ],
  enterprise: [
    { id: "stage", label: "Where is the business today?", options: ["Just an idea", "Operating, not formed", "Already formed"] },
    { id: "owners", label: "How many owners?", options: ["Just me", "Two", "Three or more"] },
    { id: "need", label: "What do you need first?", options: ["Formation", "Company agreement", "Contract review", "Ongoing counsel"] },
    SOON,
  ],
  other: [{ id: "area", label: "Which is closest?", options: ["Family", "Estate or inheritance", "Business", "Not sure"] }, SOON],
};

const MATTERS = [...practices.map((p) => ({ slug: p.slug, title: p.title, numeral: p.numeral, group: p.part as Group })), { slug: "other", title: "Something else", numeral: "·", group: "other" as Group }];

const STEPS = ["Matter", "A few questions", "A time", "Your details"];
const MODES = ["Phone", "Video", "In our office"];
const SLOTS = ["9:00 am", "9:30 am", "10:30 am", "11:30 am", "1:30 pm", "2:30 pm", "3:30 pm", "4:30 pm"];

/** Next 10 weekdays, starting tomorrow. Computed on the client only (this step never server-renders). */
function nextDays() {
  const out: Date[] = [];
  const d = new Date();
  while (out.length < 10) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d));
  }
  return out;
}
// Deterministic "already booked" slots so the calendar looks lived-in.
const taken = (day: Date, i: number) => (day.getDate() * 7 + i * 3) % 5 === 0;

type Details = { first: string; last: string; email: string; phone: string; language: string; note: string; consent: boolean };
type Errors = Partial<Record<string, string>>;

export function IntakeWizard() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [moved, setMoved] = useState(false);
  const [matter, setMatter] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<string | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [details, setDetails] = useState<Details>({ first: "", last: "", email: "", phone: "", language: "English", note: "", consent: false });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [ref, setRef] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const uid = useId();

  const days = useMemo(() => (step >= 2 ? nextDays() : []), [step]);
  const m = MATTERS.find((x) => x.slug === matter);
  const questions = m ? QUESTIONS[m.group] : [];

  // Preselect the matter when arriving from a practice page (?matter=divorce).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("matter");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL is only readable on the client
    if (q && MATTERS.some((x) => x.slug === q)) setMatter(q);
  }, []);

  // Move focus to the new step's heading so keyboard and screen-reader users land in the right place.
  useEffect(() => {
    if (!moved && status === "idle") return;
    heading.current?.focus({ preventScroll: true });
    const top = heading.current?.closest("[data-wizard]")?.getBoundingClientRect().top ?? 0;
    if (top < 80) window.scrollBy({ top: top - 110, behavior: "smooth" });
  }, [step, status, moved]);

  function validate(s: number): Errors {
    const e: Errors = {};
    if (s === 0 && !matter) e.matter = "Choose the matter closest to yours.";
    if (s === 1) for (const q of questions) if (!answers[q.id]) e[q.id] = "Please choose an answer.";
    if (s === 2) {
      if (!mode) e.mode = "Choose how you'd like to talk.";
      if (day === null) e.day = "Choose a day.";
      if (!slot) e.slot = "Choose a time.";
    }
    if (s === 3) {
      if (!details.first.trim()) e.first = "Please enter your first name.";
      if (!details.last.trim()) e.last = "Please enter your last name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(details.email.trim())) e.email = "Please enter a valid email address.";
      if (details.phone.replace(/\D/g, "").length < 10) e.phone = "Please enter a 10-digit phone number.";
      if (!details.consent) e.consent = "Please confirm you've read this notice.";
    }
    return e;
  }

  function go(to: number) {
    setDir(to > step ? 1 : -1);
    setMoved(true);
    setErrors({});
    setStep(to);
  }

  function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      (document.getElementById(`${uid}-${first}`) as HTMLElement | null)?.focus();
      return;
    }
    if (step < 3) return go(step + 1);
    setStatus("sending");
    // Concept site: nothing is sent anywhere.
    window.setTimeout(() => {
      setRef(`WV-2026-${String(Math.floor(1000 + Math.random() * 9000))}`);
      setStatus("done");
    }, 1300);
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`${uid}-${k}-err`} className="mt-2 text-sm text-oxblood" role="alert">
        {errors[k]}
      </p>
    ) : null;

  const chip = (selected: boolean) =>
    clsx(
      "min-h-12 rounded-full border px-5 text-left text-[0.95rem] transition-[background-color,border-color,color] duration-300",
      selected ? "border-accent bg-accent text-accent-fg" : "border-line-strong hover:border-fg",
    );

  if (status === "done") {
    const when = day !== null && days[day] ? days[day].toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "";
    return (
      <div data-wizard className="relative overflow-hidden border border-line-strong bg-surface/40 p-8 text-center md:p-14">
        <div className="seal-stamp mx-auto h-36 w-36 md:h-44 md:w-44">
          <WaxSeal className="h-full w-full drop-shadow-[0_14px_18px_rgba(63,15,19,.35)]" />
        </div>
        <p className="t-caps-sm mt-8 text-accent">Request received · {ref}</p>
        <h2 ref={heading} tabIndex={-1} className="t-display t-md mx-auto mt-4 max-w-xl outline-none">
          Thank you, {details.first}. We&rsquo;ll call to confirm.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-muted">
          {m?.title} · {mode} · {when} at {slot} (Dallas time). An attorney will reply within one business day, usually today. If anything is urgent, call{" "}
          <a href={site.phoneHref} className="text-accent underline underline-offset-4">
            {site.phone}
          </a>
          .
        </p>
        <ol className="mx-auto mt-10 grid max-w-2xl gap-4 text-left sm:grid-cols-3">
          {["We run a conflict check using only the names you gave us.", "An attorney calls to confirm your time.", "You speak for 15 minutes, free and in confidence."].map((t, i) => (
            <li key={t} className="border-t border-line-strong pt-4 text-sm text-muted">
              <span className="t-caps-sm block text-accent">{["I", "II", "III"][i]}</span>
              {t}
            </li>
          ))}
        </ol>
        <p className="t-italic mt-10 text-sm text-faint">This is a concept website by DBS Media. No information was sent.</p>
        <style>{`
          .seal-stamp { animation: stamp 1.1s cubic-bezier(.2,1.4,.4,1) both; }
          @keyframes stamp { 0% { transform: scale(2.4) rotate(-24deg); opacity: 0; } 55% { opacity: 1; } 100% { transform: scale(1) rotate(-8deg); opacity: 1; } }
          @media (prefers-reduced-motion: reduce) { .seal-stamp { animation: none; transform: rotate(-8deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <form data-wizard onSubmit={onSubmit} noValidate className="relative border border-line-strong bg-surface/40">
      {/* Docket: progress through the four steps */}
      <div className="border-b border-line px-6 pt-6 md:px-10">
        <ol className="grid grid-cols-4 gap-3">
          {STEPS.map((s, i) => (
            <li key={s} className="min-w-0">
              <button
                type="button"
                disabled={i >= step}
                onClick={() => go(i)}
                aria-current={i === step ? "step" : undefined}
                className={clsx("flex min-h-11 w-full flex-col items-start text-left transition-colors", i <= step ? "text-fg" : "text-faint", i < step && "hover:text-accent")}
              >
                <span className="t-caps-sm text-accent">{["I", "II", "III", "IV"][i]}</span>
                <span className="mt-1 truncate text-sm max-sm:sr-only">{s}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="relative mt-4 h-px bg-line">
          <div className="absolute inset-y-0 left-0 w-full origin-left bg-accent transition-transform duration-1000 ease-[var(--ease-out-expo)]" style={{ transform: `scaleX(${(step + 1) / 4})` }} />
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Step {step + 1} of 4: {STEPS[step]}
      </p>

      <div key={step} className={clsx("px-6 py-10 md:px-10 md:py-12", moved && "step-in", dir === 1 ? "from-right" : "from-left")}>
        {step === 0 && (
          <fieldset>
            <legend>
              <h2 ref={heading} tabIndex={-1} className="t-display t-md outline-none">
                What would you like to talk about?
              </h2>
            </legend>
            <p className="mt-3 text-muted">Choose the closest. You can explain the rest on the call.</p>
            <div id={`${uid}-matter`} tabIndex={-1} role="radiogroup" aria-invalid={!!errors.matter} aria-describedby={errors.matter ? `${uid}-matter-err` : undefined} className="mt-8 grid gap-3 outline-none sm:grid-cols-2 lg:grid-cols-3">
              {MATTERS.map((x) => (
                <button
                  key={x.slug}
                  type="button"
                  role="radio"
                  aria-checked={matter === x.slug}
                  onClick={() => {
                    setMatter(x.slug);
                    setAnswers({});
                  }}
                  className={clsx(
                    "group flex min-h-16 items-center gap-4 border px-5 py-4 text-left transition-[background-color,border-color,color] duration-300",
                    matter === x.slug ? "border-accent bg-accent text-accent-fg" : "border-line-strong hover:border-fg",
                  )}
                >
                  <span className={clsx("t-caps-sm w-8", matter === x.slug ? "text-accent-fg/80" : "text-accent")}>{x.numeral}</span>
                  <span className="t-display text-[1.45rem] leading-none">{x.title}</span>
                </button>
              ))}
            </div>
            {err("matter")}
          </fieldset>
        )}

        {step === 1 && (
          <div>
            <h2 ref={heading} tabIndex={-1} className="t-display t-md outline-none">
              A few quick questions
            </h2>
            <p className="mt-3 text-muted">So the attorney who calls you is already prepared. No details needed yet.</p>
            <div className="mt-8 space-y-8">
              {questions.map((q) => (
                <fieldset key={q.id}>
                  <legend className="font-serif text-lg">{q.label}</legend>
                  <div id={`${uid}-${q.id}`} tabIndex={-1} role="radiogroup" aria-invalid={!!errors[q.id]} className="mt-3 flex flex-wrap gap-2 outline-none">
                    {q.options.map((o) => (
                      <button key={o} type="button" role="radio" aria-checked={answers[q.id] === o} onClick={() => setAnswers((a) => ({ ...a, [q.id]: o }))} className={chip(answers[q.id] === o)}>
                        {o}
                      </button>
                    ))}
                  </div>
                  {err(q.id)}
                </fieldset>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 ref={heading} tabIndex={-1} className="t-display t-md outline-none">
              When should we call?
            </h2>
            <p className="mt-3 text-muted">Times are Dallas time. We&rsquo;ll confirm by phone or email.</p>
            <fieldset className="mt-8">
              <legend className="font-serif text-lg">How would you like to talk?</legend>
              <div id={`${uid}-mode`} tabIndex={-1} role="radiogroup" className="mt-3 flex flex-wrap gap-2 outline-none">
                {MODES.map((o) => (
                  <button key={o} type="button" role="radio" aria-checked={mode === o} onClick={() => setMode(o)} className={chip(mode === o)}>
                    {o}
                  </button>
                ))}
              </div>
              {err("mode")}
            </fieldset>
            <fieldset className="mt-8">
              <legend className="font-serif text-lg">Day</legend>
              <div id={`${uid}-day`} tabIndex={-1} role="radiogroup" className="no-scrollbar -mx-6 mt-3 flex gap-2 overflow-x-auto px-6 pb-2 outline-none md:mx-0 md:grid md:grid-cols-5 md:px-0">
                {days.map((d, i) => (
                  <button
                    key={d.toDateString()}
                    type="button"
                    role="radio"
                    aria-checked={day === i}
                    aria-label={d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    onClick={() => {
                      setDay(i);
                      setSlot(null);
                    }}
                    className={clsx(
                      "flex min-w-[4.8rem] shrink-0 flex-col items-center border py-3 transition-colors duration-300",
                      day === i ? "border-accent bg-accent text-accent-fg" : "border-line-strong hover:border-fg",
                    )}
                  >
                    <span className="t-caps-sm">{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
                    <span className="t-display mt-1 text-3xl leading-none">{d.getDate()}</span>
                    <span className="text-xs opacity-75">{d.toLocaleDateString("en-US", { month: "short" })}</span>
                  </button>
                ))}
              </div>
              {err("day")}
            </fieldset>
            <fieldset className="mt-8" disabled={day === null}>
              <legend className="font-serif text-lg">Time</legend>
              <div id={`${uid}-slot`} tabIndex={-1} role="radiogroup" className={clsx("mt-3 grid grid-cols-2 gap-2 outline-none sm:grid-cols-4", day === null && "opacity-40")}>
                {SLOTS.map((s, i) => {
                  const off = day !== null && taken(days[day], i);
                  return (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={slot === s}
                      disabled={off || day === null}
                      onClick={() => setSlot(s)}
                      className={clsx(chip(slot === s), "text-center", off && "cursor-not-allowed line-through opacity-35")}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {err("slot")}
            </fieldset>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 ref={heading} tabIndex={-1} className="t-display t-md outline-none">
              Where can we reach you?
            </h2>
            <p className="mt-3 text-muted">We use your name only to run a conflict check before we discuss anything.</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {(
                [
                  ["first", "First name", "given-name", "text"],
                  ["last", "Last name", "family-name", "text"],
                  ["email", "Email", "email", "email"],
                  ["phone", "Phone", "tel", "tel"],
                ] as const
              ).map(([k, label, ac, type]) => (
                <div key={k}>
                  <label htmlFor={`${uid}-${k}`} className="t-caps-sm text-muted">
                    {label}
                  </label>
                  <input
                    id={`${uid}-${k}`}
                    type={type}
                    autoComplete={ac}
                    inputMode={k === "phone" ? "tel" : undefined}
                    value={details[k]}
                    onChange={(e) => setDetails((d) => ({ ...d, [k]: e.target.value }))}
                    aria-invalid={!!errors[k]}
                    aria-describedby={errors[k] ? `${uid}-${k}-err` : undefined}
                    className={clsx(
                      "mt-2 block min-h-12 w-full border-b bg-transparent py-2 font-serif text-xl outline-none transition-colors focus:border-accent",
                      errors[k] ? "border-oxblood" : "border-line-strong",
                    )}
                  />
                  {err(k)}
                </div>
              ))}
              <fieldset className="sm:col-span-2">
                <legend className="t-caps-sm text-muted">Preferred language</legend>
                <div className="mt-3 flex gap-2">
                  {["English", "Español"].map((l) => (
                    <button key={l} type="button" aria-pressed={details.language === l} onClick={() => setDetails((d) => ({ ...d, language: l }))} className={chip(details.language === l)}>
                      {l}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="sm:col-span-2">
                <label htmlFor={`${uid}-note`} className="t-caps-sm text-muted">
                  Anything we should know before the call? <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  id={`${uid}-note`}
                  rows={3}
                  value={details.note}
                  onChange={(e) => setDetails((d) => ({ ...d, note: e.target.value }))}
                  aria-describedby={`${uid}-note-hint`}
                  className="mt-2 block w-full resize-none border-b border-line-strong bg-transparent py-2 font-serif text-lg outline-none focus:border-accent"
                />
                <p id={`${uid}-note-hint`} className="mt-2 text-sm text-faint">
                  Please don&rsquo;t include confidential details until we&rsquo;ve completed a conflict check.
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-start gap-4">
                  <input
                    id={`${uid}-consent`}
                    type="checkbox"
                    checked={details.consent}
                    onChange={(e) => setDetails((d) => ({ ...d, consent: e.target.checked }))}
                    aria-invalid={!!errors.consent}
                    aria-describedby={errors.consent ? `${uid}-consent-err` : undefined}
                    className="mt-1 h-5 w-5 shrink-0 accent-[var(--accent)]"
                  />
                  <span className="text-[0.95rem]">I understand that submitting this form does not create an attorney-client relationship.</span>
                </label>
                {err("consent")}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse gap-4 border-t border-line px-6 py-6 sm:flex-row sm:items-center sm:justify-between md:px-10">
        <p className="text-sm text-muted">
          <strong className="font-semibold text-fg">Notice:</strong> Submitting this form does not create an attorney-client relationship.
        </p>
        <div className="flex shrink-0 gap-3">
          {step > 0 && (
            <button type="button" onClick={() => go(step - 1)} className="min-h-12 rounded-full border border-line-strong px-6 transition-colors hover:border-fg">
              Back
            </button>
          )}
          <button type="submit" disabled={status === "sending"} className="group relative min-h-12 overflow-hidden rounded-full bg-accent px-7 font-medium text-accent-fg disabled:opacity-70">
            <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-fg transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
            <span className="relative transition-colors duration-500 group-hover:text-bg">
              {status === "sending" ? "Sending…" : step < 3 ? "Continue" : "Request my consultation"}
            </span>
          </button>
        </div>
      </div>

      <style>{`
        .step-in { animation: step-in .8s var(--ease-out-expo) both; }
        .step-in.from-left { animation-name: step-in-left; }
        @keyframes step-in { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: none; } }
        @keyframes step-in-left { from { opacity: 0; transform: translateX(-28px); } to { opacity: 1; transform: none; } }
      `}</style>
    </form>
  );
}

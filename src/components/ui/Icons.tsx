import clsx from "clsx";

export function Arrow({ className, dir = "right" }: { className?: string; dir?: "right" | "up-right" | "down" | "left" }) {
  const rot = { right: 0, "up-right": -45, down: 90, left: 180 }[dir];
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={clsx("h-4 w-4", className)} style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M3 12h17m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function Phone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={clsx("h-4 w-4", className)}>
      <path
        d="M5 3.5h3.2l1.6 4.2-2 1.3a11 11 0 0 0 7.2 7.2l1.3-2 4.2 1.6V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Star({ className, filled = true }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={clsx("h-4 w-4", className)}>
      <path
        d="M10 1.6l2.5 5.3 5.8.7-4.3 4 1.1 5.8L10 14.6l-5.1 2.8L6 11.6l-4.3-4 5.8-.7z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Stars({ value = 5, className }: { value?: number; className?: string }) {
  return (
    <span className={clsx("inline-flex gap-0.5", className)} role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} filled={i <= Math.round(value)} className="h-3.5 w-3.5" />
      ))}
    </span>
  );
}

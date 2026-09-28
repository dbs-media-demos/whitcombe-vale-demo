import { hours } from "@/content/site";

const fmt = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${String(m).padStart(2, "0")} ${suffix}` : `${h12} ${suffix}`;
};
const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Current Dallas (America/Chicago) weekday and minutes since midnight. */
function dallasNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type OpenState = { open: boolean; label: string };

export function openState(now = new Date()): OpenState {
  const { day, minutes } = dallasNow(now);
  const today = hours.find((h) => h.day === day);
  if (today && minutes >= toMin(today.open) && minutes < toMin(today.close)) {
    return { open: true, label: `Open now · until ${fmt(today.close)}` };
  }
  // Find the next opening.
  for (let i = 0; i < 8; i++) {
    const d = (day + i) % 7;
    const slot = hours.find((h) => h.day === d);
    if (!slot) continue;
    if (i === 0 && minutes >= toMin(slot.open)) continue;
    const when = i === 0 ? "today" : i === 1 ? "tomorrow" : DAYS[d];
    return { open: false, label: `Closed · opens ${when} ${fmt(slot.open)}` };
  }
  return { open: false, label: "Closed" };
}

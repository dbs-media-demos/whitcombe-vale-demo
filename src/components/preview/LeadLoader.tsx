import { LeadLogo } from "@/components/brand/LeadLogo";
import { loaderSvg } from "@/lib/lead-logo";
import { loaderScript } from "@/lib/loader";

/** How long the exit takes in globals.css (the ink settling back, then wiping up like the page turn) */
const EXIT_MS = 900;

/**
 * A preview's first view in a tab opens on the firm's own logo, on the hero's deep green ink: the mark's
 * outlines draw themselves, their fills come in, the name rises out of a mask and a brass hairline draws
 * beneath it, as a letterhead would be set. Then the logo settles back and the ink lifts off the page (the
 * page turn's move), and the arched window rises behind it. ~2.5 s; a click or key skips it; reduced motion
 * shows the finished logo for 0.6 s, then fades. It's in the server HTML, so it's the first paint; the inline
 * script before it skips it on a reload in the same tab and times it (lib/loader.ts). The CSS hides it at
 * 3 s whatever happens.
 */
export function LeadLoader({ token, svg }: { token: string; svg: string }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: loaderScript(token, EXIT_MS) }} />
      <div className="lead-loader theme-ink" aria-hidden>
        <div className="lead-loader__inner">
          <LeadLogo svg={loaderSvg(svg)} className="lead-loader__logo" />
          <div className="lead-loader__rule" />
        </div>
      </div>
    </>
  );
}

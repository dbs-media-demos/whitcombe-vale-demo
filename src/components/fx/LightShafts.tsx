import clsx from "clsx";

/**
 * /v2's window light: the WebGL shader's afternoon shafts and drifting dust, in CSS alone. Like the
 * shader's canvas it is a dark pane over the photo (the opacity it is given sets how dark). Three soft
 * beams fall through it from the upper left and drift and breathe at different speeds; two layers of
 * dust motes float up through them. Transforms and opacity only (the compositor draws it),
 * desktop only, and still under reduced motion.
 */
export function LightShafts({ className }: { className?: string }) {
  return (
    <div aria-hidden className={clsx("pointer-events-none absolute inset-0 overflow-hidden bg-black", className)}>
      <span className="shafts absolute inset-0">
        <span className="shaft shaft-1" />
        <span className="shaft shaft-2" />
        <span className="shaft shaft-3" />
        <span className="dust-band">
          <span className="dust dust-1" />
          <span className="dust dust-2" />
        </span>
      </span>
      <style>{`
        .shafts { animation: shafts-in 1.6s ease-out 0.4s backwards; }
        @keyframes shafts-in { from { opacity: 0; } }
        .shaft {
          position: absolute; top: -20%; height: 140%;
          background: linear-gradient(to bottom, rgba(255, 226, 180, 0.5), rgba(255, 226, 180, 0.16) 55%, transparent 88%);
          filter: blur(18px);
          transform-origin: 50% 0;
          will-change: transform, opacity;
        }
        .shaft-1 { left: 28%; width: 12%; animation: shaft-a 13s ease-in-out infinite alternate; }
        .shaft-2 { left: 47%; width: 4%; opacity: .8; animation: shaft-b 17s ease-in-out infinite alternate; }
        .shaft-3 { left: 58%; width: 8%; opacity: .6; animation: shaft-c 11s ease-in-out infinite alternate; }
        @keyframes shaft-a { from { transform: rotate(-24deg) translateX(-6%); opacity: .75; } to { transform: rotate(-21deg) translateX(18%); opacity: 1; } }
        @keyframes shaft-b { from { transform: rotate(-22deg) translateX(10%); opacity: .45; } to { transform: rotate(-25deg) translateX(-14%); opacity: .9; } }
        @keyframes shaft-c { from { transform: rotate(-23deg) translateX(0); opacity: .35; } to { transform: rotate(-20deg) translateX(24%); opacity: .75; } }
        /* The motes show only inside the band of light; the band stays put while they drift through it */
        .dust-band {
          position: absolute; inset: 0;
          -webkit-mask-image: linear-gradient(112deg, transparent 28%, #000 42%, #000 62%, transparent 76%);
          mask-image: linear-gradient(112deg, transparent 28%, #000 42%, #000 62%, transparent 76%);
        }
        .dust { position: absolute; inset: -480px -460px; will-change: transform; }
        /* Each layer is one big tile of scattered motes that travels whole tiles per loop, so it never jumps */
        .dust-1 {
          background-image:
            radial-gradient(circle at 169px 81px, rgba(255, 236, 205, 0.33) 0 1.0px, transparent 1.9px),
            radial-gradient(circle at 424px 278px, rgba(255, 236, 205, 0.62) 0 0.8px, transparent 1.7px),
            radial-gradient(circle at 263px 113px, rgba(255, 236, 205, 0.54) 0 0.7px, transparent 1.6px),
            radial-gradient(circle at 39px 127px, rgba(255, 236, 205, 0.53) 0 0.8px, transparent 1.7px),
            radial-gradient(circle at 427px 293px, rgba(255, 236, 205, 0.42) 0 0.8px, transparent 1.7px),
            radial-gradient(circle at 325px 302px, rgba(255, 236, 205, 0.62) 0 1.5px, transparent 2.4px),
            radial-gradient(circle at 207px 29px, rgba(255, 236, 205, 0.33) 0 1.5px, transparent 2.4px),
            radial-gradient(circle at 72px 152px, rgba(255, 236, 205, 0.6) 0 1.0px, transparent 1.9px),
            radial-gradient(circle at 296px 161px, rgba(255, 236, 205, 0.68) 0 1.1px, transparent 2.0px);
          background-size: 431px 457px;
          animation: dust-1 46s linear infinite;
        }
        .dust-2 {
          background-image:
            radial-gradient(circle at 56px 301px, rgba(255, 236, 205, 0.4) 0 1.2px, transparent 2.1px),
            radial-gradient(circle at 53px 284px, rgba(255, 236, 205, 0.61) 0 1.3px, transparent 2.2px),
            radial-gradient(circle at 320px 109px, rgba(255, 236, 205, 0.59) 0 1.1px, transparent 2.0px),
            radial-gradient(circle at 164px 242px, rgba(255, 236, 205, 0.55) 0 1.2px, transparent 2.1px),
            radial-gradient(circle at 157px 131px, rgba(255, 236, 205, 0.68) 0 1.3px, transparent 2.2px),
            radial-gradient(circle at 128px 45px, rgba(255, 236, 205, 0.59) 0 1.2px, transparent 2.1px);
          background-size: 373px 409px;
          opacity: .6;
          filter: blur(0.6px);
          animation: dust-2 64s linear infinite;
        }
        @keyframes dust-1 { to { transform: translate3d(-431px, -457px, 0); } }
        @keyframes dust-2 { to { transform: translate3d(373px, -409px, 0); } }
        @media (prefers-reduced-motion: reduce) {
          .shafts, .shaft, .dust { animation: none !important; }
          .shaft { transform: rotate(-23deg); }
        }
      `}</style>
    </div>
  );
}

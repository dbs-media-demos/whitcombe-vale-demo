/*
 * The guard rails every live three.js scene goes through on a desktop. No three.js in here, so it can
 * run before the scene's code is fetched.
 *
 * - A real graphics chip or nothing: no WebGL 2, a "major performance caveat" or a software renderer
 *   keeps the still and never downloads three.js.
 * - The first 2 seconds of drawn frames are watched: under ~45 fps on average, a 3rd frame over 100 ms
 *   (or one over 400 ms) after warm-up, or a scene whose own frames cost over 1 ms of main thread (about
 *   0.25 ms on a fast desktop, so a CPU some four times slower), and the scene fades back to its still,
 *   so the next scene on the page starts as a still too. Two slow page loads keep the stills for the rest
 *   of the visit (sessionStorage); no proper GPU keeps them at once. The CPU test is there because a
 *   144 or 240 Hz screen keeps the frame rate high on a slow machine.
 *   One slow start (the GPU's first draw on a refresh) used to keep the stills for the whole tab: on
 *   18 Nov every refresh got the still. Under the old key only "gpu" counts now.
 */

const KEY = "wv-3d";
const SLOW_KEY = "wv-3d-slow";
const SLOW_LIMIT = 2;

// This page load ran slow: the scenes after it stay stills too (counted once per load)
let slowHere = false;

/** True once this machine has no proper GPU, or a scene has struggled on this page load or on two of this visit's. */
export function stillForVisit() {
  if (slowHere) return true;
  try {
    return sessionStorage.getItem(KEY) === "gpu" || Number(sessionStorage.getItem(SLOW_KEY) || 0) >= SLOW_LIMIT;
  } catch {
    return false;
  }
}

export function keepStillForVisit(why: "gpu" | "slow") {
  try {
    if (why === "gpu") sessionStorage.setItem(KEY, why);
    else if (!slowHere) sessionStorage.setItem(SLOW_KEY, String(Number(sessionStorage.getItem(SLOW_KEY) || 0) + 1));
  } catch {
    // private mode: the scene that struggled still fades back, the next one simply tries again
  }
  if (why === "slow") slowHere = true;
}

const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render|warp/i;

/**
 * A WebGL 2 context on the scene's own canvas, from the fast GPU, or null. three.js is handed this
 * context, so the check costs no second context.
 */
export function gpuContext(canvas: HTMLCanvasElement): WebGL2RenderingContext | null {
  let gl: WebGL2RenderingContext | null = null;
  try {
    gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      depth: true,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: true,
    });
  } catch {
    return null;
  }
  if (!gl || gl.isContextLost()) return null;
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const name = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
  if (SOFTWARE.test(name)) {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return null;
  }
  return gl;
}

export type FrameVerdict = { pass: boolean; fps: number; worst: number; frames: number; work: number };

/**
 * Fed the time between consecutive frames of the render loop and each frame's own work (ms). Scenes
 * render on demand, so only time spent drawing counts: the verdict comes after 2 s of drawn frames, or
 * at once on a 3rd frame over 100 ms (or one over 400 ms): a hitch or two (a font, an image decode) isn't
 * a slow computer. The first frames after the canvas appears are warm-up and are skipped: they pay
 * one-off costs (the GPU's first real draw took 371 ms on a refresh of a PC that then ran 112 fps).
 */
export function frameWatch(
  onVerdict: (v: FrameVerdict) => void,
  { span = 2000, minFps = 45, maxFrame = 100, maxWork = 1, warmup = 5 } = {},
) {
  let total = 0;
  let frames = 0;
  let worst = 0;
  let hitches = 0;
  let busy = 0;
  let skip = warmup;
  let done = false;
  return (dt: number, work = 0) => {
    if (done) return;
    if (skip > 0) {
      skip--;
      return;
    }
    total += dt;
    frames++;
    worst = Math.max(worst, dt);
    busy += work;
    const hitch = dt > maxFrame && (++hitches >= 3 || dt > maxFrame * 4);
    if (hitch || total >= span) {
      done = true;
      const fps = (frames * 1000) / total;
      const work = busy / frames;
      onVerdict({ pass: !hitch && fps >= minFps && work <= maxWork, fps, worst, frames, work });
    }
  };
}

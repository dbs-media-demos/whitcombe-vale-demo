/*
 * The guard rails every live three.js scene goes through on a desktop. No three.js in here, so it can
 * run before the scene's code is fetched.
 *
 * - A real graphics chip or nothing: no WebGL 2, a "major performance caveat" or a software renderer
 *   keeps the still and never downloads three.js.
 * - The first 2 seconds of drawn frames are watched: under ~45 fps on average, any frame over 100 ms
 *   after warm-up, or a scene whose own frames cost over 1 ms of main thread (about 0.25 ms on a fast
 *   desktop, so a CPU some four times slower), and the scene fades back to its still for the rest of
 *   the visit (sessionStorage), so the next scene starts as a still too. The last test is there because
 *   a 144 or 240 Hz screen keeps the frame rate high on a slow machine.
 */

const KEY = "wv-3d";

/** True once a scene has struggled on this machine during this visit. */
export function stillForVisit() {
  try {
    return sessionStorage.getItem(KEY) === "still";
  } catch {
    return false;
  }
}

export function keepStillForVisit() {
  try {
    sessionStorage.setItem(KEY, "still");
  } catch {
    // private mode: the scene that struggled still fades back, the next one simply tries again
  }
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
 * at once on a frame over 100 ms. The first frames after the canvas appears are warm-up and are skipped.
 */
export function frameWatch(
  onVerdict: (v: FrameVerdict) => void,
  { span = 2000, minFps = 45, maxFrame = 100, maxWork = 1, warmup = 2 } = {},
) {
  let total = 0;
  let frames = 0;
  let worst = 0;
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
    if (dt > maxFrame || total >= span) {
      done = true;
      const fps = (frames * 1000) / total;
      const work = busy / frames;
      onVerdict({ pass: worst <= maxFrame && fps >= minFps && work <= maxWork, fps, worst, frames, work });
    }
  };
}

"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

// Slow shafts of afternoon light falling through tall windows, with dust
// drifting inside the beams. Rendered additively (mix-blend: screen).
const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uIntro;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise1(float x) {
  float i = floor(x); float f = fract(x);
  float a = hash(vec2(i, 0.0)); float b = hash(vec2(i + 1.0, 0.0));
  return mix(a, b, f * f * (3.0 - 2.0 * f));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = uv; p.x *= uRes.x / uRes.y;
  float t = uTime * 0.05;

  // Light comes from the upper left and falls to the lower right.
  float ang = 0.5 + (uMouse.x - 0.5) * 0.08;
  float s = p.x * cos(ang) - p.y * sin(ang);

  float beams = smoothstep(0.52, 1.0, noise1(s * 5.0 + t * 2.4));
  beams += 0.55 * smoothstep(0.62, 1.0, noise1(s * 12.0 - t * 1.6 + 17.0));
  beams += 0.25 * smoothstep(0.7, 1.0, noise1(s * 24.0 + t * 1.1 + 41.0));
  float fall = smoothstep(-0.1, 1.0, uv.y) * (0.55 + 0.45 * smoothstep(1.2, 0.2, uv.x));
  beams *= fall;

  // Dust motes: one random point per grid cell, drifting slowly.
  vec2 q = p * 26.0 + vec2(t * 4.0, -t * 9.0);
  vec2 id = floor(q);
  vec2 f = fract(q) - 0.5;
  float h = hash(id);
  vec2 off = vec2(hash(id + 1.3), hash(id + 7.1)) - 0.5;
  off += 0.25 * vec2(sin(uTime * 0.31 + h * 6.28), cos(uTime * 0.27 + h * 6.28));
  float d = length(f - off * 0.7);
  float mote = smoothstep(0.07, 0.0, d) * step(0.84, h) * (0.55 + 0.45 * sin(uTime * 1.3 + h * 40.0));

  vec3 warm = vec3(1.0, 0.88, 0.68);
  vec3 col = warm * (beams * 0.34 + mote * (0.12 + beams * 1.6));
  gl_FragColor = vec4(col * uIntro, 1.0);
}
`;

function startLight(el: HTMLCanvasElement, fail: () => void): (() => void) | undefined {
  const gl = el.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
  if (!gl) {
    fail();
    return;
  }
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (process.env.NODE_ENV !== "production" && !gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn("WindowLight:", gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    fail();
    return;
  }
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "uRes");
  const uTime = gl.getUniformLocation(prog, "uTime");
  const uMouse = gl.getUniformLocation(prog, "uMouse");
  const uIntro = gl.getUniformLocation(prog, "uIntro");

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const scale = Math.min(window.devicePixelRatio, 1.5) * (coarse ? 0.4 : 0.55);
  const resize = () => {
    const w = Math.max(1, Math.floor(el.clientWidth * scale));
    const h = Math.max(1, Math.floor(el.clientHeight * scale));
    el.width = w;
    el.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uRes, w, h);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(el);

  const mouse = { x: 0.5, tx: 0.5 };
  const onMove = (e: PointerEvent) => (mouse.tx = e.clientX / window.innerWidth);
  window.addEventListener("pointermove", onMove, { passive: true });

  let visible = true;
  const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
  io.observe(el);

  const t0 = performance.now();
  const seed = Math.random() * 40;
  const minDelta = coarse ? 1000 / 30 : 0;
  let raf = 0;
  let last = 0;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden || now - last < minDelta) return;
    last = now;
    const t = (now - t0) / 1000;
    mouse.x += (mouse.tx - mouse.x) * 0.03;
    gl.uniform1f(uTime, seed + t);
    gl.uniform2f(uMouse, mouse.x, 0.5);
    gl.uniform1f(uIntro, Math.min(1, t / 2.5) ** 2);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener("pointermove", onMove);
    // Free GPU resources but keep the context (StrictMode remounts reuse it).
    gl.deleteBuffer(buf);
    gl.deleteProgram(prog);
  };
}

/**
 * WebGL light layer for the hero window. Starts when the browser is idle,
 * renders at reduced resolution (30fps on touch devices), pauses off-screen,
 * and falls back to a CSS gradient when WebGL is unavailable.
 */
export function WindowLight({ className }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- static fallback for reduced motion
      setFallback(true);
      return;
    }
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
    const handle = ric(
      () => {
        if (!cancelled && canvas.current) cleanup = startLight(canvas.current, () => setFallback(true));
      },
      { timeout: 2500 },
    );
    return () => {
      cancelled = true;
      (window.cancelIdleCallback ?? window.clearTimeout)(handle as number);
      cleanup?.();
    };
  }, []);

  return (
    <div aria-hidden className={clsx("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {fallback ? <div className="light-fallback absolute inset-0" /> : <canvas ref={canvas} className="absolute inset-0 h-full w-full mix-blend-screen" />}
    </div>
  );
}

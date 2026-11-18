import {
  ACESFilmicToneMapping,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  HalfFloatType,
  LatheGeometry,
  LinearSRGBColorSpace,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhysicalMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  RepeatWrapping,
  Scene,
  SphereGeometry,
  SpotLight,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLCubeRenderTarget,
  WebGLRenderer,
  type Material,
  type Texture,
} from "three";

/*
 * The firm's scales, in brass. Everything is turned from lathe profiles (the foot, the column, the
 * beam, the pans) so it reads as a real object made on a lathe, not a 3D icon. One warm key light
 * comes from the arched window to its right and throws the balance's shadow onto the wall behind it;
 * the wall and the floor exist only as that light (a soft pool) and that shadow, so the page's own
 * ink green stays the background.
 *
 * Desktop only: the hero imports this module with `await import()` after a media check, so phones
 * never download three.js. The same scene renders the still that phones and Serbian pages show.
 */

const PIVOT_Y = 2.6; // where the beam rests in the fork
const ARM = 1.13; // pivot to the hanger at each end of the beam
const DROP = 0.95; // hanger to the pan's rim
const LOOK = new Vector3(0, 1.42, 0);

/** Camera at rest: the still is rendered from exactly here, so the live canvas fades in without a jump. */
export const REST = { yaw: -0.2, pitch: 0.13, dist: 10.6, fov: 22 };

/** Seen at 4:3; the hero's box and the still share this aspect. */
export const ASPECT = 4 / 3;

const v = (r: number, y: number) => new Vector2(r, y);

/** A Catmull-Rom pass through the given profile points, so turned curves come out smooth. */
function smooth(pts: [number, number][], per = 6): Vector2[] {
  const out: Vector2[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let s = 0; s < per; s++) {
      const t = s / per;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push(v(Math.max(0, f(p0[0], p1[0], p2[0], p3[0])), f(p0[1], p1[1], p2[1], p3[1])));
    }
  }
  const last = pts[pts.length - 1];
  out.push(v(last[0], last[1]));
  return out;
}

/** The foot and column in one turned piece. Sharp steps are separate runs, so their edges stay crisp. */
function standProfile(): Vector2[] {
  return [
    v(0, 0),
    ...smooth([
      [0.98, 0],
      [1.04, 0.018],
      [1.055, 0.055],
      [1.04, 0.09],
      [1.0, 0.105],
    ], 5),
    v(0.95, 0.108),
    v(0.94, 0.112),
    ...smooth([
      [0.935, 0.118],
      [0.92, 0.15],
      [0.88, 0.172],
      [0.78, 0.19],
      [0.64, 0.225],
      [0.5, 0.28],
      [0.39, 0.34],
      [0.32, 0.39],
    ], 6),
    ...smooth([
      [0.3, 0.405],
      [0.322, 0.425],
      [0.322, 0.455],
      [0.29, 0.475],
    ], 4),
    ...smooth([
      [0.22, 0.49],
      [0.16, 0.515],
      [0.125, 0.555],
      [0.118, 0.59],
    ], 5),
    ...smooth([
      [0.135, 0.605],
      [0.142, 0.63],
      [0.135, 0.655],
      [0.1, 0.675],
    ], 4),
    v(0.078, 0.71),
    v(0.07, 1.4),
    v(0.063, 2.08),
    ...smooth([
      [0.072, 2.1],
      [0.092, 2.125],
      [0.096, 2.15],
      [0.09, 2.175],
      [0.066, 2.2],
    ], 4),
    v(0.06, 2.4),
    ...smooth([
      [0.075, 2.415],
      [0.088, 2.435],
      [0.088, 2.46],
    ], 3),
    v(0.0, 2.465),
  ];
}

/** The beam, turned along its length: a full hub, a long taper and a small knob at each end. */
function beamGeometry(): BufferGeometry {
  const half: [number, number][] = [
    [0.064, 0],
    [0.058, 0.09],
    [0.044, 0.22],
    [0.033, 0.5],
    [0.027, 0.85],
    [0.025, 1.06],
    [0.034, 1.1],
    [0.04, 1.135],
    [0.034, 1.17],
    [0.018, 1.19],
  ];
  const pts = smooth(
    [...half.slice(1).reverse().map(([r, y]) => [r, -y] as [number, number]), ...half],
    5,
  );
  const ends: Vector2[] = [v(0, -1.2), ...pts, v(0, 1.2)];
  const g = new LatheGeometry(ends, 40);
  g.rotateZ(Math.PI / 2);
  return g;
}

/** A shallow spun dish with a rolled lip: the outside, over the lip, then the inside. */
function panGeometry(): BufferGeometry {
  const outer = smooth([
    [0, -0.118],
    [0.14, -0.113],
    [0.27, -0.095],
    [0.36, -0.064],
    [0.415, -0.028],
    [0.44, -0.004],
  ], 6);
  const lip = smooth([
    [0.448, 0.004],
    [0.452, 0.013],
    [0.444, 0.019],
    [0.432, 0.014],
  ], 3);
  const inner = smooth([
    [0.42, 0.002],
    [0.395, -0.026],
    [0.34, -0.058],
    [0.255, -0.083],
    [0.13, -0.1],
    [0, -0.105],
  ], 6);
  return new LatheGeometry([...outer, ...lip, ...inner], 72);
}

/** Fine lathe marks: brightness varies along the profile and barely around it, like turned brass. */
function latheMarks(): Texture {
  const w = 64;
  const h = 512;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const rows: number[] = [];
  let walk = 0;
  for (let y = 0; y < h; y++) {
    walk = walk * 0.82 + (rnd() - 0.5) * 0.5;
    rows.push(walk);
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // green channel = roughness; around 0.8, so material.roughness 0.4 gives ~0.32 ± 0.05
      const g = 0.8 + rows[y] * 0.22 + (rnd() - 0.5) * 0.05;
      const i = (y * w + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.max(0, Math.min(255, g * 255));
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  return t;
}

/**
 * A room for the brass to reflect: dark, with a warm softbox where the window is (to the right),
 * a narrow cool strip on the left and a dim ceiling. Metal is only ever what it reflects.
 */
async function studio(renderer: WebGLRenderer): Promise<Texture> {
  const room = new Scene();
  room.background = new Color(0x07130f);
  const panel = (w: number, h: number, rgb: [number, number, number], pos: [number, number, number]) => {
    const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(...rgb), side: DoubleSide }));
    m.position.set(...pos);
    m.lookAt(0, 1.4, 0);
    room.add(m);
  };
  panel(4.2, 6.5, [6.4, 4.9, 3.2], [7, 4.2, 3.2]); // the window, warm
  panel(1.2, 7, [0.9, 1.05, 1.0], [-6.5, 2.2, 2.6]); // a cool strip, left
  panel(9, 9, [0.32, 0.28, 0.22], [0, 9, 0]); // ceiling
  panel(5, 1.2, [1.8, 1.4, 0.95], [-3, 4.5, -6]); // a warm kicker behind
  panel(14, 14, [0.05, 0.075, 0.06], [0, -3, 0]); // the floor, green-dark
  const pmrem = new PMREMGenerator(renderer);
  // The generator's filters (a 256-sample GGX pass among them) would compile on the main thread the
  // moment they are first used: a 200 ms freeze. So a dry run that draws nothing collects them, they
  // compile in parallel off the main thread, and only then is the map filtered for real, by the same
  // shaders, so it comes out identical.
  const rt = new WebGLCubeRenderTarget(16, { type: HalfFloatType, colorSpace: LinearSRGBColorSpace });
  const cam = new PerspectiveCamera();
  const compileFor = async (s: Scene) => {
    renderer.setRenderTarget(rt); // filters draw into float targets: compile them for one
    const done = renderer.compileAsync(s, cam);
    renderer.setRenderTarget(null);
    await done;
  };
  await compileFor(room);
  const gen = pmrem as unknown as { _renderCube: (t: unknown, lod: number, m: Material) => void };
  const real = gen._renderCube;
  const filters = new Scene();
  const box = new BoxGeometry(1, 1, 1);
  if (typeof real === "function") {
    const seen = new Set<Material>();
    gen._renderCube = (_t, _lod, m) => void seen.add(m);
    try {
      pmrem.fromScene(room, 0.035).dispose();
    } finally {
      gen._renderCube = real;
    }
    seen.forEach((m) => filters.add(new Mesh(box, m)));
    await compileFor(filters);
  }
  const env = pmrem.fromScene(room, 0.035).texture;
  pmrem.dispose();
  rt.dispose();
  box.dispose();
  room.traverse((o) => {
    if (o instanceof Mesh) {
      o.geometry.dispose();
      (o.material as Material).dispose();
    }
  });
  return env;
}

/**
 * The wall and the floor are only light: the material outputs the lit amount as alpha over a warm
 * parchment tint, so unlit areas are fully transparent and the shadow is where the light isn't.
 */
function lightCatcher(gain: number, max: number, res: { value: Vector2 }) {
  const m = new MeshLambertMaterial({ color: 0xffffff, transparent: true, depthWrite: false });
  m.onBeforeCompile = (s) => {
    s.uniforms.uRes = res;
    s.fragmentShader = s.fragmentShader
      .replace("void main() {", "uniform vec2 uRes;\nvoid main() {")
      .replace(
        "#include <opaque_fragment>",
        `float lum = dot(outgoingLight, vec3(0.2126, 0.7152, 0.0722));
        vec2 q = gl_FragCoord.xy / uRes;
        float edge = smoothstep(1.0, 0.45, length((q - 0.5) * 2.0));
        gl_FragColor = vec4(vec3(1.0, 0.9, 0.74), (1.0 - exp(-lum * ${gain.toFixed(3)})) * ${max.toFixed(3)} * edge);`,
      );
  };
  return m;
}

export type ScalesScene = {
  /** Pointer across the page, -1…1 on both axes. */
  pointer: (x: number, y: number) => void;
  /** Scroll: progress through the pinned hero (0…1) and the last scroll step in px. */
  scroll: (progress: number, dy: number) => void;
  /** The opening move: a weight seems to settle in one pan and the balance finds level again. */
  intro: () => void;
  resize: () => void;
  setVisible: (v: boolean) => void;
  /** Stops drawing for good (the last frame stays on the canvas while it fades out). */
  freeze: () => void;
  dispose: () => void;
  /** Stills only: the scene's parts, so scripts/render-scales-layers.mjs can render them one by one. */
  parts?: Record<string, unknown>;
};

export type ScalesOptions = {
  /** Render once into a readable buffer (scripts/render-scales.mjs). */
  still?: boolean;
  /** A different framing of the same scene: the phones' tighter still. */
  view?: { dist?: number; lookY?: number; lookX?: number };
  /** The live page's context, already checked for a real GPU (src/lib/live-3d.ts). */
  context?: WebGL2RenderingContext;
  /** For the frame watch: time since the last drawn frame and this frame's own main-thread work (ms). */
  onFrame?: (dt: number, work: number) => void;
};

/** Hands the main thread back between setup steps, so building the scene is never one long task. */
const pause = () => new Promise<void>((r) => setTimeout(r, 0));
const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

export async function createScales(canvas: HTMLCanvasElement, opts: ScalesOptions = {}): Promise<ScalesScene> {
  const renderer = new WebGLRenderer({
    canvas,
    context: opts.context,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: !!opts.still,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  const camera = new PerspectiveCamera(REST.fov, ASPECT, 0.5, 40);
  await pause();
  const env = await studio(renderer);
  await pause();
  const marks = latheMarks();
  await pause();

  const brass = new MeshPhysicalMaterial({
    color: new Color(0.93, 0.72, 0.42),
    metalness: 1,
    roughness: 0.36,
    roughnessMap: marks,
    clearcoat: 0.6,
    clearcoatRoughness: 0.18,
    envMap: env,
    envMapIntensity: 1.3,
  });
  const polished = brass.clone();
  polished.roughness = 0.22;
  polished.color = new Color(0.96, 0.76, 0.46);

  const all: Mesh[] = [];
  const mesh = (g: BufferGeometry, m: Material, shadows = true) => {
    const x = new Mesh(g, m);
    x.castShadow = shadows;
    x.receiveShadow = shadows;
    all.push(x);
    return x;
  };

  // ── the stand ──
  const balance = new Group();
  scene.add(balance);
  balance.add(mesh(new LatheGeometry(standProfile(), 96), brass));

  // The column runs on, slimmer, through the beam's hub to the finial
  const post = mesh(new CylinderGeometry(0.03, 0.036, 0.36, 24), polished);
  post.position.y = PIVOT_Y + 0.02;
  balance.add(post);
  const finial = mesh(
    new LatheGeometry(
      [
        v(0, 0),
        ...smooth([
          [0.045, 0],
          [0.062, 0.025],
          [0.04, 0.055],
          [0.032, 0.075],
          [0.058, 0.12],
          [0.062, 0.15],
          [0.044, 0.19],
          [0.016, 0.24],
          [0.007, 0.33],
        ], 5),
        v(0, 0.36),
      ],
      48,
    ),
    polished,
  );
  finial.position.y = PIVOT_Y + 0.19;
  balance.add(finial);
  const pin = mesh(new CylinderGeometry(0.028, 0.028, 0.15, 20).rotateX(Math.PI / 2), polished);
  pin.position.y = PIVOT_Y;
  balance.add(pin);

  await pause();

  // ── the beam and its pans ──
  const beam = new Group();
  beam.position.y = PIVOT_Y;
  balance.add(beam);
  beam.add(mesh(beamGeometry(), polished));
  // The hub: a turned boss on either face of the beam, round the pin
  const hub = mesh(
    new LatheGeometry(smooth([[0.0, 0.065], [0.05, 0.064], [0.074, 0.05], [0.082, 0.0], [0.074, -0.05], [0.05, -0.064], [0.0, -0.065]], 4), 40).rotateX(Math.PI / 2),
    polished,
  );
  beam.add(hub);

  const ringGeo = new TorusGeometry(0.036, 0.009, 10, 32);
  const panGeo = panGeometry();
  const chainGeo = new CylinderGeometry(0.0075, 0.0075, 1, 6);
  const knotGeo = new SphereGeometry(0.022, 16, 12);
  const pans: Group[] = [];
  for (const side of [-1, 1]) {
    const ring = mesh(ringGeo, polished);
    ring.position.set(side * ARM, -0.055, 0);
    beam.add(ring);

    const pan = new Group();
    pan.position.set(side * ARM, -0.092, 0);
    beam.add(pan);
    pans.push(pan);
    pan.add(mesh(knotGeo, polished));
    const dish = mesh(panGeo, brass);
    dish.position.y = -DROP;
    pan.add(dish);
    for (const a of [Math.PI / 6, (5 * Math.PI) / 6, (3 * Math.PI) / 2]) {
      const end = new Vector3(Math.cos(a) * 0.425, -DROP + 0.012, Math.sin(a) * 0.425);
      const chain = mesh(chainGeo, polished, false);
      chain.castShadow = true;
      chain.scale.y = end.length();
      chain.position.copy(end).multiplyScalar(0.5);
      chain.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), end.clone().normalize());
      pan.add(chain);
    }
  }

  await pause();

  // ── light ──
  const key = new SpotLight(0xffe2b8, 110, 0, 0.27, 1, 2);
  key.position.set(4.4, 6.2, 5.6);
  key.target.position.set(-0.7, 1.5, -1);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 9;
  key.shadow.bias = -0.0002;
  key.shadow.normalBias = 0.012;
  key.shadow.camera.near = 4;
  key.shadow.camera.far = 18;
  scene.add(key, key.target);

  const rim = new DirectionalLight(0xbfd6cc, 0.9);
  rim.position.set(-5, 4, -4);
  scene.add(rim);

  // ── the wall and the floor: only light and shadow ──
  const res = { value: new Vector2(1, 1) };
  const wall = new Mesh(new PlaneGeometry(14, 9), lightCatcher(6, 0.2, res));
  wall.position.set(0, 3, -1.5);
  wall.receiveShadow = true;
  const floor = new Mesh(new PlaneGeometry(14, 6), lightCatcher(2.4, 0.1, res));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 1.5);
  floor.receiveShadow = true;
  scene.add(wall, floor);

  // ── motion ──
  const s = {
    th: 0, // beam angle (rad, + lifts the right pan)
    om: 0,
    // pans: absolute swing in the beam's plane, and towards/away from the viewer
    ph: [0, 0],
    phv: [0, 0],
    ps: 0,
    psv: 0,
    lean: 0,
    leanY: 0,
    yaw: REST.yaw,
    pitch: REST.pitch,
    progress: 0,
    kick: 0,
  };
  let visible = true;
  let frozen = false;
  let raf = 0;
  let last = 0;

  const look = new Vector3(opts.view?.lookX ?? LOOK.x, opts.view?.lookY ?? LOOK.y, LOOK.z);
  const dist = opts.view?.dist ?? REST.dist;
  const place = () => {
    const d = dist * (1 - s.progress * 0.08);
    camera.position.set(
      look.x + Math.sin(s.yaw) * Math.cos(s.pitch) * d,
      look.y + Math.sin(s.pitch) * d,
      look.z + Math.cos(s.yaw) * Math.cos(s.pitch) * d,
    );
    camera.lookAt(look);
    beam.rotation.z = s.th;
    pans.forEach((p, i) => {
      p.rotation.z = s.ph[i] - s.th;
      p.rotation.x = s.ps * (i ? 1 : 0.8);
    });
  };

  const draw = () => {
    place();
    renderer.render(scene, camera);
  };

  const step = (dt: number) => {
    const p = s.progress;
    const settle = 1 - p * p * (3 - 2 * p);
    const target = (-s.lean * 0.075 - Math.sin(Math.PI * Math.min(1, p / 0.55)) * 0.07) * settle;
    // beam: a damped spring towards level (or the pointer's lean), period ~2 s
    const acc = -9 * (s.th - target) - 1.25 * s.om + s.kick;
    s.kick = 0;
    const om0 = s.om;
    s.om += acc * dt;
    s.th += s.om * dt;
    const alpha = (s.om - om0) / dt;
    // pans: real pendulums hung from the beam's ends, pushed by the ends' sideways motion
    for (let i = 0; i < 2; i++) {
      const side = i ? 1 : -1;
      const ax = -side * ARM * (Math.sin(s.th) * alpha + Math.cos(s.th) * s.om * s.om);
      const a = -9.3 * Math.sin(s.ph[i]) - ax * Math.cos(s.ph[i]) * 0.95 - 0.9 * s.phv[i];
      s.phv[i] += a * dt;
      s.ph[i] += s.phv[i] * dt;
    }
    s.psv += (-9.3 * s.ps - 0.8 * s.psv) * dt;
    s.ps += s.psv * dt;
    // the camera drifts a few degrees towards the pointer
    const ey = REST.yaw + s.lean * 0.16;
    const ep = REST.pitch + s.leanY * 0.05 + p * 0.05;
    s.yaw += (ey - s.yaw) * Math.min(1, dt * 3.2);
    s.pitch += (ep - s.pitch) * Math.min(1, dt * 3.2);
    const moving =
      Math.abs(s.om) + Math.abs(s.th - target) + Math.abs(s.phv[0]) + Math.abs(s.phv[1]) + Math.abs(s.ph[0]) + Math.abs(s.ph[1]) + Math.abs(s.psv) + Math.abs(s.ps) >
        0.0006 || Math.abs(ey - s.yaw) + Math.abs(ep - s.pitch) > 0.0004;
    return moving;
  };

  // Rendered on demand: frames run only while something moves and the hero is on screen
  const frame = (now: number) => {
    const t0 = performance.now();
    const dt = Math.min(1 / 30, last ? (now - last) / 1000 : 1 / 60);
    const moving = step(dt);
    draw();
    if (last) opts.onFrame?.(now - last, performance.now() - t0);
    last = now;
    raf = moving && visible && !document.hidden ? requestAnimationFrame(frame) : 0;
    if (!raf) last = 0;
  };
  const wake = () => {
    if (!raf && visible && !frozen && !opts.still && !document.hidden) raf = requestAnimationFrame(frame);
  };

  const resize = () => {
    const w = canvas.clientWidth || canvas.width;
    const h = canvas.clientHeight || canvas.height;
    renderer.setPixelRatio(opts.still ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.getDrawingBufferSize(res.value);
    draw();
  };
  // Shaders compile in parallel where the GPU driver allows it, off the main thread. Then frames are
  // drawn while the canvas is still invisible behind the still, so the shadow pass, the textures and
  // the reflections are all on the GPU before anyone sees a frame: the live scene never compiles or
  // uploads anything mid-scroll.
  place();
  await renderer.compileAsync(scene, camera);
  await pause();
  resize();
  if (!opts.still) {
    await nextFrame();
    draw();
    await nextFrame();
  }

  // A hidden tab stops the loop at once (and a fresh one starts on return, so the gap is never timed)
  const onVis = () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    } else wake();
  };
  document.addEventListener("visibilitychange", onVis);

  return {
    parts: opts.still ? { renderer, scene, camera, balance, beam, pans, pin, wall, floor, key, PIVOT_Y, ARM } : undefined,
    pointer(x, y) {
      s.lean = x;
      s.leanY = y;
      wake();
    },
    scroll(progress, dy) {
      s.progress = progress;
      const k = Math.max(-1, Math.min(1, dy / 60));
      s.kick += k * 2.2;
      s.psv += k * 0.35;
      wake();
    },
    intro() {
      s.om = -0.42;
      s.phv[1] = -0.12;
      wake();
    },
    resize() {
      if (!frozen) resize();
    },
    setVisible(vis) {
      visible = vis;
      if (vis) wake();
    },
    freeze() {
      frozen = true;
      cancelAnimationFrame(raf);
      raf = 0;
    },
    dispose() {
      frozen = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      for (const m of all) m.geometry.dispose();
      for (const m of [brass, polished, wall.material, floor.material]) (m as Material).dispose();
      wall.geometry.dispose();
      floor.geometry.dispose();
      env.dispose();
      marks.dispose();
      renderer.dispose();
      // Hand the GPU context back now rather than whenever the canvas is collected
      if (!opts.still) renderer.forceContextLoss();
    },
  };
}

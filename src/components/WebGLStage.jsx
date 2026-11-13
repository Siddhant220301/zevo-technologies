"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getDeviceProfile } from "@/lib/device";
import { pickVisitFormation } from "@/lib/formation";

export const faceRotations = [
  { x: 0, y: -Math.PI / 2, label: "01 // CUSTOM OPERATIONS & ERP" },
  { x: 0, y: Math.PI / 2, label: "02 // INTERACTIVE WEB APPS" },
  { x: Math.PI / 2, y: 0, label: "03 // WORKFLOW AUTOMATIONS" },
  { x: -Math.PI / 2, y: 0, label: "04 // MOTION & BRAND MEDIA" },
  { x: 0, y: 0, label: "05 // WEB APPLICATIONS" },
  { x: 0, y: Math.PI, label: "06 // MOBILE APPLICATIONS" },
];

const FRAME_MS = 1000 / 60;
const CUBE_COUNT = 26;
const TRANSITION_MS = 1150;
// How long the die keeps a face toward the viewer after a roll before it moves again
const HOLD_MS = 2600;
// Idle spin of the die, in radians per 60 Hz frame
const AMBIENT_SPIN = 0.0034;
const TIER_SCALE = { mvp: 0.9, standard: 1, expanded: 1.12 };
// The cluster may never be drawn smaller or larger than this, relative to its base size
const MIN_SCALE = 0.5;
const MAX_SCALE = 1.5;

const { clamp, lerp } = THREE.MathUtils;
// Converts a per-frame easing factor tuned at 60 Hz into one for this frame
const ease = (k, f) => 1 - Math.pow(1 - k, f);
const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// Cardinal spline through p1..p2 (p0 and p3 shape the curve); gives arcs instead of straight hops
const cardinal = (p0, p1, p2, p3, e) => {
  const m1 = 0.35 * (p2 - p0);
  const m2 = 0.35 * (p3 - p1);
  const e2 = e * e;
  const e3 = e2 * e;
  return (2 * e3 - 3 * e2 + 1) * p1 + (e3 - 2 * e2 + e) * m1 + (-2 * e3 + 3 * e2) * p2 + (e3 - e2) * m2;
};

export default function WebGLStage({ onReadoutChange, stageRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const profile = getDeviceProfile();
    const coarsePointer = profile.coarse;
    let cachedW = window.innerWidth;
    let cachedH = window.innerHeight;
    let disposed = false;

    /* =========================================================================
       1. RENDERER, ENVIRONMENT & LIGHTS
       ========================================================================= */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, cachedW / cachedH, 0.1, 100);
    camera.position.set(0, 0, 13);
    // World units visible from top to bottom of the canvas at z = 0
    const VIEW_HEIGHT = 2 * 13 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

    // If the browser cannot start WebGL the page simply shows without the 3D
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      canvas.style.display = "none";
      return undefined;
    }
    renderer.setSize(cachedW, cachedH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, profile.maxDpr));
    // Neutral tone mapping keeps Klein blue and vermilion true to the CSS tokens
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.0;

    // Studio environment: gives glass, chrome and clear-coat something to reflect
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.85;

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(8, 12, 10);
    scene.add(keyLight);

    const kleinLight = new THREE.PointLight(0x1e3aff, 2.4, 28);
    kleinLight.position.set(-7, 5, 7);
    scene.add(kleinLight);

    const vermilionLight = new THREE.PointLight(0xff331f, 1.3, 28);
    vermilionLight.position.set(7, -5, 6);
    scene.add(vermilionLight);

    const goldLight = new THREE.PointLight(0xd4ff00, 0.5, 25);
    goldLight.position.set(0, -6, 5);
    scene.add(goldLight);

    // Highlight that follows the cursor
    const cursorLight = new THREE.PointLight(0xffffff, 1.6, 16);
    cursorLight.position.set(0, 0, 5);
    scene.add(cursorLight);

    // Master group: holds the die and its satellite cubes
    const cluster = new THREE.Group();
    scene.add(cluster);

    /* =========================================================================
       2. DIE FACES (CANVAS TEXTURES)
       ========================================================================= */
    const faceSpecs = [
      { id: "01", title: "CUSTOM ERP", sub: "OPERATIONS & BILLING", pips: 1, bg1: "#0A1226", bg2: "#142852", accent: "#38BDF8", line: "#2563EB", textColor: "#FFFFFF" },
      { id: "02", title: "INTERACTIVE", sub: "WEB EXPERIENCES", pips: 2, bg1: "#1D4ED8", bg2: "#2563EB", accent: "#FACC15", line: "#FDE047", textColor: "#FFFFFF" },
      { id: "03", title: "AUTOMATIONS", sub: "WHATSAPP & REALTIME APIS", pips: 3, bg1: "#4C0519", bg2: "#881337", accent: "#FB7185", line: "#FDA4AF", textColor: "#FFFFFF" },
      { id: "04", title: "MOTION", sub: "KINETIC BRAND VISUALS", pips: 4, bg1: "#FFFFFF", bg2: "#E2E8F0", accent: "#0284C7", line: "#38BDF8", textColor: "#0F172A" },
      { id: "05", title: "WEB APPS", sub: "FULL-STACK NEXT.JS CLOUD", pips: 5, bg1: "#DC2626", bg2: "#EF4444", accent: "#FFFFFF", line: "#FEF08A", textColor: "#FFFFFF" },
      { id: "06", title: "MOBILE APPS", sub: "NATIVE IOS & ANDROID", pips: 6, bg1: "#064E3B", bg2: "#047857", accent: "#A7F3D0", line: "#34D399", textColor: "#FFFFFF" },
    ];

    // next/font renames the families, so read the real stacks from the CSS tokens
    const rootStyle = getComputedStyle(document.documentElement);
    const MONO = rootStyle.getPropertyValue("--font-mono").trim() || "monospace";
    const SANS = rootStyle.getPropertyValue("--font-sans").trim() || "sans-serif";
    const faceCanvases = [];

    function paintDiceFace(c, spec, time) {
      const ctx = c.getContext("2d");
      // Art is authored on a 512 grid and drawn at 2x for crisp lettering
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      ctx.clearRect(0, 0, 512, 512);

      const grad = ctx.createLinearGradient(0, 0, 512, 512);
      grad.addColorStop(0, spec.bg1);
      grad.addColorStop(1, spec.bg2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Outer bevel frame
      ctx.strokeStyle = spec.accent;
      ctx.lineWidth = 14;
      ctx.strokeRect(18, 18, 476, 476);

      // Inner border
      ctx.strokeStyle = spec.line;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(34, 34, 444, 444);

      // Hairlines
      ctx.strokeStyle = spec.bg1 === "#FFFFFF" ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(34, 138);
      ctx.lineTo(478, 138);
      ctx.moveTo(34, 385);
      ctx.lineTo(478, 385);
      ctx.stroke();

      // Corner index tag
      ctx.fillStyle = spec.accent;
      ctx.font = `700 30px ${MONO}`;
      ctx.fillText(`FACE // ${spec.id}`, 48, 88);

      // Pips
      for (let i = 0; i < spec.pips; i++) {
        const px = 435 - (i % 3) * 32;
        const py = 66 + Math.floor(i / 3) * 30;
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fillStyle = spec.accent;
        ctx.fill();
      }

      // Title
      ctx.fillStyle = spec.textColor;
      ctx.font = `800 52px ${SANS}`;
      ctx.fillText(spec.title, 48, 255);

      // Subtitle
      ctx.fillStyle = spec.accent;
      ctx.font = `700 24px ${MONO}`;
      ctx.fillText(spec.sub, 48, 305);

      // Signature
      ctx.fillStyle = spec.bg1 === "#FFFFFF" ? "#475569" : "rgba(255,255,255,0.7)";
      ctx.font = `600 18px ${MONO}`;
      ctx.fillText("ZEVO.TECH // DIGITAL STUDIO", 48, 445);

      // Moving read-out between subtitle and footer line: bars on odd faces,
      // a travelling pulse on even ones. `time` is undefined for the static paint.
      const t = time === undefined ? 0.8 : time;
      ctx.fillStyle = spec.accent;
      if (spec.pips % 2 === 1) {
        for (let i = 0; i < 9; i++) {
          const h = 10 + 26 * (0.5 + 0.5 * Math.sin(t * 2.4 + i * 0.9));
          ctx.globalAlpha = 0.55 + 0.45 * (h / 36);
          ctx.fillRect(48 + i * 22, 372 - h, 13, h);
        }
      } else {
        for (let i = 0; i < 12; i++) {
          const pulse = Math.max(0, 1 - Math.abs(((t * 5) % 14) - i) / 2.5);
          ctx.globalAlpha = 0.25 + 0.75 * pulse;
          ctx.beginPath();
          ctx.arc(56 + i * 20, 352, 4 + 4 * pulse, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    function createDiceFaceTexture(spec) {
      const c = document.createElement("canvas");
      c.width = 1024;
      c.height = 1024;
      paintDiceFace(c, spec);
      const tex = new THREE.CanvasTexture(c);
      // Canvas pixels are sRGB; without this the faces render washed out
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      faceCanvases.push({ canvas: c, spec, tex });
      return tex;
    }

    // Faces are first painted with whatever font is ready, then repainted once
    // the web fonts have loaded so the lettering is never stuck on a fallback
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (disposed) return;
        faceCanvases.forEach(({ canvas: c, spec, tex }) => {
          paintDiceFace(c, spec);
          tex.needsUpdate = true;
        });
      });
    }

    /* =========================================================================
       3. THE DIE AND ITS 26 SATELLITE CUBES
       ========================================================================= */
    const diceMaterials = faceSpecs.map(
      (spec) =>
        // Glossy lacquered face: clear-coat over the printed art
        new THREE.MeshPhysicalMaterial({
          map: createDiceFaceTexture(spec),
          roughness: 0.28,
          metalness: 0,
          clearcoat: 1,
          clearcoatRoughness: 0.06,
          emissive: new THREE.Color(spec.accent).multiplyScalar(0.05),
        })
    );

    const mainDie = new THREE.Mesh(new RoundedBoxGeometry(2.65, 2.65, 2.65, 5, 0.14), diceMaterials);
    cluster.add(mainDie);

    // Twelve clean edges around the die (no triangle diagonals)
    const mainCage = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(2.82, 2.82, 2.82)),
      new THREE.LineBasicMaterial({ color: 0x1e3aff, transparent: true, opacity: 0.55 })
    );
    mainDie.add(mainCage);

    const GLASS = { color: 0xdde6ff, emissive: 0x1e3aff, name: "FROSTED GLASS", roughness: 0.08, metalness: 0, opacity: 0.5 };
    const KLEIN = { color: 0x1e3aff, emissive: 0x1e3aff, name: "KLEIN CERAMIC", roughness: 0.22, metalness: 0 };
    const OBSIDIAN = { color: 0x0b0d14, emissive: 0x1e3aff, name: "OBSIDIAN", roughness: 0.14, metalness: 0.2 };
    const CHROME = { color: 0xe8ecf4, emissive: 0x9fb4ff, name: "POLISHED CHROME", roughness: 0.06, metalness: 1 };
    const VERMILION = { color: 0xff331f, emissive: 0xff331f, name: "VERMILION CERAMIC", roughness: 0.24, metalness: 0 };
    const GOLD = { color: 0xd4ff00, emissive: 0xd4ff00, name: "ACID GOLD", roughness: 0.26, metalness: 0 };

    // 13-step pattern used twice: 8 glass, 6 Klein, 4 obsidian, 4 chrome, 2 vermilion, 2 gold
    const subPalette = [
      GLASS, KLEIN, OBSIDIAN, CHROME, GLASS, VERMILION, KLEIN,
      GLASS, OBSIDIAN, CHROME, GOLD, KLEIN, GLASS,
    ];

    const subGeo = new RoundedBoxGeometry(0.58, 0.58, 0.58, 3, 0.05);
    const subCubes = [];

    for (let i = 0; i < CUBE_COUNT; i++) {
      const p = subPalette[i % subPalette.length];
      const mat = new THREE.MeshPhysicalMaterial({
        color: p.color,
        roughness: p.roughness,
        metalness: p.metalness,
        clearcoat: p.metalness === 1 ? 0 : 1,
        clearcoatRoughness: 0.08,
        emissive: new THREE.Color(p.emissive),
        emissiveIntensity: 0.06,
        transparent: p.opacity !== undefined,
        opacity: p.opacity !== undefined ? p.opacity : 1,
      });
      const cube = new THREE.Mesh(subGeo, mat);
      cube.userData = {
        index: i,
        name: p.name,
        baseGlow: 0.06,
        restGlow: 0.06,
        emphasis: 1,
        anchor: new THREE.Vector3(),
        from: new THREE.Vector3(),
        transStart: 0,
        transDur: TRANSITION_MS,
        rotSpeed: { x: (Math.random() - 0.5) * 0.015, y: (Math.random() - 0.5) * 0.015 },
        spinAxis: new THREE.Vector3(0, 1, 0),
        spinSpeed: 0,
        deflectX: 0,
        deflectY: 0,
        phase: i * 0.38 + Math.random() * 0.1,
      };
      cluster.add(cube);
      subCubes.push(cube);
    }

    /* =========================================================================
       4. FORMATIONS — each one is a shape AND a way of moving
         01 DICE RAIL     a loose cloud that swirls around the die in three
                          counter-rotating layers; the die tumbles freely
         02 VOXEL MATRIX  a strict 3 x 3 x 3 lattice that keeps turning one
                          slice at a time like a puzzle cube; the die clicks
                          a quarter turn with every move
         03 DNA HELIX     two strands that twist and flow upward in an endless
                          stream; the die spins on the helix axis like a spindle
         04 SATURN RINGS  three flat rings at different speeds whose plane
                          slowly wobbles; the die turns like a planet
       ========================================================================= */
    const X_AXIS = new THREE.Vector3(1, 0, 0);
    const Y_AXIS = new THREE.Vector3(0, 1, 0);
    const Z_AXIS = new THREE.Vector3(0, 0, 1);
    const AXES = [X_AXIS, Y_AXIS, Z_AXIS];

    // 0 at rest, towards 1 while the page is being scrolled fast
    let energy = 0;
    // Formation clock in seconds; runs faster while scrolling
    let motionTime = 0;

    // --- 01 DICE RAIL -----------------------------------------------------
    const SWIRL = [];
    for (let i = 0; i < CUBE_COUNT; i++) {
      const layer = i % 3;
      SWIRL.push({
        angle: (i / CUBE_COUNT) * Math.PI * 2,
        radius: 2.45 + layer * 0.7,
        height: ((i % 5) - 2) * 0.95,
        speed: [0.2, -0.14, 0.09][layer],
      });
    }
    const placeSwirl = (i, t, pos) => {
      const s = SWIRL[i];
      const a = s.angle + t * s.speed;
      pos.set(
        Math.cos(a) * s.radius,
        s.height + Math.sin(a * 2 + i) * 0.22,
        Math.sin(a) * s.radius * 0.75
      );
    };

    // --- 02 VOXEL MATRIX --------------------------------------------------
    const voxelCoord = [];
    const voxelQuat = [];
    for (let y = 1; y >= -1; y--) {
      for (let z = -1; z <= 1; z++) {
        for (let x = -1; x <= 1; x++) {
          if (x !== 0 || y !== 0 || z !== 0) {
            voxelCoord.push(new THREE.Vector3(x, y, z));
            voxelQuat.push(new THREE.Quaternion());
          }
        }
      }
    }
    // One slice of the lattice turns a quarter at a time
    const turn = { active: false, axis: 1, layer: 1, dir: 1, start: 0, dur: 0.62, nextAt: 0.6, angle: 0 };
    const turnQuat = new THREE.Quaternion();
    // The die's orientation inside the lattice (it clicks with every move)
    const dieGridQuat = new THREE.Quaternion();
    const dieTurnQuat = new THREE.Quaternion();

    function updateVoxelTurns(t) {
      if (!turn.active) {
        if (t >= turn.nextAt) {
          turn.active = true;
          turn.axis = Math.floor(Math.random() * 3);
          turn.layer = Math.random() < 0.4 ? 0 : Math.random() < 0.5 ? -1 : 1;
          turn.dir = Math.random() < 0.5 ? 1 : -1;
          turn.start = t;
          turn.angle = 0;
        }
        return;
      }
      const p = (t - turn.start) / turn.dur;
      if (p < 1) {
        turn.angle = turn.dir * (Math.PI / 2) * easeInOut(p);
        return;
      }
      // Bake the finished quarter turn into the lattice
      turnQuat.setFromAxisAngle(AXES[turn.axis], (turn.dir * Math.PI) / 2);
      for (let i = 0; i < CUBE_COUNT; i++) {
        if (Math.round(voxelCoord[i].getComponent(turn.axis)) === turn.layer) {
          voxelCoord[i].applyQuaternion(turnQuat).round();
          voxelQuat[i].premultiply(turnQuat).normalize();
        }
      }
      // The core turns with a middle slice and against an outer one, like gears
      dieTurnQuat.setFromAxisAngle(
        AXES[turn.axis],
        ((turn.layer === 0 ? turn.dir : -turn.dir) * Math.PI) / 2
      );
      dieGridQuat.premultiply(dieTurnQuat).normalize();
      turn.active = false;
      turn.angle = 0;
      turn.nextAt = t + 0.34;
    }

    const placeVoxel = (i, t, pos, quat) => {
      pos.copy(voxelCoord[i]).multiplyScalar(2.0);
      quat.copy(voxelQuat[i]);
      if (turn.active && Math.round(voxelCoord[i].getComponent(turn.axis)) === turn.layer) {
        turnQuat.setFromAxisAngle(AXES[turn.axis], turn.angle);
        pos.applyQuaternion(turnQuat);
        quat.premultiply(turnQuat);
      }
    };

    // --- 03 DNA HELIX -----------------------------------------------------
    const HELIX_STEPS = CUBE_COUNT / 2;
    // Height gained and angle turned per cube along a strand (about 1.7 turns overall)
    const HELIX_RISE = 0.62;
    const HELIX_TWIST = 0.82;
    const placeHelix = (i, t, pos, quat) => {
      const strand = i % 2;
      const index = (i - strand) / 2;
      // Each cube climbs the strand and re-enters at the bottom. Cubes 2k and
      // 2k + 1 always share a height on opposite strands: a base pair.
      const u = (index + t * 0.55) % HELIX_STEPS;
      const a = u * HELIX_TWIST + strand * Math.PI + t * 0.3;
      const r = 2.05 + 0.14 * Math.sin(u * 0.9 - t * 2.2);
      pos.set(Math.cos(a) * r, (u - HELIX_STEPS / 2) * HELIX_RISE, Math.sin(a) * r);
      quat.setFromAxisAngle(Y_AXIS, -a);
      // Shrink to nothing at both ends so the re-entry is never seen
      return Math.min(1, u / 1.3) * Math.min(1, (HELIX_STEPS - u) / 1.3);
    };

    // --- 04 SATURN RINGS --------------------------------------------------
    const RINGS = [
      { start: 0, count: 7, radius: 2.75, speed: 0.46 },
      { start: 7, count: 9, radius: 3.4, speed: 0.31 },
      { start: 16, count: 10, radius: 4.05, speed: 0.22 },
    ];
    const ringOf = (i) => (i < 7 ? 0 : i < 16 ? 1 : 2);
    const placeRing = (i, t, pos, quat) => {
      const k = ringOf(i);
      const ring = RINGS[k];
      const a = ((i - ring.start) / ring.count) * Math.PI * 2 + k * 0.7 + t * ring.speed;
      const r = ring.radius * (1 + 0.03 * Math.sin(t * 0.8 + k * 2));
      pos.set(Math.cos(a) * r, 0, Math.sin(a) * r);
      quat.setFromAxisAngle(Y_AXIS, -a);
    };

    // extent = the room the whole cluster needs at scale 1 (used for the shadow).
    // dieScale stays well above half size in every formation: the die is the
    // subject, the cubes arrange themselves around it.
    const FORMATIONS = {
      dice: { extent: { w: 8.2, h: 5.6 }, dieScale: 1, cubeScale: 1, float: 1, aligned: false, die: "tumble", place: placeSwirl },
      grid: { extent: { w: 6.9, h: 6.4 }, dieScale: 0.78, cubeScale: 1.4, float: 0, aligned: true, die: "click", place: placeVoxel },
      helix: { extent: { w: 5.1, h: 8.4 }, dieScale: 0.74, cubeScale: 0.85, float: 0.2, aligned: true, die: "spindle", place: placeHelix },
      saturn: { extent: { w: 8.7, h: 5.0 }, dieScale: 1, cubeScale: 0.8, float: 0.15, aligned: true, die: "planet", place: placeRing },
    };
    // Each visit shows the next formation in turn (see lib/formation.js)
    const visitFormation = pickVisitFormation();
    const formationKey = FORMATIONS[visitFormation] ? visitFormation : "dice";
    const formation = FORMATIONS[formationKey];

    const scratchPos = new THREE.Vector3();
    const scratchVec = new THREE.Vector3();
    const scratchCubeQuat = new THREE.Quaternion();
    const scratchQuatA = new THREE.Quaternion();
    const scratchQuatB = new THREE.Quaternion();
    const scratchQuatC = new THREE.Quaternion();
    const scratchQuatD = new THREE.Quaternion();
    const scratchEuler = new THREE.Euler();

    // Cubes start scattered; they fly into orbit once rendering begins
    subCubes.forEach((cube, i) => {
      const u = cube.userData;
      placeSwirl(i, 0, u.from);
      u.from.multiplyScalar(3.4);
      u.from.y += Math.sin(i * 2.3) * 3;
      u.anchor.copy(u.from);
      cube.position.copy(u.anchor);
    });

    /* =========================================================================
       5. ESTIMATOR LINK — cubes belonging to selected modules grow and glow
       ========================================================================= */
    let moduleState = window.__zevoModules || { faces: [0, 1], tier: "standard" };
    let activeSectionId = "hero";

    function refreshEmphasis() {
      const inEstimator = activeSectionId === "estimator";
      subCubes.forEach((cube, i) => {
        const u = cube.userData;
        const on = moduleState.faces.includes(i % 6);
        u.emphasis = inEstimator ? (on ? 1.22 : 0.68) : 1;
        u.restGlow = inEstimator ? (on ? 0.3 : 0) : u.baseGlow;
        gsap.to(cube.material, { emissiveIntensity: u.restGlow, duration: 0.5, overwrite: "auto" });
      });
    }

    const onModules = (e) => {
      moduleState = e.detail;
      refreshEmphasis();
    };
    window.addEventListener("zevo:modules", onModules);

    /* =========================================================================
       6. THE PATH
       One continuous curve, driven directly by scroll position, the way the
       original site moved: the die glides between places as the page moves
       and keeps its size. Keyframes come from the real layout, so they line
       up on any screen. Between them the die follows a spline, sweeps back in
       depth while it crosses, and drifts with the page near each stop.
         nx / ny  position in the viewport, -1..1 (right and up are positive)
         z        depth,  scale  size (kept inside 0.5 - 1.5 of the base size)
         ride     how much it travels with the page around that stop
       ========================================================================= */
    let path = [];
    let sections = [];
    let compactLayout = cachedW <= 1024;

    function buildPath() {
      const W = cachedW;
      const H = cachedH;
      compactLayout = W <= 1024;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - H);

      const topOf = (id) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : null;
      };
      // Centre of a reserved element in page coordinates (null when hidden)
      const centreOf = (selector) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        if (r.width < 8 || r.height < 8) return null;
        return { x: r.left + r.width / 2, y: r.top + window.scrollY + r.height / 2 };
      };

      const keys = [];
      const add = (s, nx, ny, z, scale, opacity, ride) => {
        if (s === null || Number.isNaN(s)) return;
        keys.push({ s: clamp(s, 0, maxScroll), nx, ny, z, scale, opacity, ride });
      };
      // A stop where a section's top sits `lead` viewport-heights below the top edge
      const at = (id, lead) => {
        const t = topOf(id);
        return t === null ? null : t - lead * H;
      };
      // A stop pinned to a reserved element: reached when that element's centre
      // is `where` of the way down the viewport
      const pin = (selector, where, z, scale, opacity, ride, fallback) => {
        const c = centreOf(selector);
        if (!c) {
          if (fallback) fallback();
          return;
        }
        const s = c.y - where * H;
        add(s, (c.x - W / 2) / (W / 2), -((c.y - s - H / 2) / (H / 2)), z, scale, opacity, ride);
      };

      if (!compactLayout) {
        // Desktop: right rail, left rail, right rail — then the reserved places
        add(0, 0.44, 0.02, 0, 1.0, 1, 0.1);
        add(at("about", 0.2), 0.47, 0.0, 0.2, 0.96, 1, 0.1);
        add(at("mission", 0.2), -0.52, -0.02, 0.6, 1.0, 1, 0.1);
        add(at("capabilities", 0.2), -0.56, 0.02, 0.4, 1.04, 1, 0.1);
        add(at("erp", 0.2), 0.48, 0.02, -0.2, 0.98, 1, 0.1);
        pin("#motion .stage-slot", 0.6, -0.3, 0.82, 1, 0.4, () =>
          add(at("motion", 0.15), -0.56, -0.4, -0.3, 0.82, 1, 0.3)
        );
        pin("#cases .stage-slot", 0.36, -0.5, 0.78, 1, 0.4, () =>
          add(at("cases", 0.1), 0.52, 0.4, -0.5, 0.78, 1, 0.3)
        );
        pin(".est-stage-window", 0.42, 0.2, 0.74, 1, 0.4, () =>
          add(at("estimator", 0.1), 0.62, 0.2, 0.2, 0.74, 1, 0.3)
        );
        // Contact: crosses to the open side and rises from the lower corner,
        // under the studio details and clear of the form
        add(at("contact", 0.1), -0.52, -0.84, 0.1, 0.86, 1, 0.2);
        pin("#closing-stage", 0.5, 0.3, 0.95, 1, 0.6, () => add(maxScroll, 0, -0.1, 0.3, 0.95, 1, 0.3));
      } else {
        // Phones and tablets: the die leads in the hero stage. After that it
        // presents each chapter — stepping, bright, into the gap between two
        // sections — then moves to the edge and fades to a soft glow behind
        // the glass cards while that section is read. Sides alternate.
        pin(".stage-slot--hero", 0.24, 0, 0.78, 1, 0.9, () => add(0, 0.5, 0.55, 0, 0.78, 1, 0.9));
        ["about", "mission", "capabilities", "erp", "motion", "cases", "estimator", "contact"].forEach(
          (id, n) => {
            const side = n % 2 ? -1 : 1;
            add(at(id, 0.36), side * 0.4, 0.42, 0.3, 0.86, 0.9, 0.3);
            add(at(id, -0.3), side * 0.96, -0.12, -0.7, 0.8, 0.36, 0.15);
          }
        );
        pin("#closing-stage", 0.5, 0.2, 0.8, 1, 0.8, () => add(maxScroll, 0, -0.2, 0.2, 0.8, 0.9, 0.3));
      }

      keys.sort((a, b) => a.s - b.s);
      for (let i = 1; i < keys.length; i++) {
        if (keys[i].s < keys[i - 1].s + 60) keys[i].s = keys[i - 1].s + 60;
      }
      path = keys;

      sections = ["hero", "about", "mission", "capabilities", "erp", "motion", "cases", "estimator", "contact"]
        .map((id) => ({ id, top: topOf(id) }))
        .filter((entry) => entry.top !== null);
    }

    const sample = { nx: 0.44, ny: 0, z: 0, scale: 1, opacity: 1 };

    function evalPath(s) {
      const n = path.length;
      if (n === 0) return;
      let i = 0;
      while (i < n - 2 && s >= path[i + 1].s) i++;
      const a = path[i];
      const b = path[Math.min(i + 1, n - 1)];
      const before = path[Math.max(i - 1, 0)];
      const after = path[Math.min(i + 2, n - 1)];
      const t = clamp((s - a.s) / Math.max(b.s - a.s, 1), 0, 1);
      const e = smoother(t);

      sample.nx = cardinal(before.nx, a.nx, b.nx, after.nx, e);
      sample.ny = cardinal(before.ny, a.ny, b.ny, after.ny, e);
      // Near a stop the die travels with the page a little, so it is never frozen
      sample.ny += lerp(a.ride * (s - a.s), b.ride * (s - b.s), e) / (cachedH / 2);

      // Crossing between two places: sweep back in depth and arc slightly
      const arc = Math.sin(Math.PI * e);
      const reach = Math.min(Math.hypot(b.nx - a.nx, b.ny - a.ny), 1.2);
      sample.z = lerp(a.z, b.z, e) - arc * reach * 1.5;
      sample.ny += arc * reach * 0.12 * (i % 2 ? -1 : 1);
      sample.scale = lerp(a.scale, b.scale, e);
      sample.opacity = lerp(a.opacity, b.opacity, e);
    }

    const groupInverse = () => scratchQuatB.copy(cluster.quaternion).invert();
    const DRIFT_AXIS = new THREE.Vector3(0.25, 0.85, 0.18).normalize();
    const targetGroupQuat = new THREE.Quaternion();

    const pose = { x: 0, y: 0, z: 0, scale: 1, opacity: 1 };
    let poseReady = false;
    let smoothScroll = window.scrollY;
    let lastRawScroll = window.scrollY;
    let appliedOpacity = -1;

    // "spin" idle · "hold" face toward viewer · "roll" tween · "drag" · "coast"
    let dieMode = "hold";
    let holdUntil = performance.now() + 2400;
    let dieScaleNow = 0.05;

    function updatePose(f) {
      if (path.length === 0) return;
      const H = cachedH;

      // How fast is the page moving? Feeds every formation's own motion.
      const raw = window.scrollY;
      const speed = Math.abs(raw - lastRawScroll) / Math.max(f, 0.01);
      lastRawScroll = raw;
      energy += (clamp(speed / 55, 0, 1) - energy) * ease(0.08, f);

      // Scrubbed with a little weight, like the original
      smoothScroll += (raw - smoothScroll) * ease(0.14, f);
      evalPath(smoothScroll);

      // Which section is in view (estimator link)
      const centre = raw + H / 2;
      let current = activeSectionId;
      for (let i = 0; i < sections.length; i++) {
        if (centre >= sections[i].top) current = sections[i].id;
      }
      if (current !== activeSectionId) {
        activeSectionId = current;
        refreshEmphasis();
      }

      const halfH = VIEW_HEIGHT / 2;
      const halfW = halfH * (cachedW / H);
      const tx = sample.nx * halfW;
      const ty = sample.ny * halfH;
      const ts = clamp(sample.scale, MIN_SCALE, MAX_SCALE);

      if (!poseReady) {
        pose.x = tx;
        pose.y = ty;
        pose.z = sample.z;
        pose.scale = ts;
        pose.opacity = sample.opacity;
        poseReady = true;
      }

      const k = ease(0.1, f);
      const prevX = pose.x;
      const prevY = pose.y;
      pose.x += (tx - pose.x) * k;
      pose.y += (ty - pose.y) * k;
      pose.z += (sample.z - pose.z) * k;
      pose.scale += (ts - pose.scale) * k;
      pose.opacity += (sample.opacity - pose.opacity) * k;
      cluster.position.set(pose.x, pose.y, pose.z);
      cluster.scale.setScalar(pose.scale);

      if (Math.abs(pose.opacity - appliedOpacity) > 0.01) {
        appliedOpacity = pose.opacity;
        canvas.style.opacity = pose.opacity.toFixed(2);
      }

      // The cluster turns as the page scrolls — each formation in its own way
      const turns = smoothScroll / H;
      let follow = 0.1;
      if (formation.die === "click") {
        // Voxel matrix: a three-quarter view that ratchets round in quarter turns
        scratchEuler.set(0.5, Math.PI / 4 + Math.round(turns * 2) * (Math.PI / 2), 0, "XYZ");
        targetGroupQuat.setFromEuler(scratchEuler);
        follow = 0.16;
      } else if (formation.die === "spindle") {
        // Helix: stands upright, sways like a pendulum and screws round with scroll
        scratchEuler.set(0.12, turns * 3.0, 0.22 * Math.sin(turns * 1.4), "ZXY");
        targetGroupQuat.setFromEuler(scratchEuler);
      } else if (formation.die === "planet") {
        // Saturn: the ring plane opens and closes with scroll and slowly wobbles
        const tilt = 0.44 + 0.13 * Math.sin(turns * 1.2);
        const wobble = motionTime * 0.22;
        targetGroupQuat
          .setFromAxisAngle(X_AXIS, 0.18)
          .multiply(scratchQuatC.setFromAxisAngle(Y_AXIS, wobble))
          .multiply(scratchQuatD.setFromAxisAngle(X_AXIS, tilt))
          .multiply(scratchQuatC.setFromAxisAngle(Y_AXIS, -wobble + turns * 0.8));
      } else {
        // Dice rail: tumbles end over end as the page moves, like the original
        scratchEuler.set(turns * 2.1, turns * 2.65, turns * 0.84, "XYZ");
        targetGroupQuat.setFromEuler(scratchEuler);
      }
      cluster.quaternion.slerp(targetGroupQuat, ease(follow, f));

      // While it travels the free-tumbling die also rolls the way a real one would
      if (dieMode === "spin" && formation.die === "tumble") {
        const radius = Math.max(1.325 * pose.scale * dieScaleNow, 0.05);
        const rollZ = clamp(-(pose.x - prevX) / radius, -0.3, 0.3);
        const rollX = clamp((pose.y - prevY) / radius, -0.3, 0.3);
        if (Math.abs(rollZ) > 0.0005) {
          mainDie.rotateOnWorldAxis(scratchVec.copy(Z_AXIS).applyQuaternion(groupInverse()), rollZ);
        }
        if (Math.abs(rollX) > 0.0005) {
          mainDie.rotateOnWorldAxis(scratchVec.copy(X_AXIS).applyQuaternion(groupInverse()), rollX);
        }
      }
    }

    /* =========================================================================
       7. THE DIE'S OWN MOTION
       It is always moving, and how it moves belongs to the formation. After a
       roll it holds the landed face toward the viewer for a moment, then goes
       back to what that formation does.
       ========================================================================= */
    const faceQuats = faceRotations.map((r) =>
      new THREE.Quaternion().setFromEuler(new THREE.Euler(r.x, r.y, 0))
    );
    const restQuat = faceQuats[0].clone();
    const setDieWorldQuat = (q) => mainDie.quaternion.copy(groupInverse()).multiply(q);
    setDieWorldQuat(restQuat);

    let currentFaceIndex = 0;
    let spinSpeed = 0;
    let coastSpeed = 0;
    let spindleAngle = 0;
    let planetAngle = 0;
    const coastAxis = new THREE.Vector3(0, 1, 0);
    const faceTween = { t: 0 };
    const modeQuat = new THREE.Quaternion();

    // Shortest-arc slerp to a face. With `tumble` the die also spins two full
    // turns and hops, like a real roll, before settling.
    function rollMainDieToFace(faceIndex, opts = {}) {
      const tumble = Boolean(opts.tumble);
      currentFaceIndex = faceIndex % faceRotations.length;
      const targetQuat = faceQuats[currentFaceIndex];
      const startQuat = mainDie.getWorldQuaternion(new THREE.Quaternion());
      const tumbleAxis = new THREE.Vector3(0.6, 1, 0.25).normalize();
      const tumbleQuat = new THREE.Quaternion();
      const blend = new THREE.Quaternion();

      dieMode = "roll";
      gsap.killTweensOf(faceTween);
      faceTween.t = 0;

      gsap.to(faceTween, {
        t: 1,
        duration: tumble ? 1.5 : 1.05,
        ease: "power3.out",
        onUpdate: () => {
          blend.copy(startQuat).slerp(targetQuat, faceTween.t);
          if (tumble) {
            tumbleQuat.setFromAxisAngle(tumbleAxis, (1 - faceTween.t) * Math.PI * 4);
            blend.multiply(tumbleQuat);
          }
          setDieWorldQuat(blend);
        },
        onComplete: () => {
          restQuat.copy(targetQuat);
          dieMode = "hold";
          holdUntil = performance.now() + HOLD_MS;
          if (tumble && navigator.vibrate && navigator.userActivation?.hasBeenActive) {
            navigator.vibrate([10, 40, 18]);
          }
        },
      });

      if (tumble) {
        gsap.killTweensOf(mainDie.position);
        gsap.fromTo(
          mainDie.position,
          { y: 0 },
          { y: 0.55, duration: 0.42, ease: "power2.out", yoyo: true, repeat: 1 }
        );
      }

      if (onReadoutChange) onReadoutChange(faceRotations[currentFaceIndex].label);
    }

    // After a flick the die coasts, then lands on whichever face is closest
    function landOnNearestFace() {
      const world = mainDie.getWorldQuaternion(scratchQuatA);
      let best = 0;
      let bestAngle = Infinity;
      faceQuats.forEach((q, i) => {
        const angle = world.angleTo(q);
        if (angle < bestAngle) {
          bestAngle = angle;
          best = i;
        }
      });
      rollMainDieToFace(best);
    }

    // Flash every cube in a quick wave
    function rippleCubes(peak, wave) {
      subCubes.forEach((cube, idx) => {
        gsap.to(cube.material, {
          emissiveIntensity: peak,
          duration: 0.22,
          delay: (idx % wave) * 0.02,
          yoyo: true,
          repeat: 1,
        });
        // Free-tumbling cubes also flip; ordered formations keep their order
        if (!formation.aligned) {
          const u = cube.userData;
          u.spinAxis.copy(Y_AXIS);
          u.spinSpeed = 0.16;
        }
      });
    }

    function rollRandom() {
      rippleCubes(1.1, 6);
      rollMainDieToFace(Math.floor(Math.random() * 6), { tumble: true });
    }

    function updateDie(f, now, dt) {
      const tier = activeSectionId === "estimator" ? TIER_SCALE[moduleState.tier] || 1 : 1;
      // Whatever the cluster and the formation ask for, the die itself is never
      // drawn smaller than half or larger than one and a half times its base size
      const wanted = clamp(
        formation.dieScale * tier,
        MIN_SCALE / Math.max(pose.scale, MIN_SCALE),
        MAX_SCALE / Math.max(pose.scale, MIN_SCALE)
      );
      dieScaleNow += (wanted - dieScaleNow) * ease(0.07, f);
      mainDie.scale.setScalar(dieScaleNow);

      // These keep running so the die re-joins its formation in step
      spindleAngle += dt * (1.5 + 3.5 * energy);
      planetAngle += dt * 0.55 * (1 + energy);

      if (dieMode === "roll" || dieMode === "drag") return;

      if (dieMode === "hold") {
        scratchEuler.set(Math.sin(now * 0.0011) * 0.08, Math.sin(now * 0.0008) * 0.12, 0, "XYZ");
        scratchQuatA.copy(restQuat).multiply(scratchQuatC.setFromEuler(scratchEuler));
        setDieWorldQuat(scratchQuatA);
        if (now > holdUntil) {
          dieMode = "spin";
          spinSpeed = 0;
        }
        return;
      }

      if (dieMode === "coast") {
        coastSpeed *= Math.pow(0.952, f);
        mainDie.rotateOnWorldAxis(
          scratchVec.copy(coastAxis).applyQuaternion(groupInverse()),
          coastSpeed * f
        );
        if (coastSpeed < 0.006) landOnNearestFace();
        return;
      }

      if (formation.die === "tumble") {
        // Free spin; scrolling whips it up
        spinSpeed += (AMBIENT_SPIN * (1 + 2.5 * energy) - spinSpeed) * ease(0.03, f);
        mainDie.rotateOnWorldAxis(DRIFT_AXIS, spinSpeed * f);
        return;
      }

      // Ordered formations give the die a fixed role inside the cluster
      if (formation.die === "click") {
        modeQuat.copy(dieGridQuat);
        if (turn.active) {
          const dir = turn.layer === 0 ? 1 : -1;
          modeQuat.premultiply(scratchQuatC.setFromAxisAngle(AXES[turn.axis], turn.angle * dir));
        }
      } else if (formation.die === "spindle") {
        modeQuat.setFromAxisAngle(Y_AXIS, spindleAngle);
      } else {
        modeQuat
          .setFromAxisAngle(Z_AXIS, 0.12)
          .multiply(scratchQuatC.setFromAxisAngle(Y_AXIS, planetAngle));
      }
      mainDie.quaternion.slerp(modeQuat, ease(0.16, f));
    }

    function updateCubes(f, now) {
      if (formationKey === "grid") updateVoxelTurns(motionTime);

      const alignEase = ease(0.14, f);
      const sizeEase = ease(0.1, f);
      const deflectDecay = Math.pow(0.92, f);
      const bob = formation.float;
      const tumbleBoost = 1 + 3 * energy;

      for (let i = 0; i < subCubes.length; i++) {
        const cube = subCubes[i];
        const u = cube.userData;
        const placeScale = formation.place(i, motionTime, scratchPos, scratchCubeQuat);

        // Position: staggered blend from where the cube was into the formation.
        // The target keeps moving, so orbits, turns and flows never stop.
        if (u.transStart) {
          const p = (now - u.transStart) / u.transDur;
          if (p >= 1) {
            u.transStart = 0;
            u.anchor.copy(scratchPos);
          } else if (p <= 0) {
            u.anchor.copy(u.from);
          } else {
            u.anchor.copy(u.from).lerp(scratchPos, 1 - Math.pow(1 - p, 3));
          }
        } else {
          u.anchor.copy(scratchPos);
        }

        // Orientation: a flicked cube spins freely, then falls back in line
        if (u.spinSpeed > 0.0004) {
          cube.rotateOnWorldAxis(
            scratchVec.copy(u.spinAxis).applyQuaternion(groupInverse()),
            u.spinSpeed * f
          );
          u.spinSpeed *= Math.pow(0.956, f);
        } else if (formation.aligned) {
          cube.quaternion.slerp(scratchCubeQuat, alignEase);
        } else {
          cube.rotation.x += u.rotSpeed.x * f * tumbleBoost;
          cube.rotation.y += u.rotSpeed.y * f * tumbleBoost;
        }

        if (u.deflectX || u.deflectY) {
          u.deflectX *= deflectDecay;
          u.deflectY *= deflectDecay;
          if (Math.abs(u.deflectX) < 0.0005) u.deflectX = 0;
          if (Math.abs(u.deflectY) < 0.0005) u.deflectY = 0;
        }

        const tNow = now * 0.001;
        cube.position.set(
          u.anchor.x + Math.cos(tNow * 0.83 + u.phase) * 0.045 * bob + u.deflectX,
          u.anchor.y + Math.sin(tNow * 1.12 + u.phase) * 0.08 * bob + u.deflectY,
          u.anchor.z + Math.sin(tNow * 0.76 + u.phase * 1.2) * 0.045 * bob
        );

        const wanted = formation.cubeScale * u.emphasis * (placeScale === undefined ? 1 : placeScale);
        // Shrinking for a helix re-entry has to be immediate; everything else eases
        const size =
          wanted < cube.scale.x && placeScale !== undefined
            ? wanted
            : cube.scale.x + (wanted - cube.scale.x) * sizeEase;
        cube.scale.setScalar(Math.max(size, 0.0001));
      }
    }

    /* =========================================================================
       8. SHADOW AND LIVE FACE
       ========================================================================= */
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext("2d");
    const shadowGrad = shadowCtx.createRadialGradient(64, 64, 4, 64, 64, 64);
    shadowGrad.addColorStop(0, "rgba(255,255,255,1)");
    shadowGrad.addColorStop(1, "rgba(255,255,255,0)");
    shadowCtx.fillStyle = shadowGrad;
    shadowCtx.fillRect(0, 0, 128, 128);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(shadowCanvas),
      color: 0x090a0f,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      toneMapped: false,
    });
    const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shadowMat);
    shadowMesh.renderOrder = -1;
    scene.add(shadowMesh);
    let shadowW = 8.2;
    let shadowDrop = 3.3;

    function updateShadow(f) {
      const dark = document.body.classList.contains("dark-chapter");
      shadowMat.color.set(dark ? 0x4462ff : 0x090a0f);
      shadowMat.opacity = dark ? 0.26 : 0.2;
      const k = ease(0.08, f);
      shadowW += (formation.extent.w - shadowW) * k;
      shadowDrop += (formation.extent.h / 2 + 0.5 - shadowDrop) * k;
      shadowMesh.position.set(pose.x, pose.y - shadowDrop * pose.scale, pose.z - 2);
      shadowMesh.scale.set(shadowW * pose.scale, 2.1 * pose.scale, 1);
    }

    // The face pointing at the viewer plays a small moving read-out. Capable
    // desktops only, one face at a time, about 11 times a second.
    const FACE_NORMALS = [
      new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1),
    ];
    const liveFaces = profile.tier >= 3;
    let lastLivePaint = 0;

    function updateLiveFace(now) {
      if (!liveFaces || now - lastLivePaint < 90 || faceCanvases.length < 6) return;
      lastLivePaint = now;
      const world = mainDie.getWorldQuaternion(scratchQuatA);
      let front = 0;
      let bestZ = -Infinity;
      FACE_NORMALS.forEach((n, i) => {
        const z = scratchVec.copy(n).applyQuaternion(world).z;
        if (z > bestZ) {
          bestZ = z;
          front = i;
        }
      });
      const face = faceCanvases[front];
      paintDiceFace(face.canvas, face.spec, now / 1000);
      face.tex.needsUpdate = true;
    }

    /* =========================================================================
       9. PARTICLES AND CHAPTER THEME
       ========================================================================= */
    const particleCount = 300;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 26;
      particlePositions[i + 1] = (Math.random() - 0.5) * 22;
      particlePositions[i + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x1e3aff,
      size: 0.065,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    const darkParticleColor = new THREE.Color(0xd4ff00);
    const lightParticleColor = new THREE.Color(0x1e3aff);
    const targetParticleColor = lightParticleColor.clone();

    function updateChapterTheme(isDark) {
      // The mobile browser chrome follows the chapter colour
      const themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) themeMeta.setAttribute("content", isDark ? "#06070B" : "#F4F2ED");
      document.body.classList.toggle("dark-chapter", isDark);
      document.documentElement.classList.toggle("dark-chapter", isDark);
      targetParticleColor.copy(isDark ? darkParticleColor : lightParticleColor);
    }
    updateChapterTheme(false);

    const chapterTrigger = ScrollTrigger.create({
      trigger: "#motion",
      endTrigger: "#estimator",
      start: "top 50%",
      end: "top 50%",
      onEnter: () => updateChapterTheme(true),
      onLeave: () => updateChapterTheme(false),
      onEnterBack: () => updateChapterTheme(true),
      onLeaveBack: () => updateChapterTheme(false),
    });

    /* =========================================================================
       10. PUBLIC API (header and menu roll buttons, capability list, estimator)
       ========================================================================= */
    if (stageRef) {
      stageRef.current = {
        rollToFace: rollMainDieToFace,
        rollRandom,
      };
    }

    // QA hook (?debug in the address): lets a test read where the die is on
    // screen and how large it is drawn relative to its base size
    const debugMode = new URLSearchParams(window.location.search).has("debug");
    if (debugMode) {
      window.__zevoStage = {
        state: () => {
          const p = scratchVec.copy(cluster.position).project(camera);
          return {
            x: Math.round(((p.x + 1) / 2) * cachedW),
            y: Math.round(((1 - p.y) / 2) * cachedH),
            // drawn die size / base die size, depth included
            ratio: Number(((pose.scale * mainDie.scale.x * 13) / (13 - pose.z)).toFixed(3)),
            clusterScale: Number(pose.scale.toFixed(3)),
            opacity: Number(pose.opacity.toFixed(2)),
            formation: formationKey,
            section: activeSectionId,
            dieMode,
            pixelRatio: renderer.getPixelRatio(),
            beganAt,
            settled: beganAt > 0 && subCubes.every((cube) => !cube.userData.transStart),
          };
        },
        path: () =>
          path.map((k) => ({
            s: Math.round(k.s),
            nx: Number(k.nx.toFixed(2)),
            ny: Number(k.ny.toFixed(2)),
            scale: k.scale,
            opacity: k.opacity,
          })),
      };
    }

    /* =========================================================================
       11. POINTER: DRAG TO SPIN, TAP TO ROLL, HOVER TO GLOW
       ========================================================================= */
    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2(-9999, -9999);
    let hoveredObject = null;
    let activeDragObject = null;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let dragStartTime = 0;
    let lastMoveTime = 0;
    let totalDragDist = 0;
    let dragSpeed = 0;

    function resolveInteractiveTarget(hitObj) {
      if (!hitObj) return null;
      if (hitObj === mainDie || hitObj === mainCage || hitObj.parent === mainDie) return mainDie;
      for (let i = 0; i < subCubes.length; i++) {
        if (hitObj === subCubes[i] || hitObj.parent === subCubes[i]) return subCubes[i];
      }
      return null;
    }

    function pick(e) {
      pointerNDC.x = (e.clientX / cachedW) * 2 - 1;
      pointerNDC.y = -(e.clientY / cachedH) * 2 + 1;
      raycaster.setFromCamera(pointerNDC, camera);
      const hits = raycaster.intersectObjects([mainDie, ...subCubes], true);
      return hits.length > 0 ? resolveInteractiveTarget(hits[0].object) : null;
    }

    const cursorRing = document.getElementById("cursorRing");
    const cursorText = document.getElementById("cursorText");

    // Hover lights a cube or the die's cage. No zoom, no scale.
    function setHovered(target) {
      if (hoveredObject === target) return;

      if (hoveredObject && hoveredObject !== mainDie) {
        gsap.to(hoveredObject.material, {
          emissiveIntensity: hoveredObject.userData.restGlow,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else if (hoveredObject === mainDie) {
        gsap.to(mainCage.material, { opacity: 0.55, duration: 0.3, overwrite: "auto" });
      }

      hoveredObject = target;

      if (!target) {
        if (cursorRing && !isDragging) {
          cursorRing.classList.remove("has-label", "mode-drag", "mode-explore");
          if (cursorText) cursorText.textContent = "";
        }
        return;
      }

      if (target === mainDie) {
        gsap.to(mainCage.material, { opacity: 0.95, duration: 0.25, overwrite: "auto" });
        if (cursorRing) {
          cursorRing.classList.add("has-label", "mode-drag");
          cursorRing.classList.remove("mode-explore");
          if (cursorText) cursorText.textContent = "ROTATE";
        }
      } else {
        gsap.to(target.material, {
          emissiveIntensity: 1.2,
          duration: 0.22,
          ease: "power2.out",
          overwrite: "auto",
        });
        if (cursorRing) {
          cursorRing.classList.add("has-label", "mode-explore");
          cursorRing.classList.remove("mode-drag");
          if (cursorText) cursorText.textContent = `SATELLITE // ${target.userData.name}`;
        }
      }
    }

    function onPointerDown(e) {
      const hitTarget = pick(e);
      // A finger only grabs the die when it lands on it; anywhere else it scrolls
      if (e.pointerType === "touch" && !hitTarget) return;

      prevX = e.clientX;
      prevY = e.clientY;
      dragStartTime = performance.now();
      lastMoveTime = dragStartTime;
      totalDragDist = 0;
      dragSpeed = 0;

      activeDragObject = hitTarget || mainDie;
      isDragging = true;
      if (activeDragObject === mainDie) {
        gsap.killTweensOf(faceTween);
        dieMode = "drag";
      }
      requestMotionAccess();

      if (cursorRing) {
        cursorRing.classList.add("has-label", "mode-drag");
        if (cursorText) {
          cursorText.textContent = activeDragObject === mainDie ? "SPINNING DIE" : "SPIN SATELLITE";
        }
      }
    }

    function onPointerMove(e) {
      if (isDragging && activeDragObject) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        const stepDist = Math.hypot(dx, dy);
        totalDragDist += stepDist;

        if (stepDist > 0.05) {
          // Rotate about the screen-space axis perpendicular to the drag
          const worldAxis = new THREE.Vector3(dy, dx, 0).normalize().transformDirection(camera.matrixWorld);
          const sensitivity = activeDragObject === mainDie ? 0.0075 : 0.0135;
          const rawAngle = stepDist * sensitivity;

          // The cluster is rotated, so the axis is converted into its space
          activeDragObject.rotateOnWorldAxis(
            scratchVec.copy(worldAxis).applyQuaternion(groupInverse()),
            rawAngle
          );

          // Momentum is stored per 60 Hz frame so a flick feels the same on any display
          const moveNow = performance.now();
          const eventFrames = Math.min(Math.max((moveNow - lastMoveTime) / FRAME_MS, 0.25), 4);
          lastMoveTime = moveNow;
          const angle = rawAngle / eventFrames;

          if (activeDragObject === mainDie) {
            coastAxis.copy(worldAxis);
            dragSpeed = lerp(dragSpeed, angle, 0.65);
          } else {
            const u = activeDragObject.userData;
            u.spinAxis.copy(worldAxis);
            u.spinSpeed = Math.min(0.14, u.spinSpeed * 0.35 + angle * 1.5);
            u.deflectX = clamp(u.deflectX + dx * 0.0035, -0.9, 0.9);
            u.deflectY = clamp(u.deflectY - dy * 0.0035, -0.9, 0.9);
          }
        }

        prevX = e.clientX;
        prevY = e.clientY;
        return;
      }

      setHovered(pick(e));
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      const elapsed = performance.now() - dragStartTime;
      const tapped = totalDragDist < 7 && elapsed < 320;

      if (activeDragObject === mainDie) {
        if (tapped) {
          rippleCubes(1.0, 8);
          rollMainDieToFace((currentFaceIndex + 1) % 6, { tumble: true });
        } else {
          coastSpeed = Math.min(dragSpeed, 0.085);
          dieMode = "coast";
        }
      } else if (tapped && activeDragObject) {
        // Tapped a satellite: it spins in place and flashes
        const cube = activeDragObject;
        const u = cube.userData;
        u.spinAxis.set(0.6, 1, 0).normalize();
        u.spinSpeed = 0.3;
        gsap.to(cube.material, { emissiveIntensity: 1.5, duration: 0.18, yoyo: true, repeat: 1 });

        if (onReadoutChange) {
          onReadoutChange(`SATELLITE // ${u.name} [PULSE]`);
          window.setTimeout(() => {
            if (!disposed) onReadoutChange(faceRotations[currentFaceIndex].label);
          }, 2400);
        }
      }

      if (cursorRing) cursorRing.classList.remove("mode-drag");
      if (!hoveredObject && cursorRing) {
        cursorRing.classList.remove("has-label");
        if (cursorText) cursorText.textContent = "";
      }
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    /* =========================================================================
       12. MOUSE / DEVICE-TILT PARALLAX AND SHAKE TO ROLL
       ========================================================================= */
    let mouseX = cachedW / 2;
    let mouseY = cachedH / 2;
    const onGlobalMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onGlobalMouseMove, { passive: true });

    // Phones: tilting the device moves the camera and highlight the way a mouse
    // does, and a shake rolls the die. iOS asks permission on the first die touch.
    let motionAsked = false;
    let lastShake = 0;
    const onTilt = (e) => {
      if (e.gamma === null || e.beta === null) return;
      const gx = clamp(e.gamma, -25, 25) / 25;
      const gy = clamp(e.beta - 45, -25, 25) / 25;
      mouseX = cachedW / 2 + gx * cachedW * 0.5;
      mouseY = cachedH / 2 + gy * cachedH * 0.5;
    };
    const onShake = (e) => {
      const a = e.acceleration;
      if (!a) return;
      const force = Math.abs(a.x || 0) + Math.abs(a.y || 0) + Math.abs(a.z || 0);
      const now = performance.now();
      if (force > 32 && now - lastShake > 1200 && dieMode !== "roll") {
        lastShake = now;
        rollRandom();
      }
    };
    function requestMotionAccess() {
      if (motionAsked || !coarsePointer) return;
      motionAsked = true;
      const attach = () => {
        window.addEventListener("deviceorientation", onTilt, { passive: true });
        window.addEventListener("devicemotion", onShake, { passive: true });
      };
      const DOE = window.DeviceOrientationEvent;
      if (DOE && typeof DOE.requestPermission === "function") {
        DOE.requestPermission()
          .then((res) => res === "granted" && attach())
          .catch(() => {});
      } else {
        attach();
      }
    }

    /* =========================================================================
       13. RENDER LOOP
       ========================================================================= */
    buildPath();
    ScrollTrigger.addEventListener("refresh", buildPath);

    // Section positions shift when fonts load or content reflows
    let measureFrame = 0;
    const bodyObserver = new ResizeObserver(() => {
      if (!measureFrame) {
        measureFrame = requestAnimationFrame(() => {
          measureFrame = 0;
          buildPath();
        });
      }
    });
    bodyObserver.observe(document.body);

    let animId = 0;
    let lastFrameTime = performance.now();
    // When the first frame was drawn (QA timing, see ?debug)
    let beganAt = 0;

    // Smoothness guard: when a device cannot hold a steady frame rate, the 3D
    // is drawn at a lower resolution, one step at a time, instead of letting
    // the whole page stutter. It only ever steps down.
    const MIN_PIXEL_RATIO = 0.75;
    let guardFrom = Infinity;
    let guardFrames = 0;
    let guardMs = 0;

    function watchFrameRate(now, elapsed) {
      // Long gaps (a hidden tab, a paused page) say nothing about smoothness
      if (now < guardFrom || elapsed > 250) return;
      guardFrames += 1;
      guardMs += elapsed;
      if (guardMs < 2000) return;
      const fps = (guardFrames * 1000) / guardMs;
      guardFrames = 0;
      guardMs = 0;
      const ratio = renderer.getPixelRatio();
      if (fps < 30 && ratio > MIN_PIXEL_RATIO) {
        renderer.setPixelRatio(Math.max(MIN_PIXEL_RATIO, ratio - 0.25));
        // Let the new size settle before judging again
        guardFrom = now + 600;
      }
    }

    function renderWebGL() {
      // f = elapsed time in 60 Hz frames, so motion is identical at 60, 120 or 144 Hz
      const now = performance.now();
      const elapsed = now - lastFrameTime;
      const f = Math.min(elapsed / FRAME_MS, 3);
      lastFrameTime = now;
      watchFrameRate(now, elapsed);
      const dt = f / 60;
      // Every formation's own motion speeds up while the page is being scrolled
      motionTime += dt * (1 + 2.2 * energy);

      updatePose(f);
      updateDie(f, now, dt);
      updateCubes(f, now);
      updateLiveFace(now);
      updateShadow(f);

      particleSystem.rotation.y = now * 0.0000144;
      particleMat.color.lerp(targetParticleColor, ease(0.05, f));

      // Camera parallax
      const camEase = ease(0.04, f);
      camera.position.x += ((mouseX / cachedW - 0.5) * 1.1 - camera.position.x) * camEase;
      camera.position.y += (-(mouseY / cachedH - 0.5) * 0.8 - camera.position.y) * camEase;
      camera.lookAt(0, 0, 0);

      // Cursor light
      const lightEase = ease(0.08, f);
      cursorLight.position.x += ((mouseX / cachedW - 0.5) * 14 - cursorLight.position.x) * lightEase;
      cursorLight.position.y += (-(mouseY / cachedH - 0.5) * 10 - cursorLight.position.y) * lightEase;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(renderWebGL);
    }

    // Shaders compile in the background first, so starting the loop does not
    // freeze the page; then the cubes fly in and the die grows into place
    const begin = () => {
      if (disposed || animId) return;
      const startTime = performance.now();
      beganAt = startTime;
      // Quick, tight fly-in: the formation is complete about 1.3 s after the first frame
      subCubes.forEach((cube, i) => {
        const u = cube.userData;
        u.transStart = startTime + 60 + i * 12;
        u.transDur = 900;
      });
      holdUntil = startTime + 1200;
      lastFrameTime = startTime;
      // The first moments include the cubes' fly-in and late shader work
      guardFrom = startTime + 1500;
      renderWebGL();
    };
    if (typeof renderer.compileAsync === "function") {
      renderer.compileAsync(scene, camera).then(begin, begin);
    } else {
      begin();
    }

    const onResize = () => {
      // A mobile address bar sliding in or out only changes the height a little;
      // re-creating the drawing buffer for that makes scrolling stutter
      if (
        coarsePointer &&
        window.innerWidth === cachedW &&
        Math.abs(window.innerHeight - cachedH) < 140
      ) {
        return;
      }
      cachedW = window.innerWidth;
      cachedH = window.innerHeight;
      camera.aspect = cachedW / cachedH;
      camera.updateProjectionMatrix();
      renderer.setSize(cachedW, cachedH);
      buildPath();
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      cancelAnimationFrame(measureFrame);
      bodyObserver.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onGlobalMouseMove);
      window.removeEventListener("zevo:modules", onModules);
      window.removeEventListener("deviceorientation", onTilt);
      window.removeEventListener("devicemotion", onShake);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);

      // Kill only this component's triggers and tweens — other sections own theirs
      chapterTrigger.kill();
      ScrollTrigger.removeEventListener("refresh", buildPath);
      gsap.killTweensOf(faceTween);
      gsap.killTweensOf(mainDie.position);
      subCubes.forEach((cube) => gsap.killTweensOf(cube.material));
      if (stageRef) stageRef.current = null;
      if (debugMode) delete window.__zevoStage;

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
        mats.forEach((m) => {
          if (m.map) m.map.dispose();
          m.dispose();
        });
      });
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, [onReadoutChange, stageRef]);

  return (
    <>
      <div id="theme-underlay" aria-hidden="true" />
      <div className="structural-lines" aria-hidden="true">
        <div /><div /><div /><div /><div /><div />
      </div>
      <canvas
        id="webgl-stage"
        ref={canvasRef}
        aria-label="Interactive Architectural Dice Monolith"
      />
    </>
  );
}

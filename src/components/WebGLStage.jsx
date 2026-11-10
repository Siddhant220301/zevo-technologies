"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import sound from "@/utils/audio";

export const faceRotations = [
  { x: 0, y: -Math.PI / 2, label: "01 // CUSTOM OPERATIONS & ERP" },
  { x: 0, y: Math.PI / 2, label: "02 // INTERACTIVE WEB APPS" },
  { x: Math.PI / 2, y: 0, label: "03 // WORKFLOW AUTOMATIONS" },
  { x: -Math.PI / 2, y: 0, label: "04 // MOTION & BRAND MEDIA" },
  { x: 0, y: 0, label: "05 // WEB APPLICATIONS" },
  { x: 0, y: Math.PI, label: "06 // MOBILE APPLICATIONS" },
];

export default function WebGLStage({ onReadoutChange, stageRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 13);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Lighting Rig
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.38;

    // Rich Dynamic Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.4);
    dirLight1.position.set(8, 12, 10);
    scene.add(dirLight1);

    // High-Chroma Cybernetic Accent Lights
    const kleinLight = new THREE.PointLight(0x2B59FF, 4.8, 28);
    kleinLight.position.set(-7, 5, 7);
    scene.add(kleinLight);

    const vermilionLight = new THREE.PointLight(0xFF334B, 4.2, 28);
    vermilionLight.position.set(7, -5, 6);
    scene.add(vermilionLight);

    const cyanLight = new THREE.PointLight(0x00E5FF, 3.6, 25);
    cyanLight.position.set(0, -6, 5);
    scene.add(cyanLight);

    // Dynamic Cursor Follow Light in 3D
    const cursorLight = new THREE.PointLight(0xFFFFFF, 2.8, 16);
    cursorLight.position.set(0, 0, 5);
    scene.add(cursorLight);

    // Master Group: prominent on Right Rail (+3.45) in Hero view
    const diceClusterGroup = new THREE.Group();
    diceClusterGroup.position.set(3.45, 0.1, 0);
    scene.add(diceClusterGroup);

    // High-Resolution Procedural Canvas Textures for the 6 Faces of the Die
    const faceSpecs = [
      { id: "01", title: "CUSTOM ERP", sub: "OPERATIONS & BILLING", pips: 1, bg1: "#0A1226", bg2: "#142852", accent: "#38BDF8", line: "#2563EB", textColor: "#FFFFFF" },
      { id: "02", title: "INTERACTIVE", sub: "WEB EXPERIENCES", pips: 2, bg1: "#1D4ED8", bg2: "#2563EB", accent: "#FACC15", line: "#FDE047", textColor: "#FFFFFF" },
      { id: "03", title: "AUTOMATIONS", sub: "WHATSAPP & REALTIME APIS", pips: 3, bg1: "#4C0519", bg2: "#881337", accent: "#FB7185", line: "#FDA4AF", textColor: "#FFFFFF" },
      { id: "04", title: "MOTION", sub: "KINETIC BRAND VISUALS", pips: 4, bg1: "#FFFFFF", bg2: "#E2E8F0", accent: "#0284C7", line: "#38BDF8", textColor: "#0F172A" },
      { id: "05", title: "WEB APPS", sub: "FULL-STACK NEXT.JS CLOUD", pips: 5, bg1: "#DC2626", bg2: "#EF4444", accent: "#FFFFFF", line: "#FEF08A", textColor: "#FFFFFF" },
      { id: "06", title: "MOBILE APPS", sub: "NATIVE IOS & ANDROID", pips: 6, bg1: "#064E3B", bg2: "#047857", accent: "#A7F3D0", line: "#34D399", textColor: "#FFFFFF" },
    ];

    function createDiceFaceTexture(spec) {
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext("2d");

      // Vibrant Gradient Surface
      const grad = ctx.createLinearGradient(0, 0, 512, 512);
      grad.addColorStop(0, spec.bg1);
      grad.addColorStop(1, spec.bg2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Outer Bevel Frame
      ctx.strokeStyle = spec.accent;
      ctx.lineWidth = 14;
      ctx.strokeRect(18, 18, 476, 476);

      // Inner Architectural Border
      ctx.strokeStyle = spec.line;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(34, 34, 444, 444);

      // Architectural Hairlines
      ctx.strokeStyle = spec.bg1 === "#FFFFFF" ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(34, 138);
      ctx.lineTo(478, 138);
      ctx.moveTo(34, 385);
      ctx.lineTo(478, 385);
      ctx.stroke();

      // Top Corner Index Tag
      ctx.fillStyle = spec.accent;
      ctx.font = '700 30px "Space Mono", monospace';
      ctx.fillText(`FACE // ${spec.id}`, 48, 88);

      // Pip Dots
      for (let i = 0; i < spec.pips; i++) {
        const px = 435 - (i % 3) * 32;
        const py = 66 + Math.floor(i / 3) * 30;
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fillStyle = spec.accent;
        ctx.fill();
      }

      // Main Capability Title
      ctx.fillStyle = spec.textColor;
      ctx.font = '800 52px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(spec.title, 48, 255);

      // Subtitle
      ctx.fillStyle = spec.accent;
      ctx.font = '700 24px "Space Mono", monospace';
      ctx.fillText(spec.sub, 48, 305);

      // Bottom Signature
      ctx.fillStyle = spec.bg1 === "#FFFFFF" ? "#475569" : "rgba(255,255,255,0.7)";
      ctx.font = '600 18px "Space Mono", monospace';
      ctx.fillText("ZEVO.TECH // DIGITAL STUDIO", 48, 445);

      const tex = new THREE.CanvasTexture(c);
      tex.anisotropy = 8;
      return tex;
    }

    const diceMaterials = faceSpecs.map(
      (spec) =>
        new THREE.MeshStandardMaterial({
          map: createDiceFaceTexture(spec),
          roughness: 0.1,
          metalness: 0.12,
          emissive: new THREE.Color(spec.accent).multiplyScalar(0.08),
        })
    );

    // Primary 6-Faced Bespoke Architectural Die
    const mainDieGeo = new THREE.BoxGeometry(2.65, 2.65, 2.65);
    const mainDie = new THREE.Mesh(mainDieGeo, diceMaterials);
    mainDie.rotation.set(0.38, -0.62, 0.15);
    diceClusterGroup.add(mainDie);

    // Glowing Architectural Cage
    const cageGeo = new THREE.BoxGeometry(2.78, 2.78, 2.78);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const mainCage = new THREE.Mesh(cageGeo, cageMat);
    mainDie.add(mainCage);

    // 26 Orbiting Satellite Sub-Cubes with Ultra-Vibrant Luminous Palette & Stealth Obsidian
    const subCubes = [];
    const subGeo = new THREE.BoxGeometry(0.58, 0.58, 0.58);
    const subEdgeGeo = new THREE.EdgesGeometry(subGeo);

    const subPalette = [
      { color: 0x2563EB, emissive: 0x1D4ED8, edge: 0x93C5FD, name: "KLEIN BLUE" },
      { color: 0x111319, emissive: 0x1E293B, edge: 0x38BDF8, name: "STEALTH OBSIDIAN", metalness: 0.52, roughness: 0.15 },
      { color: 0xEF4444, emissive: 0xDC2626, edge: 0xFCA5A5, name: "CORAL VERMILION" },
      { color: 0x84CC16, emissive: 0x65A30D, edge: 0xD9F99D, name: "ACID LIME" },
      { color: 0x06B6D4, emissive: 0x0891B2, edge: 0xA5F3FC, name: "LASER CYAN" },
      { color: 0xD946EF, emissive: 0xC026D3, edge: 0xF5D0FE, name: "RADIANT MAGENTA" },
      { color: 0xF59E0B, emissive: 0xD97706, edge: 0xFDE68A, name: "AMBER GOLD" },
      { color: 0xFFFFFF, emissive: 0x38BDF8, edge: 0x38BDF8, name: "POLAR WHITE" },
    ];

    for (let i = 0; i < 26; i++) {
      const p = subPalette[i % subPalette.length];
      const mat = new THREE.MeshStandardMaterial({
        color: p.color,
        roughness: p.roughness !== undefined ? p.roughness : 0.08,
        metalness: p.metalness !== undefined ? p.metalness : 0.12,
        emissive: new THREE.Color(p.emissive),
        emissiveIntensity: 0.35,
      });
      const subMesh = new THREE.Mesh(subGeo, mat);

      // Precision architectural glowing edge wireframe
      const edgeMat = new THREE.LineBasicMaterial({
        color: p.edge,
        transparent: true,
        opacity: 0.85,
      });
      const edgeLines = new THREE.LineSegments(subEdgeGeo, edgeMat);
      subMesh.add(edgeLines);

      const angle = (i / 26) * Math.PI * 2;
      const radius = 2.45 + (i % 3) * 0.7;
      const homeX = Math.cos(angle) * radius;
      const homeY = ((i % 5) - 2) * 0.95;
      const homeZ = Math.sin(angle) * radius * 0.75;

      const expX = ((i % 3) - 1) * 2.5 + (Math.random() - 0.5) * 0.4;
      const expY = (Math.floor(i / 3) % 3 - 1) * 2.5;
      const expZ = (Math.floor(i / 9) - 1) * 2.4;

      const helixY = (i - 13) * 0.35;
      const helixAngle = i * 0.58;
      const helixX = Math.cos(helixAngle) * 2.25;
      const helixZ = Math.sin(helixAngle) * 2.25;

      subMesh.position.set(homeX, homeY, homeZ);
      subMesh.userData = {
        index: i,
        name: p.name,
        baseColor: p.color,
        baseEmissive: p.emissive,
        baseEmissiveIntensity: 0.35,
        edgeMat: edgeMat,
        home: { x: homeX, y: homeY, z: homeZ },
        explode: { x: expX, y: expY, z: expZ },
        helix: { x: helixX, y: helixY, z: helixZ },
        anchor: { x: homeX, y: homeY, z: homeZ },
        rotSpeed: { x: (Math.random() - 0.5) * 0.015, y: (Math.random() - 0.5) * 0.015 },
        dragDeflectX: 0,
        dragDeflectY: 0,
        spinInertia: { axis: new THREE.Vector3(0, 1, 0), speed: 0 },
        phase: i * 0.38 + Math.random() * 0.1,
      };

      diceClusterGroup.add(subMesh);
      subCubes.push(subMesh);
    }

    // 300 Floating Luminous Particles
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
    let targetParticleColor = lightParticleColor.clone();

    function updateChapterTheme(isDark) {
      const underlay = document.getElementById("theme-underlay");
      if (underlay) underlay.style.opacity = isDark ? "1" : "0";
      if (isDark) {
        document.body.classList.add("dark-chapter");
        document.documentElement.classList.add("dark-chapter");
        targetParticleColor.copy(darkParticleColor);
      } else {
        document.body.classList.remove("dark-chapter");
        document.documentElement.classList.remove("dark-chapter");
        targetParticleColor.copy(lightParticleColor);
      }
    }
    updateChapterTheme(false);

    ScrollTrigger.create({
      trigger: "#motion",
      endTrigger: "#estimator",
      start: "top 50%",
      end: "top 50%",
      onEnter: () => {
        updateChapterTheme(true);
        sound.playClick(580);
      },
      onLeave: () => {
        updateChapterTheme(false);
        sound.playClick(820);
      },
      onEnterBack: () => {
        updateChapterTheme(true);
        sound.playClick(580);
      },
      onLeaveBack: () => {
        updateChapterTheme(false);
        sound.playClick(820);
      },
    });

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
      },
    });

    // Stage 1: Hero to About Us (Dice remains stable on Right Rail, elegant rotation)
    scrollTl
      .to(
        diceClusterGroup.position,
        {
          x: 3.65,
          y: 0.05,
          z: 0.2,
          duration: 1,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        diceClusterGroup.rotation,
        {
          x: Math.PI * 0.8,
          y: Math.PI * 1.25,
          z: Math.PI * 0.25,
          duration: 1,
          ease: "none",
        },
        0
      );

    // Stage 2: About Us to Our Mission & Capabilities (Glide from Right Rail to Left Rail -4.2)
    scrollTl
      .to(
        diceClusterGroup.position,
        {
          x: -4.2,
          y: -0.1,
          z: 0.6,
          duration: 1.2,
          ease: "power2.inOut",
        },
        1
      )
      .to(
        diceClusterGroup.rotation,
        {
          x: Math.PI * 2.2,
          y: Math.PI * 3.2,
          z: Math.PI * 0.75,
          duration: 1.2,
          ease: "none",
        },
        1
      );

    // Stage 3: Capabilities to Custom ERP (Glide from Left Rail to Right Rail +3.8)
    scrollTl
      .to(
        diceClusterGroup.position,
        {
          x: 3.8,
          y: 0.1,
          z: -0.2,
          duration: 1.2,
          ease: "power2.inOut",
        },
        2.2
      )
      .to(
        diceClusterGroup.rotation,
        {
          x: Math.PI * 3.8,
          y: Math.PI * 4.9,
          z: Math.PI * 1.35,
          duration: 1.2,
          ease: "none",
        },
        2.2
      );

    // Stage 4: Custom ERP to Motion Lab (Upper-Left Rail -4.6, recessed Z so text is completely clear)
    scrollTl
      .to(
        diceClusterGroup.position,
        {
          x: -4.6,
          y: 0.6,
          z: -1.4,
          duration: 0.8,
          ease: "power2.inOut",
        },
        3.2
      )
      .to(
        diceClusterGroup.rotation,
        {
          x: Math.PI * 5.2,
          y: Math.PI * 6.6,
          z: Math.PI * 2.0,
          duration: 0.8,
          ease: "none",
        },
        3.2
      );

    // Stage 5: Motion Lab to Case Studies (Glides to Top-Right Rail +3.8, y: 1.5, z: -0.8)
    scrollTl
      .to(
        diceClusterGroup.position,
        {
          x: 3.8,
          y: 1.5,
          z: -0.8,
          duration: 0.8,
          ease: "power2.inOut",
        },
        4.0
      )
      .to(
        diceClusterGroup.rotation,
        {
          x: Math.PI * 6.2,
          y: Math.PI * 7.8,
          z: Math.PI * 2.4,
          duration: 0.8,
          ease: "none",
        },
        4.0
      );

    // Stage 6: Case Studies to Estimator & Contact (Glide to Right Rail +3.8)
    scrollTl
      .to(
        diceClusterGroup.position,
        {
          x: 3.8,
          y: -0.2,
          z: 0.5,
          duration: 0.8,
          ease: "power2.inOut",
        },
        5.0
      )
      .to(
        diceClusterGroup.rotation,
        {
          x: Math.PI * 7.4,
          y: Math.PI * 9.2,
          z: Math.PI * 2.9,
          duration: 0.8,
          ease: "none",
        },
        5.0
      );

    let currentFaceIndex = 0;
    let isRolling = false;
    const faceTweenObj = { t: 0 };

    // Omnidirectional shortest-arc SLERP for crisp, elegant face transitions
    function rollMainDieToFace(faceIndex) {
      sound.playClick(1100);
      currentFaceIndex = faceIndex % faceRotations.length;
      const target = faceRotations[currentFaceIndex];

      const startQuat = mainDie.quaternion.clone();
      const targetQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(target.x, target.y, 0)
      );

      inertia.speed = 0;
      isRolling = true;
      gsap.killTweensOf(faceTweenObj);
      faceTweenObj.t = 0;

      gsap.to(faceTweenObj, {
        t: 1,
        duration: 1.15,
        ease: "power3.out",
        onUpdate: () => {
          mainDie.quaternion.copy(startQuat).slerp(targetQuat, faceTweenObj.t);
        },
        onComplete: () => {
          mainDie.quaternion.copy(targetQuat);
          isRolling = false;
        },
      });

      if (onReadoutChange) {
        onReadoutChange(target.label);
      }
    }

    // Roll random / luminous ripple without exploding positions
    function rollRandom() {
      sound.playRoll();
      subCubes.forEach((c, idx) => {
        gsap.to(c.rotation, {
          y: c.rotation.y + Math.PI,
          duration: 0.65,
          delay: (idx % 6) * 0.02,
          ease: "power2.out",
        });
        if (c.material) {
          gsap.to(c.material, {
            emissiveIntensity: 1.15,
            duration: 0.22,
            delay: (idx % 6) * 0.02,
            yoyo: true,
            repeat: 1,
          });
        }
      });
      const randFace = Math.floor(Math.random() * 6);
      rollMainDieToFace(randFace);
    }

    // Formation Switcher with live coordinate synchronization
    function setFormation(mode, isWire) {
      sound.playMorph();

      if (mode === "wireframe") {
        diceMaterials.forEach((m) => (m.wireframe = isWire));
        subCubes.forEach((c) => (c.material.wireframe = isWire));
        return;
      }

      subCubes.forEach((cube, i) => {
        const targetCoords =
          mode === "explode" || mode === "grid"
            ? cube.userData.explode
            : mode === "helix" || mode === "ring"
            ? cube.userData.helix
            : cube.userData.home;

        gsap.to(cube.userData.anchor, {
          x: targetCoords.x,
          y: targetCoords.y,
          z: targetCoords.z,
          duration: 1.15,
          delay: i * 0.012,
          ease: "power3.out",
        });
      });

      const isHelix = mode === "helix" || mode === "ring";
      gsap.to(mainDie.scale, {
        x: isHelix ? 0.6 : 1,
        y: isHelix ? 0.6 : 1,
        z: isHelix ? 0.6 : 1,
        duration: 0.9,
        ease: "power3.out",
      });
    }

    if (stageRef) {
      stageRef.current = {
        rollToFace: rollMainDieToFace,
        rollRandom: rollRandom,
        setFormation: setFormation,
      };
    }

    /* =========================================================================
       6. OMNIDIRECTIONAL TRACKBALL & DUAL-INTERACTIVE CUBE ENGINE
       Both Main Die & 26 Orbiting Satellite Cubes are fully interactive
       ========================================================================= */
    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2(-9999, -9999);
    let hoveredObject = null;
    let activeDragObject = null;
    let isDragging = false;

    // Smooth physical momentum & continuous velocity tracking (No abrupt axis or speed jumps)
    const ambientAxis = new THREE.Vector3(0.25, 0.85, 0.18).normalize();
    const currentSpinAxis = new THREE.Vector3().copy(ambientAxis);
    let currentSpinSpeed = 0.0022;
    const targetAmbientSpeed = 0.0022;

    const inertia = {
      axis: new THREE.Vector3(0, 1, 0),
      speed: 0,
      damping: 0.952,
    };

    // Drag tracking metrics
    let prevX = 0,
      prevY = 0;
    let dragStartTime = 0;
    let dragStartPos = { x: 0, y: 0 };
    let totalDragDist = 0;

    // Helper: resolve interactive target from any hit mesh or sub-line child
    function resolveInteractiveTarget(hitObj) {
      if (!hitObj) return null;
      if (
        hitObj === mainDie ||
        hitObj === mainCage ||
        hitObj.parent === mainDie
      ) {
        return mainDie;
      }
      for (let i = 0; i < subCubes.length; i++) {
        if (hitObj === subCubes[i] || hitObj.parent === subCubes[i]) {
          return subCubes[i];
        }
      }
      return null;
    }

    const cursorRing = document.getElementById("cursorRing");
    const cursorText = document.getElementById("cursorText");

    // Highlight hovered cube or die (Luminous Emissive Flare only, NO ZOOM/SCALE)
    function setHovered(target) {
      if (hoveredObject === target) return;

      if (hoveredObject && hoveredObject !== mainDie && hoveredObject.userData) {
        if (hoveredObject.material) {
          gsap.to(hoveredObject.material, {
            emissiveIntensity: hoveredObject.userData.baseEmissiveIntensity || 0.35,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
        if (hoveredObject.userData.edgeMat) {
          gsap.to(hoveredObject.userData.edgeMat, {
            opacity: 0.85,
            duration: 0.3,
            overwrite: "auto",
          });
        }
      } else if (hoveredObject === mainDie) {
        gsap.to(mainCage.material, {
          opacity: 0.55,
          duration: 0.3,
          overwrite: "auto",
        });
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
        gsap.to(mainCage.material, {
          opacity: 0.95,
          duration: 0.25,
          overwrite: "auto",
        });
        if (cursorRing) {
          cursorRing.classList.add("has-label", "mode-drag");
          cursorRing.classList.remove("mode-explore");
          if (cursorText) cursorText.textContent = "ROTATE";
        }
        sound.playClick(920);
      } else {
        // Satellite Sub-Cube Hover: Pure luminous glow flare (NO ZOOM / SCALE)
        const idx = target.userData ? target.userData.index : 0;
        const colorName = target.userData?.name || `0${(idx % 8) + 1}`;
        if (target.material) {
          gsap.to(target.material, {
            emissiveIntensity: 1.35,
            duration: 0.22,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
        if (target.userData.edgeMat) {
          gsap.to(target.userData.edgeMat, {
            opacity: 1.0,
            duration: 0.2,
            overwrite: "auto",
          });
        }
        if (cursorRing) {
          cursorRing.classList.add("has-label", "mode-explore");
          cursorRing.classList.remove("mode-drag");
          if (cursorText) cursorText.textContent = `SATELLITE // ${colorName}`;
        }
        sound.playClick(1040 + (idx % 12) * 22);
      }
    }

    function onPointerDown(e) {
      pointerNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;

      dragStartPos = { x: e.clientX, y: e.clientY };
      prevX = e.clientX;
      prevY = e.clientY;
      dragStartTime = performance.now();
      totalDragDist = 0;

      raycaster.setFromCamera(pointerNDC, camera);
      const intersects = raycaster.intersectObjects([mainDie, ...subCubes], true);
      const hitTarget =
        intersects.length > 0 ? resolveInteractiveTarget(intersects[0].object) : null;

      activeDragObject = hitTarget || mainDie;
      isDragging = true;
      inertia.speed = 0;

      if (cursorRing) {
        cursorRing.classList.add("has-label", "mode-drag");
        if (cursorText) {
          cursorText.textContent =
            activeDragObject === mainDie ? "SPINNING DIE" : "SPIN SATELLITE";
        }
      }
    }

    function onPointerMove(e) {
      pointerNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (isDragging && activeDragObject) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        const stepDist = Math.hypot(dx, dy);
        totalDragDist += stepDist;

        if (stepDist > 0.05) {
          // TRUE OMNIDIRECTIONAL ROTATION
          const camAxis = new THREE.Vector3(dy, dx, 0).normalize();
          const worldAxis = camAxis
            .clone()
            .transformDirection(camera.matrixWorld)
            .normalize();

          const sensitivity = activeDragObject === mainDie ? 0.0075 : 0.0135;
          const angle = stepDist * sensitivity;

          activeDragObject.rotateOnWorldAxis(worldAxis, angle);

          // Update momentum inertia
          if (activeDragObject === mainDie) {
            currentSpinAxis.copy(worldAxis);
            inertia.axis.copy(worldAxis);
            inertia.speed = THREE.MathUtils.lerp(inertia.speed, angle, 0.65);
            currentSpinSpeed = inertia.speed;
          } else if (activeDragObject.userData) {
            if (!activeDragObject.userData.spinInertia) {
              activeDragObject.userData.spinInertia = {
                axis: new THREE.Vector3(),
                speed: 0,
              };
            }
            activeDragObject.userData.spinInertia.axis.copy(worldAxis);
            activeDragObject.userData.spinInertia.speed = Math.min(
              0.14,
              (activeDragObject.userData.spinInertia.speed || 0) * 0.35 + angle * 1.5
            );
            activeDragObject.userData.dragDeflectX = Math.max(
              -0.9,
              Math.min(0.9, (activeDragObject.userData.dragDeflectX || 0) + dx * 0.0035)
            );
            activeDragObject.userData.dragDeflectY = Math.max(
              -0.9,
              Math.min(0.9, (activeDragObject.userData.dragDeflectY || 0) - dy * 0.0035)
            );
          }
        }

        prevX = e.clientX;
        prevY = e.clientY;
        return;
      }

      raycaster.setFromCamera(pointerNDC, camera);
      const intersects = raycaster.intersectObjects([mainDie, ...subCubes], true);
      const hitTarget =
        intersects.length > 0 ? resolveInteractiveTarget(intersects[0].object) : null;
      setHovered(hitTarget);
    }

    function onPointerUp(e) {
      if (!isDragging) return;
      isDragging = false;

      const elapsed = performance.now() - dragStartTime;

      if (totalDragDist < 7 && elapsed < 320) {
        if (activeDragObject === mainDie) {
          sound.playRoll();
          const nextFace = (currentFaceIndex + 1) % 6;
          rollMainDieToFace(nextFace);

          // Gentle rotational shimmer across satellite cubes without moving positions or zooming
          subCubes.forEach((c, idx) => {
            gsap.to(c.rotation, {
              y: c.rotation.y + Math.PI,
              duration: 0.65,
              delay: (idx % 8) * 0.02,
              ease: "power2.out",
            });
            if (c.material) {
              gsap.to(c.material, {
                emissiveIntensity: 1.0,
                duration: 0.2,
                delay: (idx % 8) * 0.02,
                yoyo: true,
                repeat: 1,
              });
            }
          });
        } else if (activeDragObject && activeDragObject.userData) {
          // Clicked an Individual Satellite Cube -> Kinetic spin & flare in place (NO ZOOM/SCALE)
          const cube = activeDragObject;
          const idx = cube.userData.index;
          sound.playClick(680 + (idx % 12) * 45);

          // High-speed gyroscopic spin on dual axes in place
          gsap.to(cube.rotation, {
            x: cube.rotation.x + Math.PI * 2,
            y: cube.rotation.y + Math.PI * 2,
            duration: 0.85,
            ease: "power3.out",
          });

          // Emissive flash in place
          if (cube.material) {
            gsap.to(cube.material, {
              emissiveIntensity: 1.5,
              duration: 0.18,
              yoyo: true,
              repeat: 1,
            });
          }

          if (onReadoutChange) {
            onReadoutChange(`SATELLITE // ${cube.userData.name || '0' + (idx + 1)} [PULSE]`);
            setTimeout(() => {
              const cur = faceRotations[currentFaceIndex];
              onReadoutChange(cur.label);
            }, 2400);
          }
        }
      } else {
        inertia.speed = Math.min(inertia.speed, 0.085);
        currentSpinSpeed = inertia.speed;
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

    // Ultra-Smooth 60FPS Render Loop with Camera & Cursor Parallax
    let clockTime = 0;
    let cachedW = window.innerWidth;
    let cachedH = window.innerHeight;
    let mouseX = cachedW / 2;
    let mouseY = cachedH / 2;

    const onGlobalMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onGlobalMouseMove, { passive: true });

    let animId;
    function renderWebGL() {
      clockTime += 0.012;

      // 1. Omnidirectional Inertia & Continuous Fluid Drift for Main Die
      if (!isRolling) {
        if (isDragging && activeDragObject === mainDie) {
          // Handled directly in onPointerMove
        } else {
          if (inertia.speed > targetAmbientSpeed) {
            inertia.speed *= 0.952;
            currentSpinSpeed = inertia.speed;
          } else {
            currentSpinSpeed = THREE.MathUtils.lerp(currentSpinSpeed, targetAmbientSpeed, 0.035);
            currentSpinAxis.lerp(ambientAxis, 0.025).normalize();
          }
          mainDie.rotateOnWorldAxis(currentSpinAxis, currentSpinSpeed);
        }
      }

      // 2. Individual Gyroscopic Dynamics & Breathing Orbit for All 26 Satellite Cubes
      for (let i = 0; i < subCubes.length; i++) {
        const cube = subCubes[i];

        if (cube.userData.spinInertia && cube.userData.spinInertia.speed > 0.0002) {
          cube.rotateOnWorldAxis(
            cube.userData.spinInertia.axis,
            cube.userData.spinInertia.speed
          );
          cube.userData.spinInertia.speed *= 0.956;
        } else {
          cube.rotation.x += cube.userData.rotSpeed.x;
          cube.rotation.y += cube.userData.rotSpeed.y;
        }

        if (cube.userData.dragDeflectX || cube.userData.dragDeflectY) {
          cube.userData.dragDeflectX *= 0.92;
          cube.userData.dragDeflectY *= 0.92;
          if (Math.abs(cube.userData.dragDeflectX) < 0.0005)
            cube.userData.dragDeflectX = 0;
          if (Math.abs(cube.userData.dragDeflectY) < 0.0005)
            cube.userData.dragDeflectY = 0;
        }

        const anchor = cube.userData.anchor;
        const phase = cube.userData.phase;
        const floatX = Math.cos(clockTime * 1.15 + phase) * 0.045;
        const floatY = Math.sin(clockTime * 1.55 + phase) * 0.08;
        const floatZ = Math.sin(clockTime * 1.05 + phase * 1.2) * 0.045;

        cube.position.x = anchor.x + floatX + (cube.userData.dragDeflectX || 0);
        cube.position.y = anchor.y + floatY + (cube.userData.dragDeflectY || 0);
        cube.position.z = anchor.z + floatZ;
      }

      particleSystem.rotation.y = clockTime * 0.02;
      particleMat.color.lerp(targetParticleColor, 0.05);

      // Camera Parallax
      const targetCamX = (mouseX / cachedW - 0.5) * 1.1;
      const targetCamY = -(mouseY / cachedH - 0.5) * 0.8;
      camera.position.x += (targetCamX - camera.position.x) * 0.04;
      camera.position.y += (targetCamY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Light Tracking
      const lx = (mouseX / cachedW - 0.5) * 14;
      const ly = -(mouseY / cachedH - 0.5) * 10;
      cursorLight.position.x += (lx - cursorLight.position.x) * 0.08;
      cursorLight.position.y += (ly - cursorLight.position.y) * 0.08;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(renderWebGL);
    }
    renderWebGL();

    const onResize = () => {
      cachedW = window.innerWidth;
      cachedH = window.innerHeight;
      camera.aspect = cachedW / cachedH;
      camera.updateProjectionMatrix();
      renderer.setSize(cachedW, cachedH);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onGlobalMouseMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      scrollTl.kill();
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

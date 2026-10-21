"use client";

import { useEffect, useRef, useState } from "react";
import sound from "@/utils/audio";

export default function MotionLabSection() {
  const canvasRef = useRef(null);
  const [reelMode, setReelMode] = useState("0");
  const timecodeRef = useRef(null);
  const rippleRadiusRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let rTime = 0;
    let mouseX = 0;
    let mouseY = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor((rect.width || canvas.clientWidth || 760) * dpr);
      canvas.height = Math.floor((rect.height || canvas.clientHeight || 380) * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    canvas.addEventListener("mousemove", onMouseMove);

    // Floating dust motes for Cinema mode
    const cinemaParticles = Array.from({ length: 45 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.0012 + 0.0004,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    function render() {
      rTime += 0.024;
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      if (reelMode === "0") {
        // STYLE 01: 3D Product Launch
        const grad = ctx.createRadialGradient(
          w / 2 + mouseX * 40,
          h / 2 + mouseY * 40,
          20,
          w / 2,
          h / 2,
          w * 0.75
        );
        grad.addColorStop(0, "#080c18");
        grad.addColorStop(0.65, "#030408");
        grad.addColorStop(1, "#010103");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Perspective Ground Grid
        ctx.save();
        ctx.strokeStyle = "rgba(30, 58, 255, 0.22)";
        ctx.lineWidth = 1;
        const horizon = h * 0.62;
        const vanishingX = w / 2 + mouseX * 50;

        for (let i = -14; i <= 14; i++) {
          ctx.beginPath();
          ctx.moveTo(vanishingX, horizon);
          ctx.lineTo(w / 2 + i * (w * 0.09), h);
          ctx.stroke();
        }

        const scanOffset = (rTime * 35) % 30;
        for (let y = horizon; y < h; y += 18) {
          const depthAlpha = Math.pow((y - horizon) / (h - horizon), 1.8);
          ctx.strokeStyle = `rgba(30, 58, 255, ${(depthAlpha * 0.35).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(0, y + scanOffset * depthAlpha);
          ctx.lineTo(w, y + scanOffset * depthAlpha);
          ctx.stroke();
        }
        ctx.restore();

        // 3D Isometric Wireframe Cube
        ctx.save();
        ctx.translate(w / 2 + mouseX * 25, h / 2 - 20 + mouseY * 15);
        const rotY = rTime * 0.85;
        const rotX = Math.sin(rTime * 0.65) * 0.35;
        const cubeR = Math.min(w, h) * 0.22;

        const baseVertices = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1],
        ];

        const projected = baseVertices.map(([vx, vy, vz]) => {
          let x1 = vx * Math.cos(rotY) - vz * Math.sin(rotY);
          let z1 = vx * Math.sin(rotY) + vz * Math.cos(rotY);
          let y2 = vy * Math.cos(rotX) - z1 * Math.sin(rotX);
          let z2 = vy * Math.sin(rotX) + z1 * Math.cos(rotX);
          const fov = 3.2;
          const scale = fov / (fov + z2 * 0.55);
          return [x1 * cubeR * scale, y2 * cubeR * scale];
        });

        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7],
        ];

        ctx.strokeStyle = "#1E3AFF";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#1E3AFF";
        ctx.shadowBlur = 18;
        edges.forEach(([i1, i2]) => {
          ctx.beginPath();
          ctx.moveTo(projected[i1][0], projected[i1][1]);
          ctx.lineTo(projected[i2][0], projected[i2][1]);
          ctx.stroke();
        });
        ctx.shadowBlur = 0;

        // Glowing center core
        ctx.fillStyle = "#D4FF00";
        ctx.beginPath();
        ctx.arc(0, 0, 7 + Math.sin(rTime * 4) * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (reelMode === "1") {
        // STYLE 02: Kinetic Motion Graphics
        ctx.fillStyle = "#020306";
        ctx.fillRect(0, 0, w, h);

        const lines = 7;
        for (let l = 0; l < lines; l++) {
          const hue = (l * 38 + rTime * 20) % 360;
          ctx.strokeStyle = `hsla(${hue}, 95%, 60%, ${0.28 + l * 0.1})`;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let x = 0; x < w; x += 6) {
            const freq = 0.007 + l * 0.0018;
            const amp = (h * 0.16 + l * 7) * Math.sin(rTime * 1.8 + l * 0.4);
            const y = h / 2 + Math.sin(x * freq + rTime * 2.2 + l * 0.7) * amp;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Kinetic Crosshairs
        ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 85, 0, Math.PI * 2);
        ctx.stroke();

        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.rotate(rTime * 0.6);
        ctx.strokeStyle = "#D4FF00";
        ctx.beginPath();
        ctx.arc(0, 0, 110, 0, Math.PI * 0.4);
        ctx.stroke();
        ctx.restore();
      } else {
        // STYLE 03: Cinematic Showcase
        ctx.fillStyle = "#010204";
        ctx.fillRect(0, 0, w, h);

        cinemaParticles.forEach((p) => {
          p.y -= p.speed;
          if (p.y < 0) p.y = 1;
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Anamorphic horizontal lens streak
        const flareY = h / 2 + Math.sin(rTime * 0.7) * 20;
        const streakGrad = ctx.createLinearGradient(0, flareY, w, flareY);
        streakGrad.addColorStop(0, "rgba(30, 58, 255, 0)");
        streakGrad.addColorStop(0.35, "rgba(30, 58, 255, 0.45)");
        streakGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.95)");
        streakGrad.addColorStop(0.65, "rgba(0, 210, 235, 0.45)");
        streakGrad.addColorStop(1, "rgba(30, 58, 255, 0)");

        ctx.fillStyle = streakGrad;
        ctx.fillRect(0, flareY - 3, w, 6);

        // Letterbox bars
        const letterboxH = h * 0.12;
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, letterboxH);
        ctx.fillRect(0, h - letterboxH, w, letterboxH);
      }

      // Shockwave ripple
      if (rippleRadiusRef.current > 0) {
        rippleRadiusRef.current += 6;
        ctx.strokeStyle = `rgba(212, 255, 0, ${Math.max(0, 1 - rippleRadiusRef.current / 220)})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, rippleRadiusRef.current, 0, Math.PI * 2);
        ctx.stroke();
        if (rippleRadiusRef.current > 220) {
          rippleRadiusRef.current = 0;
        }
      }

      // Real-time timecode increment
      if (timecodeRef.current) {
        const frames = String(Math.floor((rTime * 30) % 60)).padStart(2, "0");
        const secs = String(Math.floor(rTime) % 60).padStart(2, "0");
        timecodeRef.current.textContent = `TC 00:00:${secs}:${frames} // 60FPS`;
      }

      animId = requestAnimationFrame(render);
    }
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, [reelMode]);

  const handleCanvasClick = () => {
    rippleRadiusRef.current = 10;
    sound.playMorph();
  };

  const handleReelClick = (mode, idx) => {
    sound.playClick(1050 + idx * 120);
    setReelMode(mode);
    rippleRadiusRef.current = 15;
  };

  return (
    <section className="section-wrap content-grid" id="motion">
      <div className="motion-left-col">
        <span className="section-tag">// 05 — 3D &amp; MOTION LAB</span>
        <h2 className="section-title">
          3D visuals that make your products <em>stand out</em>.
        </h2>
        <p className="section-subtext">
          We design interactive 3D web components and motion graphics that help modern brands showcase
          products in detail and captivate visitors.
        </p>
      </div>

      <div className="motion-right-col interactive-zone">
        <div className="shader-monitor-card tilt-card">
          <div className="canvas-viewport-wrap">
            <canvas
              id="reelSynthCanvas"
              ref={canvasRef}
              width={760}
              height={380}
              onClick={handleCanvasClick}
            />
            <div className="canvas-hud-header">
              <span>
                <i className="recording-dot" />
                INTERACTIVE 3D &amp; MOTION VIEWER
              </span>
              <span id="reelTimecode" ref={timecodeRef}>
                REAL-TIME PREVIEW // 60FPS
              </span>
            </div>
          </div>
          <div className="reel-buttons-bar">
            <button
              type="button"
              className={`reel-btn ${reelMode === "0" ? "active" : ""}`}
              data-reel="0"
              data-cursor="SWITCH"
              onClick={() => handleReelClick("0", 0)}
            >
              <span className="sub">STYLE 01 //</span>
              <strong>3D Product Launch</strong>
            </button>
            <button
              type="button"
              className={`reel-btn ${reelMode === "1" ? "active" : ""}`}
              data-reel="1"
              data-cursor="SWITCH"
              onClick={() => handleReelClick("1", 1)}
            >
              <span className="sub">STYLE 02 //</span>
              <strong>Kinetic Motion Graphics</strong>
            </button>
            <button
              type="button"
              className={`reel-btn ${reelMode === "2" ? "active" : ""}`}
              data-reel="2"
              data-cursor="SWITCH"
              onClick={() => handleReelClick("2", 2)}
            >
              <span className="sub">STYLE 03 //</span>
              <strong>Cinematic Showcase</strong>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

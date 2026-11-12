"use client";

import { useEffect } from "react";
import sound from "@/utils/audio";
import { getMotionMode } from "@/lib/motion";

const REST = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";

// Delegated tilt + glare for every .tilt-card. A single pair of document
// listeners replaces per-card handlers, so cards added later just work and no
// other component's handlers get overwritten.
export default function TiltCardInitializer() {
  useEffect(() => {
    // Tilt follows a mouse; on touch it would only stick in a tilted state.
    // Calm mode keeps cards still.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;
    if (getMotionMode() === "calm") return undefined;

    let active = null;
    let rect = null;
    let glare = null;
    let frame = 0;
    let px = 0;
    let py = 0;

    const release = () => {
      if (!active) return;
      active.style.transform = REST;
      if (glare) glare.style.opacity = "0";
      active = null;
      rect = null;
      glare = null;
    };

    const apply = () => {
      frame = 0;
      if (!active || !rect) return;
      const x = px - rect.left;
      const y = py - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = -((y - cy) / cy) * 5;
      const rotY = ((x - cx) / cx) * 5;

      active.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-3px)`;
      if (glare) {
        glare.style.opacity = "1";
        glare.style.background = `radial-gradient(circle at ${((x / rect.width) * 100).toFixed(1)}% ${((y / rect.height) * 100).toFixed(1)}%, rgba(255,255,255,0.22) 0%, transparent 68%)`;
      }
    };

    const onMove = (e) => {
      const card = e.target instanceof Element ? e.target.closest(".tilt-card") : null;
      if (card !== active) {
        release();
        if (!card) return;
        active = card;
        rect = card.getBoundingClientRect();
        glare = card.querySelector(":scope > .tilt-glare");
        if (!glare) {
          glare = document.createElement("div");
          glare.className = "tilt-glare";
          card.appendChild(glare);
        }
        sound.playClick(1350);
      }
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    // Card positions change while scrolling, so the cached box must not go stale
    const onScroll = () => {
      if (active) rect = active.getBoundingClientRect();
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", release);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      release();
      document.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", release);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}

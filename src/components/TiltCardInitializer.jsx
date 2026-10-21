"use client";

import { useEffect } from "react";
import sound from "@/utils/audio";

export default function TiltCardInitializer() {
  useEffect(() => {
    const initCards = () => {
      const cards = document.querySelectorAll(".tilt-card");
      cards.forEach((card) => {
        let glare = card.querySelector(".tilt-glare");
        if (!glare) {
          glare = document.createElement("div");
          glare.className = "tilt-glare";
          card.appendChild(glare);
        }

        let rect = null;
        let ticking = false;

        card.onmouseenter = () => {
          rect = card.getBoundingClientRect();
          sound.playClick(1350);
        };

        card.onmousemove = (e) => {
          if (!rect) rect = card.getBoundingClientRect();
          if (!ticking) {
            requestAnimationFrame(() => {
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const cx = rect.width / 2;
              const cy = rect.height / 2;

              const rotX = -((y - cy) / cy) * 5;
              const rotY = ((x - cx) / cx) * 5;

              card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-3px)`;
              if (glare) {
                glare.style.opacity = "1";
                glare.style.background = `radial-gradient(circle at ${((x / rect.width) * 100).toFixed(1)}% ${((y / rect.height) * 100).toFixed(1)}%, rgba(255,255,255,0.22) 0%, transparent 68%)`;
              }
              ticking = false;
            });
            ticking = true;
          }
        };

        card.onmouseleave = () => {
          rect = null;
          card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";
          if (glare) {
            glare.style.opacity = "0";
          }
        };
      });
    };

    initCards();
    const timer = setTimeout(initCards, 500);
    return () => clearTimeout(timer);
  }, []);

  return null;
}

"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const animate = () => {
      if (dotRef.current && ringRef.current) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top = `${mouseY}px`;

        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;

        ringRef.current.style.left = `${ringX.toFixed(2)}px`;
        ringRef.current.style.top = `${ringY.toFixed(2)}px`;
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    const updateHoverListeners = () => {
      const interactives = document.querySelectorAll(
        "a, button, input, select, textarea, label, .interactive-zone, .tilt-card, .cap-card-row, .dock-pill"
      );

      interactives.forEach((el) => {
        el.onmouseenter = () => {
          if (ringRef.current) ringRef.current.classList.add("hover-active");
          if (dotRef.current) dotRef.current.classList.add("hover-active");
          const customCursor = el.getAttribute("data-cursor");
          if (customCursor && textRef.current && ringRef.current) {
            textRef.current.textContent = customCursor;
            ringRef.current.classList.add("has-label");
            ringRef.current.classList.remove("mode-drag", "mode-explore", "mode-lock");
            if (customCursor === "DRAG" || customCursor === "ROLL 3D" || customCursor === "ROLL" || customCursor === "ROTATE") {
              ringRef.current.classList.add("mode-drag");
            }
            if (customCursor === "EXPLORE" || customCursor === "ABOUT") {
              ringRef.current.classList.add("mode-explore");
            }
            if (customCursor === "LOCK") {
              ringRef.current.classList.add("mode-lock");
            }
          }
        };

        el.onmouseleave = () => {
          if (ringRef.current) {
            ringRef.current.classList.remove(
              "hover-active",
              "has-label",
              "mode-drag",
              "mode-explore",
              "mode-lock"
            );
          }
          if (dotRef.current) dotRef.current.classList.remove("hover-active");
          if (textRef.current) textRef.current.textContent = "";
        };
      });
    };

    updateHoverListeners();
    const observer = new MutationObserver(updateHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" id="cursorDot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" id="cursorRing" ref={ringRef} aria-hidden="true">
        <span id="cursorText" ref={textRef} />
      </div>
    </>
  );
}

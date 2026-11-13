"use client";

import { useEffect, useRef } from "react";
import { LOGO_LETTERS, SUB_GLYPHS, SUB_WORD, subLayout } from "@/lib/logo";
import { getMotionMode } from "@/lib/motion";

const LETTERS = Object.fromEntries(LOGO_LETTERS.map((l) => [l.key, l]));
const SUB = subLayout(1.15);
const SUB_POOL = "TECHNOLGIS";

const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";
// The scan crosses one face in this time, left to right across all four
const SCAN_START = 2360;
const SCAN_PER_FACE = 240;
const SUB_START = 3000;
const SUB_STEP = 55;

function Letter({ letter, className }) {
  const l = LETTERS[letter];
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <path className="zl-main" fillRule={l.evenOdd ? "evenodd" : undefined} d={l.main} />
      {l.accent && <path className="zl-accent" d={l.accent} />}
    </svg>
  );
}

// One cube face. The next face hangs off its right edge, so the four faces
// form the band of a cube when folded and the word when laid flat.
function Face({ letter, children }) {
  return (
    <div className="zl-face">
      <div className="zl-side zl-front">
        <Letter letter={letter} className="zl-glyph zl-glyph--ink" />
        <div className="zl-panel" />
        <Letter letter={letter} className="zl-glyph zl-glyph--panel" />
        <div className="zl-shade" />
      </div>
      <div className="zl-side zl-back">
        <div className="zl-panel" />
      </div>
      {children}
    </div>
  );
}

// The animated logo: a die with the Z on its front face turns to face you,
// its band unrolls into Z-E-V-O, a scan line wipes the die away and
// TECHNOLOGIES decodes underneath. It plays once, when scrolled into view.
//
// Without motion (calm mode, no JavaScript, an old browser) the markup is
// already the finished, static logo: the animation only ever starts from it.
export default function ZevoLogoReveal({ className = "" }) {
  const rootRef = useRef(null);
  const subRefs = useRef([]);

  useEffect(() => {
    const root = rootRef.current;
    if (
      !root ||
      getMotionMode() === "calm" ||
      typeof root.animate !== "function" ||
      !("IntersectionObserver" in window)
    ) {
      return undefined;
    }

    const $ = (selector) => root.querySelector(selector);
    const faces = Array.from(root.querySelectorAll(".zl-face"));
    const anims = [];
    let raf = 0;

    // Each TECHNOLOGIES letter flickers through a few others, then lands
    const renderSub = (ms) => {
      subRefs.current.forEach((path, i) => {
        if (!path) return;
        const t = ms - (SUB_START + i * SUB_STEP);
        if (t < 0) {
          path.style.opacity = "0";
          return;
        }
        path.style.opacity = "";
        const step = Math.floor(t / SUB_STEP);
        const ch = step < 5 ? SUB_POOL[(i * 7 + step * 3) % SUB_POOL.length] : SUB_WORD[i];
        path.setAttribute("d", SUB_GLYPHS[ch]);
      });
    };

    const restore = () => {
      cancelAnimationFrame(raf);
      anims.forEach((a) => a.cancel());
      anims.length = 0;
      root.classList.remove("is-armed");
      renderSub(Infinity);
    };

    const play = () => {
      const s = $(".zl-scene").getBoundingClientRect().height;
      const A = (el, keyframes, options) => {
        if (el) anims.push(el.animate(keyframes, { fill: "both", ...options }));
      };
      const part = (face, selector) => face.querySelector(`:scope > ${selector}`);
      const pose = (x, y, rx, ry, k) =>
        `translate3d(${x}px, ${y}px, 0px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(${k}, ${k}, ${k})`;

      A($(".zl-fade"), [{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: "linear" });

      // 0 - 0.9 s the cube arrives turning · 0.9 - 1.5 s it squares up on the
      // Z · 1.5 - 2.5 s it slides left while the band unrolls into a row
      A($(".zl-rig"), [
        { offset: 0, transform: pose(1.5 * s, 0.12 * s, -26, -66, 0.84), easing: EASE_OUT },
        { offset: 0.36, transform: pose(1.5 * s, 0, -15, -33, 1), easing: EASE_IN_OUT },
        { offset: 0.6, transform: pose(1.5 * s, 0, 0, 0, 1), easing: EASE_IN_OUT },
        { offset: 1, transform: pose(0, 0, 0, 0, 1) },
      ], { duration: 2500 });

      // The front face catches less light while the cube is turned
      A(part(faces[0], ".zl-front > .zl-shade"), [{ opacity: 0.2 }, { offset: 0.45, opacity: 0.2 }, { opacity: 0 }], {
        duration: 1500,
      });

      // The lid and floor fade once the cube faces you square on
      root.querySelectorAll(".zl-cap").forEach((cap) =>
        A(cap, [{ opacity: 1 }, { opacity: 0 }], { delay: 1180, duration: 280, easing: "linear" })
      );

      // Each hinge opens flat, overshoots a touch and settles
      faces.slice(1).forEach((face, i) => {
        const delay = 1500 + i * 200;
        A(face, [
          { transform: "rotateY(90deg)", easing: EASE_IN_OUT },
          { offset: 0.8, transform: "rotateY(-5deg)", easing: "cubic-bezier(0.3, 0, 0.3, 1)" },
          { transform: "rotateY(0deg)" },
        ], { duration: 680, delay });
        A(part(face, ".zl-front > .zl-shade"), [{ opacity: 0.5 }, { opacity: 0 }], {
          duration: 680,
          delay,
          easing: EASE_IN_OUT,
        });
      });

      // A Klein scan line sweeps the row; behind it the die's panels are gone
      // and the finished letters stand on the page
      A($(".zl-scan"), [
        { opacity: 0, transform: "translateX(0px)" },
        { offset: 0.06, opacity: 1 },
        { offset: 0.92, opacity: 1 },
        { opacity: 0, transform: `translateX(${4 * s}px)` },
      ], { delay: SCAN_START, duration: SCAN_PER_FACE * 4, easing: "linear" });
      faces.forEach((face, i) => {
        const wipe = { delay: SCAN_START + i * SCAN_PER_FACE, duration: SCAN_PER_FACE, easing: "linear" };
        [".zl-front > .zl-panel", ".zl-front > .zl-glyph--panel"].forEach((selector) =>
          A(part(face, selector), [{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 0 100%)" }], wipe)
        );
      });

      // Soft shadow under the cube, stretching as the row unrolls, then gone
      A($(".zl-shadow"), [
        { offset: 0, opacity: 0, transform: "scale(0.8, 1)" },
        { offset: 0.27, opacity: 1, transform: "scale(1, 1)" },
        { offset: 0.45, opacity: 1, transform: "scale(1, 1)" },
        { offset: 0.76, opacity: 0.8, transform: "scale(4, 1)" },
        { offset: 1, opacity: 0, transform: "scale(4, 1)" },
      ], { duration: 3300, easing: "linear" });

      // The animations now hold the starting pose, so the waiting state can go
      root.classList.remove("is-armed");

      const t0 = performance.now();
      const tick = () => {
        const ms = performance.now() - t0;
        renderSub(ms);
        if (ms < SUB_START + SUB_WORD.length * SUB_STEP + 400) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    // Waits, hidden, until it is on screen
    root.classList.add("is-armed");
    renderSub(0);

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        try {
          play();
        } catch {
          restore();
        }
      },
      { threshold: 0.45 }
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      restore();
    };
  }, []);

  return (
    <div ref={rootRef} className={`zl-anim ${className}`} role="img" aria-label="Zevo Technologies">
      <div className="zl-fade">
        <div className="zl-shadow" />
        <div className="zl-scene">
          <div className="zl-rig">
            <div className="zl-cap zl-cap--top">
              <div className="zl-panel" />
            </div>
            <div className="zl-cap zl-cap--bottom">
              <div className="zl-panel" />
            </div>
            <Face letter="Z">
              <Face letter="E">
                <Face letter="V">
                  <Face letter="O" />
                </Face>
              </Face>
            </Face>
          </div>
        </div>
        <div className="zl-scan" />
        <svg className="zl-subline" viewBox="0 100 400 31" aria-hidden="true">
          {SUB.map(({ ch, x }, i) => (
            <path
              key={i}
              ref={(el) => {
                subRefs.current[i] = el;
              }}
              transform={`translate(${x} 106) scale(1.15)`}
              d={SUB_GLYPHS[ch]}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { getMotionMode } from "@/lib/motion";

const CARD_SELECTOR = [
  ".about-card",
  ".about-creds-strip",
  ".mission-card",
  ".cap-card-row",
  ".erp-card",
  ".erp-interactive-console",
  ".shader-monitor-card",
  ".case-card",
  ".estimator-box",
  ".est-spatial-companion",
  ".contact-form-col",
  ".whatsapp-quick-btn",
].join(", ");

// On phones the hero card and metrics sit below the first screen, so they
// enter on scroll like every other card. On desktop the CSS arrival owns them.
const COMPACT_HERO_SELECTOR = ".hero-manifesto-card, .hero-metrics-deck .metric-item";

const MAGNETIC_SELECTOR = ".btn-action-primary, .btn-action-secondary, .btn-header-cta";

// Must match the rv-line animation in globals.css
const LINE_SECONDS = 1;
const LINE_STAGGER = 0.08;

// Scroll-triggered entrances for the whole page (the hero's own arrival is
// plain CSS and needs no script at all).
//
// How this stays safe: an element waiting to enter is hidden by a CSS class,
// never by an inline style, and it enters with a CSS animation that fills
// backwards only. So once the animation is over — or if this component stops
// half-way, or never runs — the element is exactly what its own CSS says it
// is. Nothing can be left invisible. Opacity and transform animations also run
// off the main thread, so they stay smooth while the 3D stage starts up.
export default function MotionDirector() {
  useEffect(() => {
    const calm = getMotionMode() === "calm";
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const compact = window.matchMedia("(max-width: 1024px)").matches;
    const cleanups = [];
    const timers = new Set();
    const splits = new Set();
    let disposed = false;
    let observer = null;

    const later = (fn, ms) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        if (!disposed) fn();
      }, ms);
      timers.add(id);
    };

    /* ---------------- Header: progress bar, compact state, scroll-spy ---------------- */
    const rail = document.querySelector(".top-rail");
    const navLinks = Array.from(document.querySelectorAll(".nav-menu a"));

    const ctx = gsap.context(() => {
      if (rail) {
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            rail.style.setProperty("--scroll-progress", self.progress.toFixed(4));
            rail.classList.toggle("is-compact", self.scroll() > 80);
          },
        });
      }

      navLinks.forEach((link) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        ScrollTrigger.create({
          trigger: target,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => link.classList.toggle("is-active", self.isActive),
        });
      });

      /* ---------------- Marquee leans into the scroll ---------------- */
      if (calm) return;
      const track = document.querySelector(".marquee-track");
      const drift = track && track.getAnimations ? track.getAnimations()[0] : null;
      if (drift) {
        let rate = 1;
        const settleRate = () => {
          rate += (1 - rate) * 0.06;
          drift.playbackRate = rate;
        };
        gsap.ticker.add(settleRate);
        cleanups.push(() => gsap.ticker.remove(settleRate));
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            rate = Math.min(1 + Math.abs(self.getVelocity()) / 900, 5);
          },
        });
      }
    });

    /* ---------------- Entrances ---------------- */
    // Mark an element as waiting to enter
    const prime = (el, variant) => {
      el.classList.add("rv");
      if (variant) el.dataset.rv = variant;
    };

    // Start its entrance
    const enter = (el, delay) => {
      el.style.setProperty("--rv-delay", `${delay.toFixed(2)}s`);
      el.classList.add("rv-in");
    };

    // Hand the element back to its own CSS
    const settle = (el) => {
      el.classList.remove("rv", "rv-in");
      el.style.removeProperty("--rv-delay");
      delete el.dataset.rv;
    };

    // Split a heading into lines and slide each one up through a mask. The
    // split is undone as soon as the lines have landed, so the heading is
    // ordinary text again and re-wraps naturally when the window changes.
    const enterLines = (el, delay) => {
      let split = null;
      try {
        split = SplitText.create(el, { type: "lines", mask: "lines" });
      } catch {
        return false;
      }
      const lines = split.lines || [];
      if (!lines.length) {
        split.revert();
        return false;
      }
      splits.add(split);
      lines.forEach((line, i) => {
        prime(line, "line");
        enter(line, delay + i * LINE_STAGGER);
      });
      const total = delay + (lines.length - 1) * LINE_STAGGER + LINE_SECONDS;
      later(() => {
        splits.delete(split);
        split.revert();
      }, total * 1000 + 150);
      return true;
    };

    const reveal = (el, delay) => {
      if (el.dataset.rv === "title" && !calm && enterLines(el, delay)) {
        // The lines carry the animation; the heading itself is simply shown
        settle(el);
        return;
      }
      enter(el, delay);
    };

    const failOpen = () => {
      if (observer) observer.disconnect();
      document.querySelectorAll(".rv").forEach(settle);
    };

    const onAnimationEnd = (e) => {
      const el = e.target;
      if (
        typeof e.animationName === "string" &&
        e.animationName.startsWith("rv-") &&
        el instanceof Element &&
        el.classList.contains("rv")
      ) {
        settle(el);
      }
    };

    try {
      if (!("IntersectionObserver" in window)) throw new Error("no observer");

      observer = new IntersectionObserver(
        (entries) => {
          const entering = [];
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              observer.unobserve(entry.target);
              entering.push(entry);
            } else if (entry.boundingClientRect.bottom < 0) {
              // Already scrolled past (a reload half-way down): just show it
              observer.unobserve(entry.target);
              settle(entry.target);
            }
          });
          // Things that arrive together enter one after another, top-left first
          entering
            .sort(
              (a, b) =>
                a.boundingClientRect.top - b.boundingClientRect.top ||
                a.boundingClientRect.left - b.boundingClientRect.left
            )
            .forEach((entry, i) => reveal(entry.target, Math.min(i, 6) * 0.07));
        },
        { rootMargin: "0px 0px -7% 0px", threshold: 0.01 }
      );

      const viewportHeight = window.innerHeight;
      // Only what is still below the screen waits for its entrance. Anything
      // already visible stays visible, so nothing ever blinks out.
      const watch = (el, variant) => {
        if (el.getBoundingClientRect().top < viewportHeight) return;
        prime(el, variant);
        observer.observe(el);
      };

      document.querySelectorAll(".section-wrap").forEach((section) => {
        const tag = section.querySelector(".section-tag");
        const title = section.querySelector(".section-title");
        const sub = section.querySelector(".section-subtext");
        if (tag) watch(tag, "tag");
        // Titles holding controls (the estimator's currency switch) rise as one block
        if (title) watch(title, title.querySelector("button") ? "block" : "title");
        if (sub) watch(sub, "soft");
      });

      document.querySelectorAll(CARD_SELECTOR).forEach((el) => watch(el));
      if (compact) document.querySelectorAll(COMPACT_HERO_SELECTOR).forEach((el) => watch(el));

      document.addEventListener("animationend", onAnimationEnd);
      cleanups.push(() => document.removeEventListener("animationend", onAnimationEnd));
    } catch {
      failOpen();
    }

    /* ---------------- Magnetic buttons (mouse only) ---------------- */
    if (finePointer && !calm) {
      let active = null;
      const release = () => {
        if (!active) return;
        gsap.to(active, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)", overwrite: "auto" });
        active = null;
      };
      const onMove = (e) => {
        const el = e.target instanceof Element ? e.target.closest(MAGNETIC_SELECTOR) : null;
        if (el !== active) release();
        if (!el) return;
        active = el;
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - (r.left + r.width / 2)) * 0.18,
          y: (e.clientY - (r.top + r.height / 2)) * 0.28,
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });
      };
      document.addEventListener("mousemove", onMove, { passive: true });
      cleanups.push(() => {
        document.removeEventListener("mousemove", onMove);
        release();
      });
    }

    return () => {
      disposed = true;
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
      splits.forEach((split) => split.revert());
      splits.clear();
      failOpen();
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return null;
}

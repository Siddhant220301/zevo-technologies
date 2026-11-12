"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getDeviceProfile } from "@/lib/device";

// Smooth wheel scrolling for mouse / trackpad users. Touch devices keep their
// native momentum scrolling, which already feels right and costs nothing.
export default function SmoothScroll() {
  useEffect(() => {
    const { coarse, reducedMotion } = getDeviceProfile();
    if (coarse || reducedMotion) return undefined;

    const headerOffset = () =>
      -(parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 78) - 16;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: headerOffset() },
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    // The page must not scroll behind an open menu
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      if (root.classList.contains("menu-open")) lenis.stop();
      else lenis.start();
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}

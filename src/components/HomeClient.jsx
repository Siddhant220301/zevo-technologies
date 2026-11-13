"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import MotionDirector from "@/components/MotionDirector";
import TopRail from "@/components/TopRail";
import SectorReadout from "@/components/SectorReadout";
import HeroSection from "@/components/HeroSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import ErpSection from "@/components/ErpSection";
import MotionLabSection from "@/components/MotionLabSection";
import EstimatorSection from "@/components/EstimatorSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";
import TiltCardInitializer from "@/components/TiltCardInitializer";
import { getDeviceProfile } from "@/lib/device";
import { getMotionMode } from "@/lib/motion";

// three.js is the heaviest thing on the page: load it in its own chunk, after
// the text has painted, so it never delays the first render
const WebGLStage = dynamic(() => import("@/components/WebGLStage"), { ssr: false });

// Interactive shell. The static sections (marquee, about, mission, cases) are
// rendered on the server and passed in as props.
export default function HomeClient({ marquee, about, mission, cases }) {
  const stageRef = useRef(null);
  const [stageReady, setStageReady] = useState(false);
  const [activeSector, setActiveSector] = useState("01 // CUSTOM ERP CORE");

  const handleReadoutChange = useCallback((label) => {
    setActiveSector(label);
  }, []);

  const handleRollDice = () => {
    if (stageRef.current && stageRef.current.rollRandom) stageRef.current.rollRandom();
  };

  const handleSelectFace = (faceIdx) => {
    if (stageRef.current && stageRef.current.rollToFace) stageRef.current.rollToFace(faceIdx);
  };

  // The 3D stage is the heaviest work on the page. Its code is fetched straight
  // away; the stage itself starts once the headline has risen into place
  // (its last line is 98% home by then), the next time the browser is idle.
  useEffect(() => {
    // CSS reads the device tier to decide between live glass and solid cards
    const { tier } = getDeviceProfile();
    document.documentElement.dataset.tier = String(tier);
    // Tier 0 = no WebGL: the page shows without the 3D stage
    if (tier === 0) return undefined;

    // Download and prepare the 3D code while the hero arrives
    import("@/components/WebGLStage").catch(() => {});

    let idleId = 0;
    const start = () => setStageReady(true);
    const startAtMs = getMotionMode() === "calm" ? 300 : 900;
    const timer = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(start, { timeout: 200 });
      } else {
        start();
      }
    }, Math.max(0, startAtMs - performance.now()));
    return () => {
      window.clearTimeout(timer);
      if (idleId) window.cancelIdleCallback(idleId);
    };
  }, []);

  return (
    <>
      <SmoothScroll />
      <MotionDirector />
      <CustomCursor />
      {stageReady && <WebGLStage stageRef={stageRef} onReadoutChange={handleReadoutChange} />}
      <TopRail onRollDice={handleRollDice} />
      <SectorReadout activeSector={activeSector} />
      <main>
        <HeroSection />
        {marquee}
        {about}
        {mission}
        <CapabilitiesSection onSelectFace={handleSelectFace} />
        <ErpSection onSelectFace={handleSelectFace} />
        <MotionLabSection />
        {cases}
        <EstimatorSection onSelectFace={handleSelectFace} onRandomizeSpec={handleRollDice} />
        <ContactSection />
        {/* Closing band: the 3D die comes to rest here before the footer */}
        <div id="closing-stage" className="stage-slot stage-slot--closing" aria-hidden="true" />
      </main>
      <Footer />
      <MobileActionBar />
      <TiltCardInitializer />
    </>
  );
}

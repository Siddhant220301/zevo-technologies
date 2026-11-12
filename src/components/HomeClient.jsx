"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import MotionDirector from "@/components/MotionDirector";
import TopRail from "@/components/TopRail";
import FloatingModeDock from "@/components/FloatingModeDock";
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
  const [activeFormation, setActiveFormation] = useState("dice");
  const [wireframeActive, setWireframeActive] = useState(false);

  const handleReadoutChange = useCallback((label) => {
    setActiveSector(label);
  }, []);

  const handleRollDice = () => {
    if (stageRef.current && stageRef.current.rollRandom) stageRef.current.rollRandom();
  };

  const handleSelectFace = (faceIdx) => {
    if (stageRef.current && stageRef.current.rollToFace) stageRef.current.rollToFace(faceIdx);
  };

  // Formation state lives here so the desktop dock and the mobile menu stay in sync
  const handleFormationChange = (mode) => {
    const setFormation = stageRef.current?.setFormation;
    if (mode === "wireframe") {
      const nextWire = !wireframeActive;
      setWireframeActive(nextWire);
      if (setFormation) setFormation("wireframe", nextWire);
      return;
    }
    setActiveFormation(mode);
    if (setFormation) setFormation(mode, wireframeActive);
  };

  // The 3D stage is the heaviest work on the page. It starts once the hero's
  // arrival has played on a free main thread, the next time the browser is idle.
  useEffect(() => {
    // CSS reads the device tier to decide between live glass and solid cards
    document.documentElement.dataset.tier = String(getDeviceProfile().tier);

    let idleId = 0;
    const start = () => setStageReady(true);
    const arrivalMs = getMotionMode() === "calm" ? 650 : 1450;
    const timer = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(start, { timeout: 600 });
      } else {
        start();
      }
    }, Math.max(0, arrivalMs - performance.now()));
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
      <TopRail
        onRollDice={handleRollDice}
        activeFormation={activeFormation}
        wireframeActive={wireframeActive}
        onFormationChange={handleFormationChange}
      />
      <FloatingModeDock
        onFormationChange={handleFormationChange}
        activeFormation={activeFormation}
        wireframeActive={wireframeActive}
        activeSector={activeSector}
      />
      <main>
        <HeroSection activeFormation={activeFormation} onFormationChange={handleFormationChange} />
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
      <MobileActionBar activeFormation={activeFormation} onFormationChange={handleFormationChange} />
      <TiltCardInitializer />
    </>
  );
}

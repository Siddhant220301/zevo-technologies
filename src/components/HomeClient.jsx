"use client";

import { useRef, useState, useCallback } from "react";
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
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";
import TiltCardInitializer from "@/components/TiltCardInitializer";
import { useStageStart } from "@/lib/useStageStart";

// three.js is the heaviest thing on the page: load it in its own chunk, after
// the text has painted, so it never delays the first render
const WebGLStage = dynamic(() => import("@/components/WebGLStage"), { ssr: false });

// Interactive shell. The static sections (marquee, about, mission, cases) are
// rendered on the server and passed in as props. `canSendFromSite` says
// whether the enquiry form can send email by itself (see app/page.js).
export default function HomeClient({ marquee, about, mission, cases, canSendFromSite = false }) {
  const stageRef = useRef(null);
  const stageReady = useStageStart();
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
        <FaqSection />
        <ContactSection onSelectFace={handleSelectFace} canSendFromSite={canSendFromSite} />
        {/* Closing band: the 3D die comes to rest here before the footer */}
        <div id="closing-stage" className="stage-slot stage-slot--closing" aria-hidden="true" />
      </main>
      <Footer />
      <MobileActionBar />
      <TiltCardInitializer />
    </>
  );
}

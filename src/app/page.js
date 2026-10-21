"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomCursor from "@/components/CustomCursor";
import WebGLStage from "@/components/WebGLStage";
import TopRail from "@/components/TopRail";
import FloatingModeDock from "@/components/FloatingModeDock";
import HeroSection from "@/components/HeroSection";
import EnterpriseMarquee from "@/components/EnterpriseMarquee";
import AboutSection from "@/components/AboutSection";
import MissionSection from "@/components/MissionSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import ErpSection from "@/components/ErpSection";
import MotionLabSection from "@/components/MotionLabSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import EstimatorSection from "@/components/EstimatorSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import TiltCardInitializer from "@/components/TiltCardInitializer";

export default function Home() {
  const stageRef = useRef(null);
  const [activeSector, setActiveSector] = useState("01 // CUSTOM ERP CORE");

  const handleReadoutChange = useCallback((label) => {
    setActiveSector(label);
  }, []);

  const handleRollDice = () => {
    if (stageRef.current && stageRef.current.rollRandom) {
      stageRef.current.rollRandom();
    }
  };

  const handleSelectFace = (faceIdx) => {
    if (stageRef.current && stageRef.current.rollToFace) {
      stageRef.current.rollToFace(faceIdx);
    }
  };

  const handleFormationChange = (mode, isWire) => {
    if (stageRef.current && stageRef.current.setFormation) {
      stageRef.current.setFormation(mode, isWire);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const timer = setTimeout(() => {
      // Reveal for Capability cards
      gsap.utils.toArray(".cap-card-row").forEach((card, idx) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          x: 35,
          opacity: 0,
          duration: 0.6,
          delay: idx * 0.07,
          ease: "power2.out",
        });
      });

      // Reveal for ERP & Case Study cards
      gsap.utils.toArray(".erp-card, .case-card").forEach((card, idx) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          y: 30,
          opacity: 0,
          duration: 0.75,
          delay: (idx % 2) * 0.1,
          ease: "power3.out",
        });
      });
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <CustomCursor />
      <WebGLStage stageRef={stageRef} onReadoutChange={handleReadoutChange} />
      <TopRail onRollDice={handleRollDice} />
      <FloatingModeDock
        onFormationChange={handleFormationChange}
        activeSector={activeSector}
      />
      <main>
        <HeroSection />
        <EnterpriseMarquee />
        <AboutSection />
        <MissionSection />
        <CapabilitiesSection onSelectFace={handleSelectFace} />
        <ErpSection onSelectFace={handleSelectFace} />
        <MotionLabSection />
        <CaseStudiesSection />
        <EstimatorSection
          onSelectFace={handleSelectFace}
          onRandomizeSpec={handleRollDice}
        />
        <ContactSection />
      </main>
      <Footer />
      <TiltCardInitializer />
    </>
  );
}

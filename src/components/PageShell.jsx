"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import MotionDirector from "@/components/MotionDirector";
import TopRail from "@/components/TopRail";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";
import TiltCardInitializer from "@/components/TiltCardInitializer";
import { useStageStart } from "@/lib/useStageStart";

const WebGLStage = dynamic(() => import("@/components/WebGLStage"), { ssr: false });

// Shell for the inner pages: the same header, footer, cursor and motion as the
// home page. The die keeps the right rail (the "article" path in WebGLStage)
// and turns to `face`, the face that belongs to the page. `actionHref` is
// where the phone action bar leads; it steps aside at the element `untilId`.
export default function PageShell({ children, face = 0, actionHref = "/#contact", untilId = "service-cta" }) {
  const stageRef = useRef(null);
  const stageReady = useStageStart();

  const handleRollDice = () => {
    if (stageRef.current && stageRef.current.rollRandom) stageRef.current.rollRandom();
  };

  return (
    <>
      <SmoothScroll />
      <MotionDirector />
      <CustomCursor />
      {stageReady && <WebGLStage stageRef={stageRef} layout="article" face={face} />}
      <TopRail onRollDice={handleRollDice} home={false} />
      <main>
        {children}
        {/* Closing band: the 3D die comes to rest here before the footer */}
        <div id="closing-stage" className="stage-slot stage-slot--closing" aria-hidden="true" />
      </main>
      <Footer />
      <MobileActionBar href={actionHref} untilId={untilId} />
      <TiltCardInitializer />
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { getMotionMode } from "@/lib/motion";

const twoDigits = (n) => String(Math.floor(n)).padStart(2, "0");

// Phones get the taller cut when the film has one
const pickSource = (film) =>
  film.mobile && window.matchMedia("(max-width: 768px)").matches ? film.mobile : film.desktop;

// Starts a film; its file is only asked for at this moment
const playFilm = (video, film) => {
  if (!video.getAttribute("src")) video.setAttribute("src", pickSource(film));
  const attempt = video.play();
  if (attempt && attempt.catch) attempt.catch(() => {});
};

// One film in the Motion Lab viewer.
//  - Nothing but the still image is downloaded until the viewer is on screen.
//  - It plays muted while at least half of it is visible and pauses otherwise.
//  - With lighter motion, or a data-saving connection, it waits for a tap.
//  - A tap toggles play and pause; the corner button opens it full screen with sound.
// `timecodeRef` is the read-out to update and `progressTarget` the element that
// shows progress (it receives the CSS variable --reel-progress, from 0 to 1).
export default function ReelFilm({ film, poster, label, loop, timecodeRef, progressTarget, onEnded, onError }) {
  const videoRef = useRef(null);
  const startedByVisitor = useRef(false);
  // A film the visitor paused stays paused until they press play again
  const pausedByVisitor = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const calm = getMotionMode() === "calm";
    const saveData = Boolean(navigator.connection && navigator.connection.saveData);
    const autoplay = !calm && !saveData;
    const mayPlay = () => !pausedByVisitor.current && (autoplay || startedByVisitor.current);
    let visible = false;
    const play = () => playFilm(video, film);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        if (!visible) video.pause();
        else if (mayPlay()) play();
      },
      { threshold: [0, 0.5, 1] }
    );
    observer.observe(video);

    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (visible && mayPlay()) play();
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => {
      const t = video.currentTime;
      if (timecodeRef && timecodeRef.current) {
        timecodeRef.current.textContent = `TC 00:${twoDigits(t / 60)}:${twoDigits(t % 60)}:${twoDigits((t % 1) * 30)} // FILM`;
      }
      if (progressTarget && progressTarget.current && Number.isFinite(video.duration) && video.duration > 0) {
        progressTarget.current.style.setProperty("--reel-progress", (t / video.duration).toFixed(4));
      }
    };
    // Sound and the browser's own controls belong to full screen only
    const onFullscreen = () => {
      const full = document.fullscreenElement === video;
      video.muted = !full;
      video.controls = full;
    };
    const onPhoneFullscreenEnd = () => {
      video.muted = true;
    };
    const handleEnded = () => {
      if (onEnded) onEnded();
    };
    const handleError = () => {
      if (onError) onError();
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);
    video.addEventListener("webkitendfullscreen", onPhoneFullscreenEnd);
    document.addEventListener("fullscreenchange", onFullscreen);
    document.addEventListener("visibilitychange", onVisibility);
    const progressElement = progressTarget ? progressTarget.current : null;

    return () => {
      observer.disconnect();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
      video.removeEventListener("webkitendfullscreen", onPhoneFullscreenEnd);
      document.removeEventListener("fullscreenchange", onFullscreen);
      document.removeEventListener("visibilitychange", onVisibility);
      video.pause();
      if (progressElement) progressElement.style.removeProperty("--reel-progress");
    };
  }, [film, timecodeRef, progressTarget, onEnded, onError]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      startedByVisitor.current = true;
      pausedByVisitor.current = false;
      playFilm(video, film);
    } else {
      pausedByVisitor.current = true;
      video.pause();
    }
  };

  const openFullScreen = () => {
    const video = videoRef.current;
    if (!video) return;
    startedByVisitor.current = true;
    pausedByVisitor.current = false;
    video.muted = false;
    if (video.requestFullscreen) {
      video.requestFullscreen().catch(() => {
        video.muted = true;
      });
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }
    playFilm(video, film);
  };

  return (
    <>
      <video
        ref={videoRef}
        className="reel-film"
        muted
        playsInline
        loop={loop}
        preload="none"
        poster={poster || undefined}
        aria-label={label}
        onClick={toggle}
      />
      {!playing && (
        <button type="button" className="reel-play" aria-label="Play film" data-cursor="PLAY" onClick={toggle}>
          <span aria-hidden="true" />
        </button>
      )}
      <button type="button" className="reel-full" data-cursor="FULL SCREEN" onClick={openFullScreen}>
        FULL SCREEN + SOUND
      </button>
    </>
  );
}

"use client";

import React, { useEffect, useRef } from "react";

export const CyberBackground: React.FC = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        if (!spotlightRef.current) return;
        const x = ((e.clientX / window.innerWidth) * 100).toFixed(1);
        const y = ((e.clientY / window.innerHeight) * 100).toFixed(1);
        spotlightRef.current.style.background = `radial-gradient(650px circle at ${x}% ${y}%, rgba(34, 197, 94, 0.075), rgba(6, 182, 212, 0.04), transparent 70%)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  // Pre-calculated fixed positions for cyber spark particles
  const sparks = [
    { left: "10%", top: "45%", size: 4, anim: "animate-spark-1", color: "bg-green-400" },
    { left: "18%", top: "70%", size: 3, anim: "animate-spark-2", color: "bg-cyan-400" },
    { left: "28%", top: "30%", size: 5, anim: "animate-spark-3", color: "bg-emerald-400" },
    { left: "38%", top: "80%", size: 3, anim: "animate-spark-1", color: "bg-green-400" },
    { left: "52%", top: "60%", size: 4, anim: "animate-spark-2", color: "bg-cyan-400" },
    { left: "65%", top: "25%", size: 3, anim: "animate-spark-3", color: "bg-emerald-300" },
    { left: "74%", top: "75%", size: 5, anim: "animate-spark-1", color: "bg-cyan-400" },
    { left: "82%", top: "40%", size: 4, anim: "animate-spark-2", color: "bg-green-400" },
    { left: "90%", top: "65%", size: 3, anim: "animate-spark-3", color: "bg-emerald-400" },
    { left: "8%", top: "85%", size: 3, anim: "animate-spark-2", color: "bg-green-400" },
    { left: "46%", top: "20%", size: 4, anim: "animate-spark-1", color: "bg-cyan-300" },
    { left: "94%", top: "30%", size: 4, anim: "animate-spark-3", color: "bg-green-400" },
  ];

  // Precision HUD Crosshairs
  const crosshairs = [
    { left: "12%", top: "18%" },
    { right: "12%", top: "18%" },
    { left: "8%", top: "60%" },
    { right: "8%", top: "60%" },
    { left: "20%", bottom: "15%" },
    { right: "20%", bottom: "15%" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      
      {/* 1. Interactive Cursor Glow Spotlight (Desktop) */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 transition-opacity duration-700 opacity-80 will-change-[background]"
        style={{
          background: `radial-gradient(650px circle at 50% 30%, rgba(34, 197, 94, 0.075), rgba(6, 182, 212, 0.04), transparent 70%)`,
        }}
      />

      {/* 2. Cyber Grid Layer with Smooth Radial Vignette Mask */}
      <div 
        className="absolute inset-0 bg-grid-cyber opacity-40"
        style={{
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, #000 40%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, #000 40%, transparent 95%)",
        }}
      />

      {/* 3. Subtle Dot Matrix Accent */}
      <div 
        className="absolute inset-0 bg-grid-dots opacity-25"
        style={{
          maskImage: "radial-gradient(ellipse 70% 50% at 50% 25%, #000 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 50% 25%, #000 20%, transparent 80%)",
        }}
      />

      {/* 4. Sweeping Cyber Scanner Beam */}
      <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-400/40 to-transparent blur-[1px] animate-cyber-scanline" />

      {/* 5. Living Floating Nebula / Aurora Orbs */}
      {/* Top Center Hero Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full bg-gradient-to-b from-green-500/20 via-emerald-500/15 to-transparent blur-[130px] animate-orb-1" />

      {/* Left Cyan Esports Glow */}
      <div className="absolute top-[20%] -left-36 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-emerald-500/10 to-transparent blur-[140px] animate-orb-2" />

      {/* Right Indigo Gaming Glow */}
      <div className="absolute top-[35%] -right-36 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-indigo-500/15 via-cyan-500/10 to-transparent blur-[150px] animate-orb-3" />

      {/* Bottom Emerald Anchor Glow */}
      <div className="absolute -bottom-48 left-1/3 w-[700px] h-[500px] rounded-full bg-gradient-to-t from-green-500/12 via-emerald-500/8 to-transparent blur-[150px] animate-orb-1" />

      {/* 6. Precision HUD Crosshair Accents */}
      {crosshairs.map((ch, i) => (
        <div
          key={i}
          className="absolute text-slate-600/30 font-mono text-[11px] tracking-widest hidden md:block"
          style={{ ...ch }}
        >
          +
        </div>
      ))}

      {/* 7. Floating Overclock Spark Motes */}
      {sparks.map((spark, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-[0.5px] shadow-sm ${spark.color} ${spark.anim}`}
          style={{
            left: spark.left,
            top: spark.top,
            width: `${spark.size}px`,
            height: `${spark.size}px`,
          }}
        />
      ))}

      {/* 8. Vignette Edge Falloff */}
      <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />

    </div>
  );
};

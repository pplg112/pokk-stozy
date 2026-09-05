"use client";

import React, { useEffect, useState } from "react";

export const CyberBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 50, y: 30 });

  useEffect(() => {
    let frameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        setMousePos({ x, y });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      
      {/* 1. Subtle Interactive Mouse Ambient Spotlight */}
      <div
        className="absolute inset-0 transition-opacity duration-500 opacity-60"
        style={{
          background: `radial-gradient(550px circle at ${mousePos.x}% ${mousePos.y}%, rgba(34, 197, 94, 0.05), transparent 70%)`,
        }}
      />

      {/* 2. Sleek Dark Grid Layer with Smooth Radial Vignette Mask */}
      <div 
        className="absolute inset-0 bg-grid-cyber opacity-25"
        style={{
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 90%)",
        }}
      />

      {/* 3. Subtle Dark Vignette Edge Falloff */}
      <div className="absolute inset-0 bg-radial-vignette opacity-90 pointer-events-none" />

    </div>
  );
};

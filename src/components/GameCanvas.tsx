"use client";

import { useEffect, useRef } from "react";
import SliceSenseGame from "../game/core/Game";

export default function GameCanvas() {
  const gameRef = useRef<SliceSenseGame | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    gameRef.current = new SliceSenseGame(containerRef.current);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div ref={containerRef} />
    </div>
  );
}
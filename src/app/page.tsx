"use client";

import { useState } from "react";

export default function Home() {
  const [started, setStarted] = useState(false);

  if (started) {
    return (
      <main className="h-screen bg-black flex items-center justify-center text-white">
        <h1 className="text-5xl font-bold">
          🎮 Game Scene Coming Soon...
        </h1>
      </main>
    );
  }

  return (
    <main className="h-screen bg-neutral-950 text-white flex items-center justify-center">
      <div className="text-center">

        <h1 className="text-7xl font-black tracking-widest">
          SliceSense
        </h1>

        <p className="mt-3 text-neutral-400">
          Browser Hand-Tracking Arcade Game
        </p>

        <button
          onClick={() => setStarted(true)}
          className="mt-10 rounded-xl bg-cyan-500 px-10 py-4 text-xl font-bold hover:bg-cyan-400 transition"
        >
          PLAY GAME
        </button>

        <p className="mt-12 text-neutral-500">
          High Score: 0
        </p>

        <p className="mt-2 text-neutral-600 text-sm">
          Version 1.0.0
        </p>

      </div>
    </main>
  );
}
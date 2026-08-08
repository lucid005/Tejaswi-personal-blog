"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    function update() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const height = doc.scrollHeight - doc.clientHeight;
      const pct = height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0;
      setProgress(pct);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-[68px] z-40 h-[2px] bg-transparent max-[640px]:top-[60px]"
    >
      <div
        className="h-full origin-left bg-[var(--color-accent)]"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}

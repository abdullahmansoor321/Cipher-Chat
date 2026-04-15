import React, { useEffect, useRef } from "react";

const CursorEffect = () => {
  const cursorRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isInteractiveRef = useRef(false);
  const rafRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      // Check if hovering over interactive element
      const target = e.target;
      const isClickable = 
        (target && target.closest('button, a, [role="button"], input, textarea, select')) ||
        (target && target.style.cursor === 'pointer');

      isInteractiveRef.current = !!isClickable;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
        cursorRef.current.style.opacity = isClickable ? "0" : "1";
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = "0";
      }
    };

    const handleMouseEnter = () => {
      if (cursorRef.current && !isInteractiveRef.current) {
        cursorRef.current.style.opacity = "1";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999] transition-opacity duration-200"
      style={{
        left: 0,
        top: 0,
        opacity: 0,
      }}
    >
      {/* Glow effect */}
      <div className="absolute size-20 bg-amber-500/20 blur-[20px] rounded-full -translate-x-1/2 -translate-y-1/2" />

      {/* Center dot */}
      <div className="absolute size-2 bg-amber-400 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#fbbf24]" />

      {/* Ring */}
      <div className="absolute size-6 border border-amber-400/60 rounded-full -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};

export default CursorEffect;

"use client";

import { useRef, useState } from "react";
import { useMuseum } from "./store";

const RADIUS = 48;

/** Virtual thumb-stick for touch screens. Writes a -1..1 vector into the store. */
export function Joystick() {
  const setJoystick = useMuseum((s) => s.setJoystick);
  const base = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const pointer = useRef<number | null>(null);

  const update = (clientX: number, clientY: number) => {
    const rect = base.current!.getBoundingClientRect();
    let dx = clientX - (rect.left + rect.width / 2);
    let dy = clientY - (rect.top + rect.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > RADIUS) {
      dx = (dx / len) * RADIUS;
      dy = (dy / len) * RADIUS;
    }
    setKnob({ x: dx, y: dy });
    setJoystick({ x: dx / RADIUS, y: dy / RADIUS });
  };

  const release = () => {
    pointer.current = null;
    setKnob({ x: 0, y: 0 });
    setJoystick({ x: 0, y: 0 });
  };

  return (
    <div
      ref={base}
      aria-hidden
      className="relative size-32 touch-none rounded-full border border-paper/25 bg-ink/40 backdrop-blur-sm"
      onPointerDown={(e) => {
        pointer.current = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);
        update(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => e.pointerId === pointer.current && update(e.clientX, e.clientY)}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <span
        className="absolute top-1/2 left-1/2 size-12 rounded-full border border-paper/40 bg-paper/20"
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
      />
    </div>
  );
}

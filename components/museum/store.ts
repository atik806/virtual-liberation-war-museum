"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Pose } from "@/lib/museum/layout";

export type Mode = "choose" | "3d" | "2d";
export type Quality = "low" | "medium" | "high";

interface MuseumState {
  mode: Mode;
  /** Exhibit open in the side panel. */
  selectedId: string | null;
  /** Room the visitor is standing in. */
  room: number;
  /** Throttled copy of the camera pose for the mini-map. */
  pose: Pose;
  /** Where the camera should glide (same room) or cut (other room) to. */
  target: Pose | null;
  /** Bumped on every cut so the HUD can play a fade. */
  cutNonce: number;
  /** Index into the tour order, or null when not touring. */
  tour: number | null;
  joystick: { x: number; y: number };
  quality: Quality;
  reducedMotion: boolean;
  /** Visitor has acknowledged the genocide-gallery warning this visit. */
  warningAck: boolean;
  /** Candles lit in the Hall of Memory — stored only on this device. */
  candles: number;

  setMode: (mode: Mode) => void;
  select: (id: string | null) => void;
  setRoom: (room: number) => void;
  setPose: (pose: Pose) => void;
  goTo: (pose: Pose) => void;
  arrive: () => void;
  cut: () => void;
  setTour: (step: number | null) => void;
  setJoystick: (v: { x: number; y: number }) => void;
  setQuality: (q: Quality) => void;
  setReducedMotion: (v: boolean) => void;
  ackWarning: () => void;
  lightCandle: () => void;
}

export const useMuseum = create<MuseumState>()(
  persist(
    (set) => ({
      mode: "choose",
      selectedId: null,
      room: 0,
      pose: { x: 0, z: 0, yaw: 0 },
      target: null,
      cutNonce: 0,
      tour: null,
      joystick: { x: 0, y: 0 },
      quality: "medium",
      reducedMotion: false,
      warningAck: false,
      candles: 0,

      setMode: (mode) => set({ mode, selectedId: null, tour: null, target: null }),
      select: (selectedId) => set({ selectedId }),
      setRoom: (room) => set({ room }),
      setPose: (pose) => set({ pose }),
      goTo: (target) => set({ target }),
      arrive: () => set({ target: null }),
      cut: () => set((s) => ({ cutNonce: s.cutNonce + 1 })),
      setTour: (tour) => set({ tour }),
      setJoystick: (joystick) => set({ joystick }),
      setQuality: (quality) => set({ quality }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      ackWarning: () => set({ warningAck: true }),
      lightCandle: () => set((s) => ({ candles: Math.min(s.candles + 1, 999) })),
    }),
    {
      name: "lwm-museum",
      partialize: (s) => ({ candles: s.candles, quality: s.quality }),
    },
  ),
);

/** Pointer-drag bookkeeping shared by the look controls and exhibit clicks. */
export const dragState = { moved: false };

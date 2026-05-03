// src/components/Labels/Projector.tsx
//
// 3D --> 2D label projection system for all Cassini instruments.
//
// [THIS NEEDS A LOT OF WORK]
//
// The SCALE_ANCHORS for the ruler remain static - they reference scene-unit positions
// that don't correspond to any mesh and are intentionally model-agnostic.
// NOTE TO FUTURE ME: FORCE labels for cassiniA.glb ONLY

import {
  useProjectedPoints,
  type AnchorPoint,
} from "@/hooks/useProjectedPoints";
import { COMPONENTS } from "@/scenes/cassini/data/components";
import { labelAnchorsRef } from "@/scenes/cassini/Spacecraft";
import { useMissionStore } from "@/store/missionStore";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import styles from "./Labels.module.css";

//  Scale reference anchors (right-side ruler)
// These remain staticthey are scene-unit reference markers, not mesh anchors.
export const SCALE_ANCHORS: AnchorPoint[] = [
  { id: "scale:0", worldPosition: new THREE.Vector3(0, 0, 0), modelRadius: 0 },
  {
    id: "scale:2",
    worldPosition: new THREE.Vector3(0, 2.24, 0),
    modelRadius: 0,
  },
  {
    id: "scale:4",
    worldPosition: new THREE.Vector3(0, 4.48, 0),
    modelRadius: 0,
  },
  {
    id: "scale:6",
    worldPosition: new THREE.Vector3(0, 6.72, 0),
    modelRadius: 0,
  },
];

//  Label tier config
const PRIMARY_IDS = new Set(["hga", "huygens", "bus", "iss", "radar", "mag"]);

const SUBLABEL: Record<string, string> = {
  bus: "2,125 kg · 12-sided Al",
  hga: "4.0 m Ø · Ka/X/Ku band",
  huygens: "350 kg · AQ60 shield",
  iss: "57.83 kg · NAC + WAC",
  vims: "37.14 kg · 0.35–5.1 µm",
  cirs: "39.24 kg · 7–1,000 µm",
  radar: "41.43 kg · 13,776.5 MHz",
  inms: "9.25 kg · ion + neutral",
  rpws: "6.80 kg · plasma waves",
  caps: "12.50 kg · ELS/IBS/IMS",
  cda: "16.36 kg · dust analyzer",
  mag: "8.82 kg · 13 m boom",
  mimi: "16.00 kg · ENA imaging",
  uvis: "15.43 kg · 56–190 nm",
  rss: "14.38 kg · X + Ka band",
};

//  Component

export function Projector() {
  const showLabels = useMissionStore((s) => s.showLabels);
  const activeComponent = useMissionStore((s) => s.activeComponent);
  const setActiveComponent = useMissionStore((s) => s.setActiveComponent);
  const currentT = useMissionStore((s) => s.currentT);

  // On each frame, merge live mesh anchors with static scale anchors.
  // useProjectedPoints receives a stable ref whose contents are updated in-place.
  const mergedAnchorsRef = useRef<AnchorPoint[]>(SCALE_ANCHORS);

  useFrame(() => {
    // labelAnchorsRef.current is written by LabelModel in Spacecraft.tsx every frame.
    // We merge it with the static SCALE_ANCHORS here.
    mergedAnchorsRef.current = [...labelAnchorsRef.current, ...SCALE_ANCHORS];
  });

  const projectedPoints = useProjectedPoints(mergedAnchorsRef.current);

  if (!showLabels) return null;

  const huygensHasSeparated = currentT >= 0.361177;
  const huygensSignalLost = currentT >= 0.52;

  return (
    <Html fullscreen>
      <div className={styles.container}>
        {projectedPoints.map((point) => {
          if (point.id.startsWith("scale:")) return null;

          const component = COMPONENTS.find((c) => c.id === point.id);
          if (!component) return null;

          if (point.id === "huygens") {
            if (!huygensHasSeparated) return null;
            if (huygensSignalLost) return null;
          }

          const isActive = activeComponent === point.id;
          const isPrimary = PRIMARY_IDS.has(point.id);
          const sub = SUBLABEL[point.id] ?? `${component.mass} kg`;
          const baseOpacity = isPrimary || isActive ? 1 : 0.42;

          return (
            <button
              key={point.id}
              className={styles.label}
              data-active={isActive}
              data-primary={isPrimary}
              style={{
                transform: `translate(${point.screenX}px, ${point.screenY}px)`,
                opacity: point.facing ? baseOpacity : 0,
                pointerEvents: point.facing ? "auto" : "none",
              }}
              onClick={() => setActiveComponent(isActive ? null : point.id)}
              aria-pressed={isActive}
              aria-label={`${component.name} — click to view details`}
            >
              <div className={styles.dot} aria-hidden />
              <div className={styles.line} aria-hidden />
              <div className={styles.textBlock}>
                <span className={styles.labelName}>{component.shortName}</span>
                {sub && <span className={styles.labelSub}>{sub}</span>}
              </div>
            </button>
          );
        })}
      </div>
    </Html>
  );
}

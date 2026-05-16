// src/scenes/cassini/parts/RingCrossingFlash.tsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMissionStore } from "../../../store/missionStore";
import { stateAt } from "../lib/stateAt";

const FLASH_COLORS = {
  space: new THREE.Color("#e8d4a0"),
  blueprint: new THREE.Color("#8fd2ff"),
  editorial: new THREE.Color("#c07040"),
  titan: new THREE.Color("#c47520"),
  descent: new THREE.Color("#ff5500"),
};

export function RingCrossingFlash() {
  const lightRef = useRef<THREE.PointLight>(null!);
  const renderMode = useMissionStore((s) => s.renderMode);

  useFrame(() => {
    if (!lightRef.current) return;
    try {
      const t = useMissionStore.getState().currentT;
      const intensity = (stateAt(t) as any).ringCrossingIntensity || 0;

      lightRef.current.intensity = intensity * 12.0;

      let color = FLASH_COLORS.space;
      if (renderMode === "blueprint") color = FLASH_COLORS.blueprint;
      else if (renderMode === "editorial") color = FLASH_COLORS.editorial;
      else if (renderMode === ("titan" as any)) color = (FLASH_COLORS as any).titan;
      else if (renderMode === ("descent" as any)) color = (FLASH_COLORS as any).descent;

      lightRef.current.color.copy(color);
    } catch (err) {
      console.error("[RingCrossingFlash useFrame] swallowed error", err);
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 0, 0]}
      distance={40}
      decay={2}
      intensity={0}
    />
  );
}
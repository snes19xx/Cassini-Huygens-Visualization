// src/hooks/useLiveLabelAnchors.ts
//
// Converts a set of named mesh refs into a live AnchorPoint array that
// useProjectedPoints can consume. Must be called inside a component that
// is already inside the R3F Canvas.
//
// On every frame, reads each mesh's world position via getWorldPosition()
// and writes it into the corresponding AnchorPoint's worldPosition vector.
// the Vector3 objects are reused across frames.

// ALSO NEEDS A LOT OF WORK

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { COMPONENTS } from "../scenes/cassini/data/components";
import type { CassiniAAnchors } from "../scenes/cassini/parts/CassiniHuygensA";
import type { AnchorPoint } from "./useProjectedPoints";

// Pre-built lookup so it doen't scan COMPONENTS on every frame.
const MODEL_RADIUS_BY_ID: Record<string, number> = Object.fromEntries(
  COMPONENTS.map((c) => [c.id, c.modelRadius]),
);

// The IDs to actually anchor to live mesh positions with the A-series models.
// Everything else continues to use the static fallback from components.ts.
const LIVE_IDS = ["bus", "hga", "huygens", "mag", "iss", "radar"] as const;
type LiveId = (typeof LIVE_IDS)[number];

// Map from component ID-- which anchorRefs key to read.
const ID_TO_REF_KEY: Record<LiveId, keyof CassiniAAnchors> = {
  bus: "bus",
  hga: "hga",
  huygens: "huygens",
  mag: "mag",
  iss: "iss",
  radar: "radar",
};

const _scratch = new THREE.Vector3();

/**
 * useLiveLabelAnchors
 *
 * @param anchorRefs  Refs to the labelled meshes from CassiniHuygensA / AwithoutHuygens.
 * @param huygensHasSeparated  When true, the huygens ref is unavailable and its
 *                             anchor is omitted from the output.
 * @returns A stable ref whose `.current` is an AnchorPoint[] updated every frame.
 *          Pass this directly to useProjectedPoints.
 */
export function useLiveLabelAnchors(
  anchorRefs: CassiniAAnchors,
  huygensHasSeparated: boolean,
): React.MutableRefObject<AnchorPoint[]> {
  // Stable Vector3 pool-- one per live ID. Never reallocated.
  const vecPool = useMemo<Record<LiveId, THREE.Vector3>>(
    () => ({
      bus: new THREE.Vector3(),
      hga: new THREE.Vector3(),
      huygens: new THREE.Vector3(),
      mag: new THREE.Vector3(),
      iss: new THREE.Vector3(),
      radar: new THREE.Vector3(),
    }),
    [],
  );

  // Build the initial anchor array. worldPosition vectors are mutated in-place
  // by useFrame below, useProjectedPoints reads them each frame via the ref.
  const anchorsRef = useRef<AnchorPoint[]>(
    LIVE_IDS.map((id) => ({
      id,
      worldPosition: vecPool[id],
      modelRadius: MODEL_RADIUS_BY_ID[id] ?? 3,
    })),
  );

  useFrame(() => {
    for (const id of LIVE_IDS) {
      // Skip Huygens anchor after separation — the mesh is not in the scene.
      if (id === "huygens" && huygensHasSeparated) {
        // Set far off-screen so the projector's onScreen check fails cleanly.
        vecPool[id].set(0, -9999, 0);
        continue;
      }

      const refKey = ID_TO_REF_KEY[id];
      const mesh = anchorRefs[refKey]?.current;

      if (mesh) {
        mesh.getWorldPosition(vecPool[id]);
      }
      // If the ref isn't mounted yet, leave the previous value (no jump).
    }
  });

  return anchorsRef;
}

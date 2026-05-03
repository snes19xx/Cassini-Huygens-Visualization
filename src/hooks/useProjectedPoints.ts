import { useFrame, useThree } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";
import { create } from "zustand";

/**
 * ProjectedPoint — a single point's screen-space metadata.
 */
export interface ProjectedPoint {
  id: string;
  screenX: number; // CSS pixels from left
  screenY: number; // CSS pixels from top
  facing: boolean; // False if the anchor is on the back face
  depth: number; // Camera-space Z for label sorting
  onScreen: boolean; // Whether the point is within the viewport frustum
  y: number; // Raw screen Y (same as screenY, used by some consumers)
}

export interface AnchorPoint {
  id: string;
  worldPosition: THREE.Vector3; // Position in world space (after spacecraft orientation)
  modelRadius: number; // Bounding radius for the safety-zone test
}

/**
 * useProjectionStore — Zustand store for sharing projected points with 2D DOM/SVG overlays.
 * Used by ScaleReference in App.tsx to draw the depth-gauges.
 */
interface ProjectionState {
  projections: Record<string, ProjectedPoint>;
  viewport: { width: number; height: number };
  setProjection: (id: string, point: ProjectedPoint) => void;
  setViewport: (width: number, height: number) => void;
}

export const useProjectionStore = create<ProjectionState>((set) => ({
  projections: {},
  viewport: { width: 0, height: 0 },
  setProjection: (id, point) =>
    set((s) => ({
      projections: { ...s.projections, [id]: point },
    })),
  setViewport: (width, height) => set({ viewport: { width, height } }),
}));

// Module-level reusable vectors to avoid per-frame allocation.
const _worldPos = new THREE.Vector3();
const _toCamera = new THREE.Vector3();
const _projected = new THREE.Vector3();

/**
 * useProjectedPoints — Hook for projecting 3D anchors to 2D screen space.
 * (note to future me: check section 5.1)
 */
export function useProjectedPoints(anchors: AnchorPoint[]) {
  const { camera, size } = useThree();
  const [points, setPoints] = useState<ProjectedPoint[]>([]);

  useFrame(() => {
    camera.getWorldPosition(_toCamera);
    const viewWidth = size.width;
    const viewHeight = size.height;

    // Sync viewport to store if it changed
    const currentViewport = useProjectionStore.getState().viewport;
    if (
      currentViewport.width !== viewWidth ||
      currentViewport.height !== viewHeight
    ) {
      useProjectionStore.getState().setViewport(viewWidth, viewHeight);
    }

    const nextPoints: ProjectedPoint[] = anchors.map((anchor) => {
      _worldPos.copy(anchor.worldPosition);

      // Project to NDC space [-1, 1].
      _projected.copy(_worldPos).project(camera);

      // Convert NDC to CSS pixel space.
      const screenX = (_projected.x * 0.5 + 0.5) * viewWidth;
      const screenY = (-_projected.y * 0.5 + 0.5) * viewHeight;

      // Occlusion test via dot product as per blueprint Section 5.1
      const anchorDist = _worldPos.length();
      let facing = true;

      if (anchorDist > anchor.modelRadius) {
        const cameraDist = _toCamera.length() || 1;
        const cos = _worldPos.dot(_toCamera) / (anchorDist * cameraDist);
        facing = cos > -0.35;
      }

      const onScreen =
        _projected.z < 1 &&
        _projected.x >= -1 &&
        _projected.x <= 1 &&
        _projected.y >= -1 &&
        _projected.y <= 1;

      const point: ProjectedPoint = {
        id: anchor.id,
        screenX,
        screenY,
        y: screenY,
        facing: facing && _projected.z < 1,
        depth: _projected.z,
        onScreen,
      };

      // If the ID starts with 'scale:', sync it to the global store
      if (anchor.id.startsWith("scale:")) {
        useProjectionStore.getState().setProjection(anchor.id, point);
      }

      return point;
    });

    setPoints(nextPoints);
  });

  return points;
}

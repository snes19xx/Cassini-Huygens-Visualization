// src/scenes/cassini/data/cameraOverrides.ts
//
// Cinematic camera overrides keyed to specific timeline events. Each override
// is a hard target the camera should drift toward (via lerp / damp inside
// useCameraFraming). Outside any window, getCameraOverride returns null and
// the camera reverts to default framing.

export interface CameraOverride {
  id: string;
  tStart: number;
  tEnd: number;
  position: [number, number, number];
  lookAt: [number, number, number];
}

export const CAMERA_OVERRIDES: CameraOverride[] = [
  // Sep 14, 2006 — Seeing New Rings: edge-on view across Saturn's ring plane.
  {
    id: "seeing_new_rings",
    tStart: 0.4435,
    tEnd: 0.4520,
    position: [120, 1, 0],
    lookAt: [0, 0, 0],
  },
  // Oct 9, 2007 — Tiger Stripes: focus shifts toward Enceladus's lower hemisphere.
  // posPeak for enceladus_tiger is [-90, -200, -180], south-pole offset.
  {
    id: "enceladus_tiger_stripes",
    tStart: 0.4990,
    tEnd: 0.5040,
    position: [-90, -270, -260],
    lookAt: [-90, -240, -180],
  },
  // Aug 10, 2009 — Equinox: focus purely on Saturn (rings edge-on, long shadows).
  {
    id: "equinox",
    tStart: 0.5905,
    tEnd: 0.5965,
    position: [0, 60, 280],
    lookAt: [0, -240, -60],
  },
  // Sep 15, 2011 — Moon Portrait: wide FOV side-profile capturing Rhea + Enceladus + Mimas.
  // Portrait moons are at y=100, z=-200, x∈{-280,80,280}. Camera pulled south.
  {
    id: "moon_portrait",
    tStart: 0.6960,
    tEnd: 0.7030,
    position: [0, 100, 360],
    lookAt: [0, 100, -200],
  },
  // Jul 8, 2012 — More Rings, Please: high-angle isometric view down on rings.
  {
    id: "more_rings",
    tStart: 0.7370,
    tEnd: 0.7430,
    position: [220, 220, 220],
    lookAt: [0, -240, -60],
  },
  // Jul 18, 2013 — Wave at Saturn: positioned directly behind Saturn eclipsing the sun.
  {
    id: "wave_at_saturn",
    tStart: 0.7890,
    tEnd: 0.7935,
    position: [0, -240, 360],
    lookAt: [0, -240, -60],
  },
  // Dec 3, 2013 — Saturn's Hexagon: top-down north-pole view.
  {
    id: "saturn_hexagon",
    tStart: 0.8080,
    tEnd: 0.8130,
    position: [0, 100, 0],
    lookAt: [0, -240, -60],
  },
];

export function getCameraOverride(t: number): CameraOverride | null {
  for (const override of CAMERA_OVERRIDES) {
    if (t >= override.tStart && t <= override.tEnd) {
      return override;
    }
  }
  return null;
}

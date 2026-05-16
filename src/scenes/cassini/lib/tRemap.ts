// src/scenes/cassini/lib/tRemap.ts
//
// Piecewise-linear bijection between missionT (0→1 raw timeline) and displayT
// (0→1 scrubber position). Cruise is heavily compressed; flyby peaks each
// receive a generous slice of displayT so encounters feel slow and visible.
//
// REMAP_POINTS pairs `[missionT, displayT]`. Each peak from FLYBY_EVENTS is
// expanded by widening its displayT span (~0.024 around each peak) so the
// scrubber lingers on the encounter — the cruise loses time to compensate.

const REMAP_POINTS: [number, number][] = [
  [0.000000, 0.000],   // Launch
  [0.253196, 0.025],   // Camera Test (Oct 2002)
  [0.336770, 0.045],   // Saturn Orbit Insertion
  [0.352000, 0.060],   // Pre titan_huygens
  [0.364000, 0.090],   // titan_huygens peak — Huygens descent
  [0.380000, 0.115],   // Post titan_huygens
  [0.389000, 0.130],   // enceladus_first
  [0.421000, 0.155],   // enceladus_liquid_water
  [0.440000, 0.180],   // titan_lakes
  [0.447560, 0.195],   // seeing_new_rings
  [0.497000, 0.225],   // iapetus_close
  [0.501000, 0.245],   // enceladus_tiger
  [0.522000, 0.270],   // enceladus_organic
  [0.551000, 0.300],   // enceladus_closest
  [0.593402, 0.335],   // equinox
  [0.619000, 0.360],   // mimas_close
  [0.637000, 0.385],   // titan_close
  [0.659000, 0.410],   // rhea_exosphere
  [0.687000, 0.440],   // enceladus_ocean
  [0.699000, 0.470],   // moon_portrait — three moons simultaneously
  [0.722000, 0.495],   // dione_air
  [0.739519, 0.515],   // more_rings
  [0.791065, 0.545],   // wave_at_saturn
  [0.810034, 0.565],   // saturn_hexagon
  [0.823000, 0.585],   // titan_100th
  [0.842000, 0.605],   // enceladus_101_geysers
  [0.895000, 0.640],   // dione_last
  [0.912000, 0.660],   // enceladus_goodbye
  [0.926000, 0.680],   // rhea_returning
  [0.931000, 0.700],   // titan_methane_sea
  [0.960137, 0.730],   // f_ring_orbits
  [0.980344, 0.760],   // first_ring_dive
  [0.980481, 0.770],   // grand_finale_start — Grand Finale gets ~0.23
  [0.984330, 0.820],   // solstice
  [0.989278, 0.880],   // halfway_home
  [0.999115, 0.970],   // final atmospheric dip
  [1.000000, 1.000],   // Signal lost / impact
];

export function missionToDisplay(mt: number): number {
  mt = Math.max(0, Math.min(1, mt));
  for (let i = 1; i < REMAP_POINTS.length; i++) {
    const pt0 = REMAP_POINTS[i - 1];
    const pt1 = REMAP_POINTS[i];
    if (!pt0 || !pt1) continue;
    const [m0, d0] = pt0;
    const [m1, d1] = pt1;
    if (mt <= m1) {
      const frac = m1 === m0 ? 0 : (mt - m0) / (m1 - m0);
      return d0 + frac * (d1 - d0);
    }
  }
  return 1;
}

export function displayToMission(dt: number): number {
  dt = Math.max(0, Math.min(1, dt));
  for (let i = 1; i < REMAP_POINTS.length; i++) {
    const pt0 = REMAP_POINTS[i - 1];
    const pt1 = REMAP_POINTS[i];
    if (!pt0 || !pt1) continue;
    const [m0, d0] = pt0;
    const [m1, d1] = pt1;
    if (dt <= d1) {
      const frac = d1 === d0 ? 0 : (dt - d0) / (d1 - d0);
      return m0 + frac * (m1 - m0);
    }
  }
  return 1;
}

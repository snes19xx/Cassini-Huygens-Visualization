// src/scenes/Cassini/lib/orbitalMechanics.ts

export interface KeplerianElements {
  a: number; // Semi-major axis (scene units)
  e: number; // Eccentricity
  i: number; // Inclination (radians)
  omega: number; // Argument of periapsis (radians)
  Omega: number; // Longitude of ascending node (radians)
  M: number; // Mean anomaly at epoch (radians)
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Solves Kepler's equation using the Newton-Raphson method.
 */
function solveKepler(
  M: number,
  e: number,
  tolerance: number = 1e-6,
  maxIter: number = 50,
): number {
  let E = M; // Initial guess for low to moderate eccentricity

  // For higher eccentricity, a better initial guess prevents divergence
  if (e > 0.8) {
    E = Math.PI;
  }

  for (let iter = 0; iter < maxIter; iter++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= dE;

    if (Math.abs(dE) < tolerance) {
      return E;
    }
  }

  console.warn("Newton-Raphson failed to converge for Kepler's equation.");
  return E;
}

/**
 * Converts Keplerian orbital elements to 3D Cartesian coordinates.
 */
export function getCartesianState(elements: KeplerianElements): Vector3 {
  const { a, e, i, omega, Omega, M } = elements;

  // 1. Solve for Eccentric Anomaly (E)
  const E = solveKepler(M, e);

  // 2. Calculate coordinates in the orbital plane (perifocal system)
  const x_orb = a * (Math.cos(E) - e);
  const y_orb = a * Math.sqrt(1 - e * e) * Math.sin(E);

  // 3. Precompute trigonometric values for rotation matrices
  const cos_omega = Math.cos(omega);
  const sin_omega = Math.sin(omega);
  const cos_Omega = Math.cos(Omega);
  const sin_Omega = Math.sin(Omega);
  const cos_i = Math.cos(i);
  const sin_i = Math.sin(i);

  // 4. Transform to 3D Cartesian coordinate system
  const x =
    x_orb * (cos_Omega * cos_omega - sin_Omega * sin_omega * cos_i) -
    y_orb * (cos_Omega * sin_omega + sin_Omega * cos_omega * cos_i);

  const y =
    x_orb * (sin_Omega * cos_omega + cos_Omega * sin_omega * cos_i) -
    y_orb * (sin_Omega * sin_omega - cos_Omega * cos_omega * cos_i);

  const z = x_orb * (sin_omega * sin_i) + y_orb * (cos_omega * sin_i);

  return { x, y, z };
}

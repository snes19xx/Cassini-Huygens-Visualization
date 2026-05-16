// src/scenes/cassini/data/labelOffsets.ts
//
// TUNING FILE — all label dot positions are controlled here.
//
// Spacecraft coordinate system (model-local, before world rotation):
//   +X  starboard  (right when facing the instrument bay / FRONT view)
//   -X  port       (left  when facing the instrument bay / FRONT view)
//   +Y  up         (toward HGA dish)
//   -Y  down       (toward Huygens probe / bottom of bus)
//   +Z  forward    (toward instrument bay, camera-facing in FRONT view)
//   -Z  rearward   (toward Huygens attachment plate / MAG boom root)
//
// PRIMARY instruments (bus, hga, huygens, iss, radar):
//   The dot starts at the bounding-box centroid of the mesh geometry.
//   PRIMARY_NUDGES adds a world-space correction on top of that.
//   Default is (0, 0, 0) — leave at zero unless the auto position is wrong.
//
// SECONDARY instruments (all others, including mag):
//   The dot is placed at exactly SECONDARY_OFFSETS[id] rotated by the
//   spacecraft quaternion and added to the bus world position.
//   Larger magnitude = farther from spacecraft centre.

import * as THREE from "three";

// World-space nudge added on top of the bounding-box centroid.
// Only change these if the auto-computed dot drifts off the target geometry.
export const PRIMARY_NUDGES: Record<string, THREE.Vector3> = {
  bus: new THREE.Vector3(
    0.5, // +X right / -X left across bus body
    -1.4, // +Y up toward dish / -Y down toward probe
    0, // +Z toward instrument bay / -Z toward rear
  ),

  hga: new THREE.Vector3(
    2.4, // +X shifts dot right across dish face / -X left
    -8.2, // +Y raises dot above dish centre / -Y lowers toward feed horn
    -0.5, // +Z pushes dot forward off dish face / -Z into feed structure
  ),

  huygens: new THREE.Vector3(
    0, // +X right on probe heat shield / -X left
    0, // +Y up toward bus body / -Y further below spacecraft
    0, // +Z toward front face / -Z deeper into rear stack
  ),

  iss: new THREE.Vector3(
    -1.3, // +X right across instrument bay / -X left
    -0.7, // +Y up on bay / -Y down
    0, // +Z forward off bay face / -Z back into bus
  ),

  radar: new THREE.Vector3(
    0.8, // +X right along HGA support structure / -X left
    -0.7, // +Y up / -Y down toward dish
    0.1, // +Z forward / -Z back toward bus top
  ),
};

// Full bus-relative position for each secondary instrument.
// The dot lands at this offset rotated by the spacecraft's world quaternion.
export const SECONDARY_OFFSETS: Record<string, THREE.Vector3> = {
  // MAG — magnetometer boom.
  // Placed in clear upper-right screen space (off the bus silhouette in
  // MAG·SIDE view). Previous low Y put the dot next to the Huygens cone.
  // The dot intentionally floats slightly off the visible boom geometry
  // so the leader line is clean and the label box doesn't overlap the
  // bus body.
  mag: new THREE.Vector3(
    1.8, // +X starboard / -X port — increase to push further right
    3.1, // +Y up / -Y down — raised away from the Huygens cone
    -3.0, // +Z forward / -Z rearward — boom mounts at the rear
  ),

  // VIMS — Visible and Infrared Mapping Spectrometer.
  // Instrument bay, starboard side, upper-middle of front face.
  vims: new THREE.Vector3(
    -1.39, // +X further starboard (right in FRONT view) / -X toward centre
    2.85, // +Y up on bay / -Y down
    0.5, // +Z forward off bay face / -Z back into bus
  ),

  // CIRS — Composite Infrared Spectrometer.
  // Instrument bay, port side, mirrors VIMS position.
  cirs: new THREE.Vector3(
    -1.75, // +X toward centre / -X further port (left in FRONT view)
    1.45, // +Y up on bay / -Y down
    0, // +Z forward off bay face / -Z back into bus
  ),

  // INMS — Ion and Neutral Mass Spectrometer.
  // Instrument bay, upper-centre, slightly starboard.
  inms: new THREE.Vector3(
    1, // +X starboard / -X port
    2.6, // +Y up toward top of bay / -Y down
    0.65, // +Z forward off face / -Z back — increase to push dot further forward
  ),

  // UVIS — Ultraviolet Imaging Spectrograph.
  // Instrument bay, starboard side, lower than VIMS.
  uvis: new THREE.Vector3(
    -1.2, // +X further starboard / -X toward centre
    1.8, // +Y up / -Y down on bay face — decrease for lower placement
    0.3, // +Z forward / -Z back
  ),

  // RPWS — Radio and Plasma Wave Science.
  // Electric-field antennas mount near the top of the bus.
  // Y=0.75 was projecting onto the HGA dish — dropped to 0.25 so the
  // dot sits on the upper bus face (just below the dish ring) and the
  // label box can flow upward into clear space.
  rpws: new THREE.Vector3(
    6.75, // +X starboard / -X port — adjust to pick visible antenna
    2, // +Y up toward HGA mount / -Y down — lower if dot still overlaps dish
    0.45, // +Z toward front / -Z toward rear — slight forward bias
  ),

  // CAPS — Cassini Plasma Spectrometer.
  // Upper-port face of bus body, just below HGA mount ring.
  caps: new THREE.Vector3(
    0.8, // +X toward centre / -X further port — increase magnitude to push further left
    1.5, // +Y up toward HGA mount / -Y down bus body — decrease if too high
    0.2, // +Z toward front face / -Z rearward
  ),

  // MIMI — Magnetospheric Imaging Instrument.
  // Starboard side of bus, mid-height, slight rearward bias.
  mimi: new THREE.Vector3(
    -0.65, // +X further starboard / -X toward centre
    2, // +Y up / -Y down bus — small value keeps it near vertical centre
    -0.25, // +Z forward / -Z rearward — negative value places it on the rear-side face
  ),

  // CDA — Cosmic Dust Analyzer.
  // Lower equipment module at the bottom of the bus.
  cda: new THREE.Vector3(
    4.5, // +X starboard / -X port — small value keeps it near centre-bottom
    3, // +Y up toward bus centre / -Y down — decrease (more negative) to lower the dot
    0.05, // +Z forward / -Z rearward — near zero centres it front-to-back
  ),

  // RSS — Radio Science Subsystem.
  // Uses the HGA as aperture; anchor sits near the HGA feed / upper bus.
  // In the TOP view this dot should be near the dish centre.
  rss: new THREE.Vector3(
    -0.7, // +X right / -X port — slight port bias
    0.45, // +Y up toward dish / -Y down — increase to raise dot toward feed horn
    0.0, // +Z forward / -Z rearward — slightly rear-biased toward feed structure
  ),

  // LGA-1 — Low-Gain Antenna 1, mounted on top of the HGA dish feed.
  // In TOP view this dot lands on the dish-axis centre. Increase Y to
  // lift it further above the dish; nudge X/Z to bias toward one of the
  // dish quadrants if it overlaps the HGA dot too closely.
  lga1: new THREE.Vector3(
    0, // +X right / -X left
    6.9, // +Y up — at HGA feed height
    0.25, // +Z forward / -Z rearward
  ),
};

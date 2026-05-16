// src/scenes/cassini/data/inspectionViews.ts
//
// Guided inspection: instead of dynamically clustering an arbitrary 3D
// projection, we lock the camera to one of four orthogonal viewpoints and
// label only the instruments that face that camera. Each view is curated
// so every Cassini-Huygens component appears in at least one view and no
// view crams the screen — discrete click targets, no merged labels.
//
// Camera positions are tuned for the 0.5-scaled CassiniHuygensA model
// centered roughly at origin. lookAt is offset slightly when a view's
// dominant feature sits below/behind the spacecraft (Huygens at z=-4.5,
// mag boom at z=-4.6).
//
// Mapping note: every component id MUST appear in at least one view.
// Sanity checker in inspectionViews.test (todo) iterates COMPONENTS and
// fails if any id is missing from all views.

export type InspectionViewId = "top" | "front" | "rear" | "mag";

export interface InspectionView {
  id: InspectionViewId;
  label: string;
  hint: string;
  camera: {
    pos: [number, number, number];
    lookAt: [number, number, number];
  };
  // Component IDs surfaced in this view. Anchors not listed here are
  // hidden — keeps each view focused and click targets discrete.
  anchorIds: string[];
}

// Camera positions chosen to (a) frame Cassini at a comfortable size in the
// canvas — closer than the default tableau view but with enough margin for
// the label boxes around the model — and (b) shift the model slightly up in
// the frame via a small negative lookAt.y, so the inspection bar at the
// bottom doesn't crowd the model.
export const INSPECTION_VIEWS: Record<InspectionViewId, InspectionView> = {
  top: {
    id: "top",
    label: "TOP",
    hint: "Dish & RADAR",
    camera: { pos: [0, 18, 4], lookAt: [0, -1.5, -0.5] },
    anchorIds: ["hga", "radar", "rss", "lga1"],
    // Display labels stayed in plain English so the IDs (top/front/rear/mag)
    // could remain stable across the store, anchor lists, and camera presets.
    // The displayed button text comes from `label` only — `hint` is now
    // surfaced as a tooltip (title attribute) and is not rendered inline.
  },
  front: {
    id: "front",
    label: "SIDE 1",
    hint: "Instrument bay",
    // lookAt Y centred near the bus midpoint (was -1.5, which shoved the
    // model into the top half of the frame and cropped the ISS label).
    // Pulled camera back slightly so labels around the instrument bay
    // (VIMS, CIRS, ISS, INMS, UVIS) all fit inside the canvas.
    camera: { pos: [0, 0, 19], lookAt: [0, -0.3, 0] },
    anchorIds: ["iss", "vims", "cirs", "uvis", "inms", "mimi"],
  },
  rear: {
    id: "rear",
    label: "SIDE 2",
    hint: "Huygens probe",
    camera: { pos: [0, 0, -20], lookAt: [0, -1.5, -2.5] },
    anchorIds: ["bus", "huygens"],
  },
  mag: {
    id: "mag",
    label: "REAR",
    hint: "Boom & plasma",
    // Starboard 3/4 view (camera at +X, slight forward Z, elevated).
    // Direction preserved from the original [11, 3, 5] framing so the
    // hand-tuned plasma offsets in labelOffsets.ts still project to the
    // right side of the bus — only the camera distance was increased
    // (12.5 → ~17.9) so this view's apparent model size matches TOP /
    // SIDE 1 / SIDE 2 (all of which sit at ~18-20 units from the bus).
    camera: { pos: [16, 4, 7], lookAt: [0, -1, -1] },
    anchorIds: ["mag", "rpws", "caps", "cda"],
  },
};

export const INSPECTION_VIEW_ORDER: InspectionViewId[] = [
  "top",
  "front",
  "rear",
  "mag",
];

export function getInspectionView(id: InspectionViewId): InspectionView {
  return INSPECTION_VIEWS[id];
}

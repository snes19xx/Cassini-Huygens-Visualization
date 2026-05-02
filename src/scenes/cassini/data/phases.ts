// src/scenes/cassini/data/phases.ts
// T-value formula: T = (date − launch) / (impact − launch)
// Launch (T=0): 1997-10-15 12:00:00 UTC
// Impact (T=1): 2017-09-15 10:45:00 UTC

export interface MissionPhase {
  id: string;
  name: string;
  t: number;
  description: string;
  note?: string; // short contextual note for Timeline chip tooltip
}

export const PHASES: MissionPhase[] = [
  //  Interplanetary Cruise
  {
    id: "launch",
    name: "Launch",
    t: 0.0,
    description:
      "October 15, 1997: Cassini-Huygens lifts off from Cape Canaveral Air Force Station " +
      "aboard a Titan IVB/Centaur. Total launch mass: 5,712 kg. The spacecraft carries " +
      "3,132 kg of propellant for the 7-year interplanetary journey.",
    note: "Oct 15, 1997",
  },
  {
    id: "venus1",
    name: "Venus Flyby 1",
    t: 0.026461,
    description:
      "April 26, 1998: First Venus gravity assist at 234 km altitude. " +
      "Adds ~3 km/s to the spacecraft's heliocentric velocity. " +
      "ISS cameras return the first images of Cassini's commissioning phase.",
    note: "Apr 26, 1998 — 234 km altitude",
  },
  {
    id: "venus2",
    name: "Venus Flyby 2",
    t: 0.084743,
    description:
      "June 24, 1999: Second Venus gravity assist at 600 km altitude. " +
      "The VIMS and CIRS instruments are calibrated during this flyby.",
    note: "Jun 24, 1999 — 600 km altitude",
  },
  {
    id: "earth",
    name: "Earth Flyby",
    t: 0.092303,
    description:
      "August 18, 1999: Gravity assist at Earth, passing at 1,171 km altitude over the South Pacific. " +
      "Cassini's closest approach to a populated world. The flyby adds the final velocity increment needed for Jupiter.",
    note: "Aug 18, 1999 — 1,171 km altitude",
  },
  {
    id: "jupiter",
    name: "Jupiter Flyby",
    t: 0.161026,
    description:
      "December 30, 2000: Jupiter gravity assist at ~10 million km closest approach. " +
      "Cassini and the Galileo orbiter conduct the first dual-spacecraft study of Jupiter. " +
      "ISS captures 26,000 images; CIRS maps Jovian atmospheric temperature.",
    note: "Dec 30, 2000 — ~10×10⁶ km",
  },

  //  Saturn Operations
  {
    id: "soi",
    name: "Saturn Orbit Insertion",
    t: 0.336841,
    description:
      "July 1, 2004: Cassini fires its main engine for 96 minutes in a retrograde burn " +
      "to shed 626 m/s and achieve Saturn orbit capture. During the crossing of the " +
      "ring plane, the HGA is turned forward as a dust shield — a first in deep-space mission history.",
    note: "Jul 1, 2004 — 96 min SOI burn",
  },
  {
    id: "separation",
    name: "Huygens Separation",
    t: 0.361177,
    description:
      "December 25, 2004: Huygens probe separates from Cassini via three pyrotechnic " +
      "bolt-cutters and a spring release at 0.3 m/s. Cassini immediately executes a " +
      "deflection manoeuvre to set up the relay geometry for Titan entry. " +
      "Chain A anomaly: the receiver was never commanded on due to a software omission in 2000.",
    note: "Dec 25, 2004 — pyrotechnic release",
  },
  {
    id: "titan-entry",
    name: "Huygens Titan Entry",
    t: 0.363966,
    description:
      "January 14, 2005: Huygens enters Titan's atmosphere at ~6.0 km/s. " +
      "The AQ60 heat shield (2.7 m, 60° coni-spherical) withstands a 12,000 °C shock layer " +
      "and 1,800 °C surface temperature. After 2.5 hours of parachute descent, Huygens lands on Titan. " +
      "DISR captures 350 images. Surface temperature: −179 °C. Relay Chain B transmits 3 hours of data.",
    note: "Jan 14, 2005 — 2.5 hr descent",
  },

  //  Grand Finale
  {
    id: "grand-finale",
    name: "Grand Finale Start",
    t: 0.980471,
    description:
      "April 26, 2017: Cassini begins its 22 Grand Finale ring-plane dives, " +
      "threading the 2,000 km gap between Saturn's cloud tops and the inner edge of the D ring. " +
      "Each orbit takes approximately 6.5 days. HGA is used as a dust shield on protected crossings.",
    note: "Apr 26, 2017 — Dive 1 of 22",
  },
  {
    id: "ring-cross-2",
    name: "Ring Crossing 2",
    t: 0.981357,
    description: "May 2, 2017: Second Grand Finale ring-plane crossing.",
    note: "May 2, 2017",
  },
  {
    id: "ring-cross-3",
    name: "Ring Crossing 3",
    t: 0.982242,
    description:
      "May 9, 2017: Third crossing — Cassini communicates through the ring plane in real time.",
    note: "May 9, 2017 — live downlink",
  },
  {
    id: "ring-cross-4",
    name: "Ring Crossing 4",
    t: 0.983127,
    description: "May 15, 2017: Fourth ring-plane crossing with live downlink.",
    note: "May 15, 2017",
  },
  {
    id: "ring-cross-5",
    name: "Ring Crossing 5",
    t: 0.984012,
    description: "May 22, 2017: Fifth ring-plane crossing with live downlink.",
    note: "May 22, 2017",
  },
  {
    id: "ring-cross-6",
    name: "Ring Crossing 6",
    t: 0.9849,
    description:
      "May 28, 2017: Sixth crossing — farthest D-ring venture. HGA shielded.",
    note: "May 28, 2017 — deepest D-ring",
  },
  {
    id: "ring-cross-7",
    name: "Ring Crossing 7",
    t: 0.98579,
    description: "June 4, 2017: Second-closest D-ring approach. HGA shielded.",
    note: "Jun 4, 2017",
  },
  {
    id: "ring-cross-8",
    name: "Ring Crossing 8",
    t: 0.986678,
    description: "June 10, 2017: Live downlink crossing.",
    note: "Jun 10, 2017",
  },
  {
    id: "ring-cross-9",
    name: "Ring Crossing 9",
    t: 0.987566,
    description: "June 16, 2017: Ninth ring-plane crossing.",
    note: "Jun 16, 2017",
  },
  {
    id: "ring-cross-10",
    name: "Ring Crossing 10",
    t: 0.988454,
    description: "June 23, 2017: Live downlink crossing.",
    note: "Jun 23, 2017",
  },
  {
    id: "ring-cross-11",
    name: "Ring Crossing 11",
    t: 0.989344,
    description:
      "June 29, 2017: Ventured into the D ring — spacecraft NOT shielded by HGA.",
    note: "Jun 29, 2017 — unshielded D-ring",
  },
  {
    id: "ring-cross-12",
    name: "Ring Crossing 12",
    t: 0.990233,
    description: "July 6, 2017: D-ring crossing, HGA shielded.",
    note: "Jul 6, 2017",
  },
  {
    id: "ring-cross-13",
    name: "Ring Crossing 13",
    t: 0.991122,
    description: "July 12, 2017: Thirteenth ring-plane crossing.",
    note: "Jul 12, 2017",
  },
  {
    id: "ring-cross-14",
    name: "Ring Crossing 14",
    t: 0.992011,
    description: "July 19, 2017: Live downlink crossing.",
    note: "Jul 19, 2017",
  },
  {
    id: "ring-cross-15",
    name: "Ring Crossing 15",
    t: 0.992899,
    description: "July 25, 2017: Fifteenth ring-plane crossing.",
    note: "Jul 25, 2017",
  },
  {
    id: "ring-cross-16",
    name: "Ring Crossing 16",
    t: 0.993788,
    description: "August 1, 2017: Sixteenth ring-plane crossing.",
    note: "Aug 1, 2017",
  },
  {
    id: "ring-cross-17",
    name: "Ring Crossing 17",
    t: 0.994677,
    description: "August 7, 2017: Seventeenth ring-plane crossing.",
    note: "Aug 7, 2017",
  },
  {
    id: "atm-dip-1",
    name: "Atmospheric Dip 1",
    t: 0.995565,
    description:
      "August 14, 2017: First of five terminal periapse atmospheric dips. " +
      "Cassini samples Saturn's upper atmosphere directly with INMS.",
    note: "Aug 14, 2017 — 1st atm. dip",
  },
  {
    id: "atm-dip-2",
    name: "Atmospheric Dip 2",
    t: 0.996453,
    description: "August 20, 2017: Second atmospheric dip.",
    note: "Aug 20, 2017",
  },
  {
    id: "atm-dip-3",
    name: "Atmospheric Dip 3",
    t: 0.99734,
    description:
      "August 27, 2017: Third and lowest atmospheric dip — deepest sampling altitude.",
    note: "Aug 27, 2017 — deepest dip",
  },
  {
    id: "atm-dip-4",
    name: "Atmospheric Dip 4",
    t: 0.998228,
    description: "September 2, 2017: Fourth atmospheric dip.",
    note: "Sep 2, 2017",
  },
  {
    id: "atm-dip-5",
    name: "Atmospheric Dip 5",
    t: 0.999115,
    description:
      "September 9, 2017: Fifth and final atmospheric dip. " +
      "Last orbit before the terminal plunge. All science data transmitted.",
    note: "Sep 9, 2017 — final dip",
  },

  // Terminal
  {
    id: "impact",
    name: "Final Impact",
    t: 1.0,
    description:
      "September 15, 2017, 10:45 UTC: Signal loss. Cassini enters Saturn's atmosphere " +
      "at 111,637 kph (69,368 mph) at 1,920 km altitude. Aerodynamic forces tumble and " +
      "disintegrate the spacecraft within seconds. Peak hull temperature: ~5,500 °C. " +
      "MLI Mylar melts at 254 °C; aluminium structure melts at 477 °C. " +
      "Cassini becomes part of Saturn.",
    note: "Sep 15, 2017 — 10:45 UTC",
  },
];

//  Helper: find active phase index
export function findActivePhaseIndex(t: number): number {
  let idx = 0;
  for (let i = 0; i < PHASES.length; i++) {
    if (t >= PHASES[i].t) idx = i;
    else break;
  }
  return idx;
}

// Grand Finale ring-crossing T-values (for stateAt.ts)
export const RING_CROSSING_T_VALUES: number[] = [
  0.980471, 0.981357, 0.982242, 0.983127, 0.984012, 0.9849, 0.98579, 0.986678,
  0.987566, 0.988454, 0.989344, 0.990233, 0.991122, 0.992011, 0.992899,
  0.993788, 0.994677, 0.995565, 0.996453, 0.99734, 0.998228, 0.999115,
];

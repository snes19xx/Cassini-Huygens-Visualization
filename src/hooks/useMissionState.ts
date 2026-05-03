import { useMissionStore } from '../store/missionStore'
import { stateAt } from '../scenes/cassini/lib/stateAt'
import { MissionState } from '../scenes/cassini/lib/types'
import { PHASES } from '../scenes/cassini/data/phases'

/**
 * Find the index of the active phase for a given mission time t.
 */
export function findActivePhaseIndex(t: number): number {
  for (let i = PHASES.length - 1; i >= 0; i--) {
    if (t >= PHASES[i].t) {
      return i
    }
  }
  return 0
}

/**
 * Hook to retrieve the interpolated mission state for the current time.
 * This can be used in React components to react to mission progress.
 */
export function useMissionState(): MissionState {
  const currentT = useMissionStore((s) => s.currentT)
  return stateAt(currentT)
}

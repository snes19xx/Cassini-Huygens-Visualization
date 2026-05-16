// src/scenes/cassini/parts/SaturnGroup.tsx

import { SaturnBody } from "./SaturnBody";
import { SaturnRings } from "./SaturnRings";

export function SaturnGroup({
  pos = [0, 0, 0],
  scale = 1,
  renderMode,
  showRings = true,
}: {
  pos?: [number, number, number];
  scale?: number;
  renderMode: string;
  showRings?: boolean;
}) {
  return (
    <group position={pos} scale={scale}>
      <SaturnBody renderMode={renderMode} />
      {showRings && <SaturnRings renderMode={renderMode} />}
    </group>
  );
}

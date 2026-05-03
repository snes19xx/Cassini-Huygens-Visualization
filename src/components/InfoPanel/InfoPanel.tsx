// src/components/InfoPanel/InfoPanel.tsx

import { COMPONENTS } from "@/scenes/cassini/data/components";
import { stateAt } from "@/scenes/cassini/lib/stateAt";
import { useMissionStore } from "@/store/missionStore";
import styles from "./InfoPanel.module.css";

// Sub-components

interface BarRowProps {
  label: string;
  value: number; // 0–1
  precision?: number;
  unit?: string;
}

function BarRow({ label, value, precision = 0, unit = "%" }: BarRowProps) {
  const display = `${(value * 100).toFixed(precision)}${unit}`;
  return (
    <div className={styles.barRow}>
      <span className={styles.barLabel}>{label}</span>
      <div className={styles.bar}>
        <div className={styles.barFill} style={{ width: `${value * 100}%` }} />
      </div>
      <span className={styles.barValue}>{display}</span>
    </div>
  );
}

interface StatProps {
  label: string;
  value: string;
}

function Stat({ label, value }: StatProps) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}

// Main component

export function InfoPanel() {
  const currentT = useMissionStore((s) => s.currentT);
  const activeComponentId = useMissionStore((s) => s.activeComponent);
  const setActiveComponent = useMissionStore((s) => s.setActiveComponent);
  const renderMode = useMissionStore((s) => s.renderMode);

  const state = stateAt(currentT);
  const activeComponent = COMPONENTS.find((c) => c.id === activeComponentId);
  const telemetryActive = state.effects.huygensSignal > 0;

  return (
    <div
      className={styles.wrapper}
      data-position={activeComponent ? "right" : "left"}
      data-theme={activeComponent ? "default" : renderMode.toLowerCase()}
      role="region"
      aria-label="Mission information panel"
    >
      {/* Header */}
      <header className={styles.header}>
        <span className={styles.missionId}>
          {activeComponent ? "CAS-HUY / COMP" : "CAS-HUY / SOI"}
        </span>
        <div className={styles.headerActions}>
          <div className={styles.telemetry} aria-live="polite">
            <span
              className={styles.telemetryDot}
              data-active={telemetryActive}
              aria-hidden
            />
            {telemetryActive ? "TLM LIVE" : "TLM LOST"}
          </div>
          {activeComponent && (
            <button
              className={styles.closeBtn}
              onClick={() => setActiveComponent(null)}
              aria-label="Close panel"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L13 13M1 13L13 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      </header>

      {activeComponent ? (
        /* Component detail view (RIGHT SIDE) */
        <>
          <div className={styles.detailHeader}>
            <h2 className={styles.detailName}>{activeComponent.name}</h2>
            <p className={styles.detailSub}>
              {activeComponent.id.toUpperCase()}
            </p>
          </div>

          <p className={styles.detailBody}>{activeComponent.description}</p>

          <div className={styles.sectionLabel}>Specifications</div>
          <div className={styles.statGrid}>
            <Stat label="Total mass" value={`${activeComponent.mass} kg`} />
            {activeComponent.stats.slice(0, 3).map((s, i) => (
              <Stat key={i} label={s.label} value={s.value} />
            ))}
          </div>

          <button
            className={styles.backBtn}
            onClick={() => setActiveComponent(null)}
            aria-label="Return to mission overview"
          >
            <span className={styles.backArrow}>←</span>
            Close Detail
          </button>
        </>
      ) : (
        /* Mission overview (LEFT SIDE) */
        <>
          <div className={styles.sectionLabel}>Power systems</div>
          <div className={styles.statGrid}>
            <Stat
              label="RTG output"
              value={`${(state.effects.rtgGlow * 100).toFixed(0)} W`}
            />
            <Stat
              label="Propellant"
              value={`${(100 - state.effects.soiBurn * 100).toFixed(1)}%`}
            />
          </div>

          <div className={styles.sectionLabel}>Entry status</div>
          <BarRow label="SOI burn" value={state.effects.soiBurn} />
          <BarRow
            label="Disintegr."
            value={state.effects.disintegration}
            precision={1}
          />
          <BarRow label="Huygens sig." value={state.effects.huygensSignal} />
        </>
      )}
    </div>
  );
}

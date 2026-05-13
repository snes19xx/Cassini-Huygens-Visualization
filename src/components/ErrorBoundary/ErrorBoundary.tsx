// src/components/ErrorBoundary/ErrorBoundary.tsx
//
// Catches React errors thrown inside the 3D scene tree (Canvas children,
// useFrame hooks, etc.) so a single bad frame doesn't unmount the entire
// app. The user reported the canvas occasionally crashing back to the home
// screen while exploring around moons; without a stack trace the root
// cause is unknown, so this is a safety net that surfaces the error and
// offers a recovery option (resetting state + remounting the scene).
//
// Usage:
//   <SceneErrorBoundary>
//     <CassiniScene />
//   </SceneErrorBoundary>

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  error: Error | null;
}

export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[SceneErrorBoundary] caught", error, info);
  }

  handleReset = () => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 16,
            background: "#000",
            color: "#cfe6ff",
            fontFamily: "var(--font-mono, monospace)",
            zIndex: 50,
            padding: 32,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 14, letterSpacing: 2, opacity: 0.7 }}>
            SCENE FAULT
          </div>
          <div style={{ fontSize: 12, maxWidth: 480, opacity: 0.85 }}>
            {this.state.error.message || "An unknown error stopped the 3D scene."}
          </div>
          <button
            type="button"
            onClick={this.handleReset}
            style={{
              padding: "8px 18px",
              background: "transparent",
              color: "#cfe6ff",
              border: "1px solid #cfe6ff",
              cursor: "pointer",
              letterSpacing: 2,
              fontSize: 11,
            }}
          >
            RECOVER
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { easeOutBackSoft } from '../scenes/cassini/lib/easing'

interface FlyToTarget {
  position: THREE.Vector3
  lookAt: THREE.Vector3
  duration?: number  // milliseconds, default 1200
}

export function useCameraFlyTo(target: FlyToTarget | null, nonce: number) {
  const { camera, controls } = useThree() as any
  const animRef = useRef<number | null>(null)
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!target || !controls) return
    if (prefersReducedMotion) {
      camera.position.copy(target.position)
      controls.target.copy(target.lookAt)
      controls.update()
      return
    }

    const startPos = camera.position.clone()
    const startTarget = controls.target.clone()
    const duration = target.duration ?? 1200
    const startTime = performance.now()

    if (animRef.current !== null) cancelAnimationFrame(animRef.current)

    const animate = (now: number) => {
      const elapsed = now - startTime
      const rawT = Math.min(elapsed / duration, 1)
      const easedT = easeOutBackSoft(rawT)

      camera.position.lerpVectors(startPos, target.position, easedT)
      controls.target.lerpVectors(startTarget, target.lookAt, easedT)
      controls.update()

      if (rawT < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        animRef.current = null
      }
    }

    animRef.current = requestAnimationFrame(animate)
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current)
    }
  }, [nonce])
}

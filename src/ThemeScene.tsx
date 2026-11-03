import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createSpaceWorld } from './SpaceWorld';
import { seededRandom } from './theme';
import { createQuantumWorld, type QuantumMode, type QuantumSettings } from './QuantumWorld';

interface Props {
  theme: 'quantum' | 'space';
  seed: number;
  enabled: boolean;
  quantumMode?: QuantumMode;
  phase?: number;
  measurement?: number;
  outcome?: number;
}

// Procedural geometry and shaders keep both worlds independent of external assets.
export default function ThemeScene({
  theme,
  seed,
  enabled,
  quantumMode = 'electron',
  phase = 0,
  measurement = 0,
  outcome = 0,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<QuantumSettings>({ phase, measurement, outcome });
  useEffect(() => {
    settingsRef.current = { phase, measurement, outcome };
    hostRef.current?.dispatchEvent(new Event('quantum-update'));
  }, [phase, measurement, outcome]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !enabled) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
    } catch {
      return; // The CSS world remains visible when WebGL is unavailable.
    }
    const random = seededRandom(seed);
    const mobile = host.clientWidth < 700;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 17;
    const world = new THREE.Group();
    scene.add(world);
    const animated: Array<(time: number, delta: number) => void> = [];
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduceMotion = motion.matches;
    let frame = 0;
    let disposed = false;
    const visible = true;
    let lastTime = 0;
    let elapsed = 0;
    const pointer = new THREE.Vector2();
    const look = new THREE.Vector2();
    const variant = random();

    animated.push(
      theme === 'quantum'
        ? createQuantumWorld(world, random, mobile, quantumMode, settingsRef)
        : createSpaceWorld(world, random, mobile),
    );

    function resize() {
      const { width, height } = host!.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.position.z = width < 700 ? 24 : 17;
      camera.updateProjectionMatrix();
      // Recompose the world on portrait screens rather than clipping the focal point.
      world.position.x = width < 700 ? -4.5 : 0;
      world.position.y = width < 700 ? 1 : 0;
      render();
    }
    function render() {
      renderer.render(scene, camera);
    }
    function tick(now: number) {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      const delta = Math.min((now - lastTime) / 1000 || 0, 0.05);
      lastTime = now;
      elapsed += delta;
      if (!reduceMotion) {
        look.lerp(pointer, 0.025);
        camera.position.x = look.x * 0.35;
        camera.position.y = look.y * 0.2;
        camera.lookAt(0, 0, 0);
        animated.forEach((update) => update(elapsed, delta));
      }
      render();
      if (!reduceMotion) frame = requestAnimationFrame(tick);
    }
    function start() {
      if (frame || disposed || !visible || document.hidden) return;
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    }
    function pause() {
      cancelAnimationFrame(frame);
      frame = 0;
    }
    function onVisibility() {
      if (document.hidden) pause();
      else start();
    }
    function onMotion() {
      reduceMotion = motion.matches;
      pause();
      start();
    }
    function onQuantumUpdate() {
      if (reduceMotion) {
        animated.forEach((update) => update(elapsed, 0));
        render();
      }
    }
    function onPointer(event: PointerEvent) {
      pointer.set((event.clientX / innerWidth) * 2 - 1, -((event.clientY / innerHeight) * 2 - 1));
    }
    function onContextLost(event: Event) {
      event.preventDefault();
      pause();
      host!.classList.add('scene-unavailable');
    }
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    host.addEventListener('quantum-update', onQuantumUpdate);
    motion.addEventListener('change', onMotion);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    // Populate procedural objects even when motion is reduced.
    animated.forEach((update) => update(variant * 40, 0));
    resize();
    start();
    return () => {
      disposed = true;
      pause();
      observer.disconnect();
      host.removeEventListener('quantum-update', onQuantumUpdate);
      motion.removeEventListener('change', onMotion);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.Points ||
          object instanceof THREE.Line
        ) {
          geometries.add(object.geometry);
          (Array.isArray(object.material) ? object.material : [object.material]).forEach(
            (material) => materials.add(material),
          );
          if (object instanceof THREE.InstancedMesh) object.dispose();
        } else if (object instanceof THREE.Sprite) materials.add(object.material);
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      host.classList.remove('scene-unavailable');
    };
  }, [theme, seed, enabled, quantumMode]);

  return (
    <div className="theme-scene" ref={hostRef} data-quantum-mode={quantumMode} aria-hidden="true" />
  );
}

'use client';

import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, shaderMaterial, useGLTF, AdaptiveDpr, AdaptiveEvents, Html } from '@react-three/drei';
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import Hero from './Hero';
import About from './About';
import Experience from './Experience';
import Projects from './Projects';

// Grid shader material
const GridShaderMaterial = shaderMaterial(
  {
    uCarPosition: new THREE.Vector3(0, 0, 0),
    uTime: 0,
    uGridColor: new THREE.Color(0.23, 0.51, 0.97),
    uGlowColor: new THREE.Color(0.13, 0.31, 0.67),
    uGridSpacing: 0.2,
    uLineWidth: 0.008,
    uFalloffRadius: 2.2,
    uFalloffSoftness: 2.0,
    uBaseOpacity: 0.075,
    uGlowOpacity: 0.5,
  },
  // Vertex shader
  /*glsl*/ `
    varying vec2 vWorldPosition;
    
    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  // Fragment shader - optimized with fewer calculations
  /*glsl*/ `
    uniform vec3 uCarPosition;
    uniform float uTime;
    uniform vec3 uGridColor;
    uniform vec3 uGlowColor;
    uniform float uGridSpacing;
    uniform float uLineWidth;
    uniform float uFalloffRadius;
    uniform float uFalloffSoftness;
    uniform float uBaseOpacity;
    uniform float uGlowOpacity;
    
    varying vec2 vWorldPosition;
    
    void main() {
      // Distance from car
      vec2 carPos2D = uCarPosition.xz;
      vec2 diff = vWorldPosition - carPos2D;
      float dist = sqrt(dot(diff, diff));
      
      // Early discard for distant fragments
      float edgeDist = length(vWorldPosition);
      if (edgeDist > 10.0) discard;
      
      // Spotlight falloff
      float spotlight = 1.0 - smoothstep(uFalloffRadius - uFalloffSoftness, uFalloffRadius + uFalloffSoftness, dist);
      spotlight *= spotlight; // Cheaper than pow(x, 1.8)
      
      // Combined grid calculation - single pass
      vec2 gridPos = vWorldPosition / uGridSpacing;
      vec2 grid = abs(fract(gridPos - 0.5) - 0.5) * uGridSpacing;
      float line = min(grid.x, grid.y);
      float mainGrid = 1.0 - smoothstep(0.0, uLineWidth, line);
      
      // Accent grid (every 5th line)
      vec2 accentPos = vWorldPosition / (uGridSpacing * 5.0);
      vec2 accentGrid = abs(fract(accentPos - 0.5) - 0.5) * (uGridSpacing * 5.0);
      float accentLine = min(accentGrid.x, accentGrid.y);
      float accent = 1.0 - smoothstep(0.0, uLineWidth * 2.0, accentLine);
      
      float combinedGrid = max(mainGrid, accent * 1.5);
      
      // Simplified visibility
      float visibility = uBaseOpacity + spotlight * uGlowOpacity;
      
      // Color blend
      vec3 finalColor = mix(uGridColor, uGlowColor, spotlight * 0.7);
      
      // Simplified pulse
      float pulse = 1.0 + sin(uTime * 1.5 - dist * 2.0) * 0.15 * spotlight;
      
      float alpha = combinedGrid * visibility * pulse;
      
      // Edge fade
      float edgeFade = 1.0 - smoothstep(6.0, 10.0, edgeDist);
      alpha *= edgeFade;
      
      // Discard nearly invisible fragments
      if (alpha < 0.01) discard;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

extend({ GridShaderMaterial });

// Custom material
declare module '@react-three/fiber' {
  interface ThreeElements {
    gridShaderMaterial: object;
  }
}

const GROUND_Y = -0.85;

// GLB model tuning
const MODEL_DESIRED_MAX_DIM = 2.0;
const MODEL_SCALE_MULTIPLIER = 1.0;
const MODEL_ROTATION_EULER: [number, number, number] = [0, 0, 0];
const MODEL_POSITION_OFFSET: [number, number, number] = [0, 0, 0];

// Motion tuning
const MIN_SIDE_X = 1.85;
const EDGE_MARGIN = 5.0;

// Timing
const DRIVE_DURATION = 0.95; 
const DRIFT_DURATION = 0.75; 

// Softer spring constants for smoother damping
const DRIVE_LAMBDA = 8; 
const DRIFT_LAMBDA = 10;
const IDLE_LAMBDA = 4; 

// Drift physics
const DRIFT_OVERSHOOT_X = 0.6; 
const DRIFT_ROLL_MAX = 0.28;
const DRIFT_PITCH_MAX = 0.18; 

// Yaw angles
const YAW_TRAVEL_RIGHT = Math.PI / 2;
const YAW_TRAVEL_LEFT = -Math.PI / 2;
const YAW_REST_LEFT = Math.PI / 4;
const YAW_REST_RIGHT = -Math.PI / 4;

// Suspension simulation
const SUSPENSION_BOUNCE_FREQ = 4.5; 
const SUSPENSION_DAMPING = 0.25; 

// Board motion tuning
const BOARD_POS_LAMBDA = 7;
const BOARD_YAW_LAMBDA = 9;

type CarOverlayProps = {
  activeSection: number;
  onSectionHeight?: (sectionIndex: number, heightPx: number) => void;
};

// Store for sharing car position between components
const carPositionStore = {
  position: new THREE.Vector3(0, 0, 0),
};

const carVelocityStore = {
  velocity: 0,
};

export default function CarOverlay({ activeSection, onSectionHeight }: CarOverlayProps) {
  const [hasModel, setHasModel] = useState<boolean | null>(null);
  const htmlPortalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let canceled = false;

    fetch('/models/car.glb', { method: 'HEAD' })
      .then((res) => {
        if (!canceled) setHasModel(res.ok);
      })
      .catch(() => {
        if (!canceled) setHasModel(false);
      });

    return () => {
      canceled = true;
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      {/* Portal target for Drei <Html>; keeps WebGL non-interactive while allowing DOM board interaction. */}
      <div ref={htmlPortalRef} className="pointer-events-none fixed inset-0 z-20" />
      <Canvas
        shadows
        dpr={[0.75, 1.5]}
        gl={{ 
          antialias: false,
          powerPreference: 'high-performance', 
          alpha: true,
          stencil: false,
          depth: true,
          precision: 'lowp',
        }}
        camera={{ position: [0, 1.15, 4.2], fov: 35, near: 0.1, far: 50 }}
        frameloop="demand"
        performance={{ min: 0.5, max: 1 }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        
        <ambientLight intensity={0.45} />
        <directionalLight
          intensity={1.1}
          position={[5, 6, 4]}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
          shadow-camera-near={0.5}
          shadow-camera-far={20}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
          shadow-bias={-0.0001}
        />

        <Suspense fallback={null}>
          <Environment preset="city" />
          <GridFloor />
          <CarRig activeSection={activeSection}>
            {hasModel ? <CarGLTF /> : <PlaceholderCar />}
          </CarRig>

          <WorldBoard activeSection={activeSection} portal={htmlPortalRef} onSectionHeight={onSectionHeight} />

          <ContactShadows
            position={[0, GROUND_Y, 0]}
            opacity={0.55}
            blur={2.2}
            far={10}
            resolution={128}
            frames={1}
          />
        </Suspense>
        
        {/* Force continuous rendering for animations */}
        <FrameInvalidator />
      </Canvas>
    </div>
  );
}

// Component to invalidate frames for animation
function FrameInvalidator() {
  useFrame(({ invalidate }) => {
    invalidate();
  });
  return null;
}

// Grid floor component, reuse geometry
const gridGeometry = new THREE.PlaneGeometry(20, 20, 1, 1);

const GridFloor = React.memo(() => {
  const materialRef = useRef<THREE.ShaderMaterial & { uTime: number; uCarPosition: THREE.Vector3 }>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.getElapsedTime();
      materialRef.current.uCarPosition.copy(carPositionStore.position);
    }
  });

  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, GROUND_Y - 0.001, 0]} 
      geometry={gridGeometry} 
      frustumCulled
    >
      <gridShaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        side={THREE.FrontSide}
      />
    </mesh>
  );
});

GridFloor.displayName = 'GridFloor';

// Velocity state for physics based motion
type VelocityState = {
  x: number;
  yaw: number;
  roll: number;
  pitch: number;
  suspensionY: number;
};

type TransitionState = {
  startTime: number;
  fromX: number;
  toX: number;
  dir: -1 | 1;
  travelYaw: number;
  restYaw: number;
  phase: 'accelerate' | 'cruise' | 'brake' | 'drift' | 'settle';
};

const CarRig = React.memo(function CarRig({
  activeSection,
  children,
}: {
  activeSection: number;
  children: React.ReactNode;
}) {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const lastSectionRef = useRef<number | null>(null);
  const transitionRef = useRef<TransitionState | null>(null);
  const velocityRef = useRef<VelocityState>({
    x: 0,
    yaw: 0,
    roll: 0,
    pitch: 0,
    suspensionY: 0,
  });

  const sideX = useMemo(() => {
    return Math.max(MIN_SIDE_X, viewport.width / 2 - EDGE_MARGIN);
  }, [viewport.width]);

  const targetX = useMemo(() => {
    return activeSection % 2 === 0 ? -sideX : sideX;
  }, [activeSection, sideX]);

  const restYawForX = (x: number) => (x < 0 ? YAW_REST_LEFT : YAW_REST_RIGHT);

  const startTransitionIfNeeded = (now: number) => {
    const group = groupRef.current;
    if (!group) return;

    if (lastSectionRef.current === null) {
      lastSectionRef.current = activeSection;
      group.position.x = targetX;
      group.rotation.y = restYawForX(targetX);
      return;
    }

    if (lastSectionRef.current === activeSection) return;
    lastSectionRef.current = activeSection;

    const fromX = group.position.x;
    const toX = targetX;
    const dir = (toX - fromX >= 0 ? 1 : -1) as 1 | -1;
    const travelYaw = dir === 1 ? YAW_TRAVEL_RIGHT : YAW_TRAVEL_LEFT;
    const restYaw = restYawForX(toX);

    transitionRef.current = {
      startTime: now,
      fromX,
      toX,
      dir,
      travelYaw,
      restYaw,
      phase: 'accelerate',
    };

    // Reset velocities for fresh transition
    velocityRef.current = {
      x: velocityRef.current.x, // preserve current velocity for momentum
      yaw: 0,
      roll: 0,
      pitch: 0,
      suspensionY: 0,
    };
  };

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // Cap delta to prevent large jumps on frame drops
    const clampedDelta = Math.min(delta, 0.05);

    const now = state.clock.getElapsedTime();
    startTransitionIfNeeded(now);

    const vel = velocityRef.current;
    const transition = transitionRef.current;

    if (!transition) {
      const idleBreath = Math.sin(now * 0.5) * 0.002;
      
      group.position.x = smoothDamp(group.position.x, targetX, vel, 'x', IDLE_LAMBDA, clampedDelta);
      group.position.y = smoothDamp(group.position.y, GROUND_Y + idleBreath, vel, 'suspensionY', IDLE_LAMBDA, clampedDelta);
      
      const restYaw = restYawForX(group.position.x);
      group.rotation.y = smoothDampAngle(group.rotation.y, restYaw, vel, 'yaw', IDLE_LAMBDA, clampedDelta);
      group.rotation.z = smoothDamp(group.rotation.z, 0, vel, 'roll', IDLE_LAMBDA, clampedDelta);
      group.rotation.x = smoothDamp(group.rotation.x, 0, vel, 'pitch', IDLE_LAMBDA, clampedDelta);
    } else {
      const t = Math.max(0, now - transition.startTime);

      if (t <= DRIVE_DURATION) {
        // Driving phase with acceleration curve
        const driveProgress = t / DRIVE_DURATION;
        
        // Use a smoother S-curve for position
        const positionEase = smootherstep(driveProgress);
        const targetPos = transition.fromX + (transition.toX - transition.fromX) * positionEase;
        
        // Smooth position with velocity tracking
        group.position.x = smoothDamp(group.position.x, targetPos, vel, 'x', DRIVE_LAMBDA, clampedDelta);
        
        // Smooth transition to travel direction
        // Ease into travel yaw, don't snap
        const yawBlend = easeOutQuart(Math.min(1, driveProgress * 2));
        const targetYaw = lerpAngle(restYawForX(transition.fromX), transition.travelYaw, yawBlend);
        group.rotation.y = smoothDampAngle(group.rotation.y, targetYaw, vel, 'yaw', DRIVE_LAMBDA, clampedDelta);
        
        // Subtle lean into the turn during acceleration
        const accelerationPhase = driveProgress < 0.3 ? driveProgress / 0.3 : 1;
        const cruiseRoll = -transition.dir * 0.03 * Math.sin(accelerationPhase * Math.PI);
        group.rotation.z = smoothDamp(group.rotation.z, cruiseRoll, vel, 'roll', DRIVE_LAMBDA, clampedDelta);
        
        // Nose tilts back during acceleration, then levels
        const pitchCurve = driveProgress < 0.25 
          ? -0.06 * easeOutQuart(driveProgress / 0.25)  // quick pitch back on launch
          : -0.06 * (1 - easeInQuad((driveProgress - 0.25) / 0.75)); // gradual return
        group.rotation.x = smoothDamp(group.rotation.x, pitchCurve, vel, 'pitch', DRIVE_LAMBDA, clampedDelta);
        
        // Exaggerated bounce
        const suspensionOffset = Math.sin(t * SUSPENSION_BOUNCE_FREQ * Math.PI * 2) 
          * SUSPENSION_DAMPING 
          * (1 - driveProgress * 0.5); // sustain bounce longer
        group.position.y = smoothDamp(group.position.y, GROUND_Y + suspensionOffset * 0.045, vel, 'suspensionY', 6, clampedDelta);

      } else {
        const driftTime = t - DRIVE_DURATION;
        const driftProgress = Math.min(1, driftTime / DRIFT_DURATION);
        
        // Overshoot that decays
        // Use critically damped spring behavior
        const overshootDecay = Math.exp(-driftProgress * 4);
        const overshootAmount = transition.dir * DRIFT_OVERSHOOT_X * overshootDecay * Math.sin(driftProgress * Math.PI * 1.2);
        const targetPos = transition.toX + overshootAmount;
        
        group.position.x = smoothDamp(group.position.x, targetPos, vel, 'x', DRIFT_LAMBDA, clampedDelta);
        
        // Drift spin into rest position
        // Smooth blend from travel yaw to rest yaw with a slight overshoot
        const yawProgress = easeOutQuart(driftProgress);
        const yawOvershoot = transition.dir * 0.15 * Math.sin(driftProgress * Math.PI) * (1 - driftProgress);
        const targetYaw = lerpAngle(transition.travelYaw, transition.restYaw, yawProgress) + yawOvershoot;
        group.rotation.y = smoothDampAngle(group.rotation.y, targetYaw, vel, 'yaw', DRIFT_LAMBDA, clampedDelta);
        
        // Lean hard into the drift, then settle
        // Peak roll early, then decay smoothly
        const rollPhase = Math.sin(driftProgress * Math.PI * 0.7);
        const rollDecay = 1 - easeInQuad(driftProgress * 0.8);
        // Add extra apex tilt; peaks right when overshoot is maximum
        const apexTilt = Math.sin(driftProgress * Math.PI) * (1 - driftProgress) * 0.15;
        const targetRoll = -transition.dir * (DRIFT_ROLL_MAX * rollPhase * rollDecay + apexTilt);
        group.rotation.z = smoothDamp(group.rotation.z, targetRoll, vel, 'roll', DRIFT_LAMBDA, clampedDelta);
        
        // Aggressive nosedive during braking, then levels
        // Rear squats as weight transfers
        const pitchBrake = DRIFT_PITCH_MAX * Math.sin(driftProgress * Math.PI * 0.5) * Math.pow(1 - driftProgress, 0.7);
        const apexScoop = Math.sin(driftProgress * Math.PI) * 0.15 * (1 - driftProgress * 0.7); // boosted to match heavier tilt
        group.rotation.x = smoothDamp(group.rotation.x, pitchBrake + apexScoop, vel, 'pitch', DRIFT_LAMBDA, clampedDelta);
        
        const primaryBounce = Math.sin(driftTime * SUSPENSION_BOUNCE_FREQ * Math.PI * 2);
        const secondaryBounce = Math.sin(driftTime * SUSPENSION_BOUNCE_FREQ * 1.7 * Math.PI * 2) * 0.3;
        // Add apex compression
        const apexSquat = Math.sin(driftProgress * Math.PI) * 0.025 * (1 - driftProgress);
        const suspensionBounce = (primaryBounce + secondaryBounce)
          * SUSPENSION_DAMPING 
          * Math.exp(-driftProgress * 2.5);
        group.position.y = smoothDamp(group.position.y, GROUND_Y + suspensionBounce * 0.035 - apexSquat, vel, 'suspensionY', 8, clampedDelta);

        if (driftProgress >= 1) {
          transitionRef.current = null;
        }
      }

      group.position.z = smoothDamp(group.position.z, 0, { x: 0 }, 'x', 4, clampedDelta);
    }

    // Update the shared car position for the grid
    carPositionStore.position.set(group.position.x, group.position.y, group.position.z);

    carVelocityStore.velocity = vel.x;
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
});

CarRig.displayName = 'CarRig';

// Smooth damp with velocity tracking
function smoothDamp(
  current: number,
  target: number,
  velocityObj: Record<string, number>,
  velocityKey: string,
  smoothTime: number,
  deltaTime: number
): number {
  const omega = 2 / Math.max(0.0001, smoothTime / 10);
  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  
  const change = current - target;
  const temp = (velocityObj[velocityKey] + omega * change) * deltaTime;
  velocityObj[velocityKey] = (velocityObj[velocityKey] - omega * temp) * exp;
  
  let result = target + (change + temp) * exp;
  
  // Prevent overshoot
  if ((target - current > 0) === (result > target)) {
    result = target;
    velocityObj[velocityKey] = 0;
  }
  
  return result;
}

// Smooth damp for angles
function smoothDampAngle(
  current: number,
  target: number,
  velocityObj: Record<string, number>,
  velocityKey: string,
  smoothTime: number,
  deltaTime: number
): number {
  const twoPi = Math.PI * 2;
  const diff = THREE.MathUtils.euclideanModulo(target - current + Math.PI, twoPi) - Math.PI;
  return smoothDamp(current, current + diff, velocityObj, velocityKey, smoothTime, deltaTime);
}

function CarGLTF() {
  const { scene } = useGLTF('/models/car.glb');
  const localScene = useMemo(() => scene.clone(true), [scene]);
  const groupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Object3D[]>([]);
  const didNormalize = useRef(false);

  useLayoutEffect(() => {
    if (didNormalize.current) return;
    didNormalize.current = true;

    const wheels: THREE.Object3D[] = [];

    localScene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        // Optimize materials
        if (obj.material) {
          obj.material.precision = 'lowp';
        }
      }
      if (obj.name.includes('3DWheel_')) {
        wheels.push(obj);
      }
    });

    wheelsRef.current = wheels;

    const box = new THREE.Box3().setFromObject(localScene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    localScene.position.sub(center);

    const box2 = new THREE.Box3().setFromObject(localScene);
    localScene.position.y -= box2.min.y;

    const maxDim = Math.max(size.x, size.y, size.z);
    const fitScale = maxDim > 0 ? MODEL_DESIRED_MAX_DIM / maxDim : 1;
    const finalScale = fitScale * MODEL_SCALE_MULTIPLIER;

    const group = groupRef.current;
    if (!group) return;
    group.scale.setScalar(finalScale);
    group.rotation.set(MODEL_ROTATION_EULER[0], MODEL_ROTATION_EULER[1], MODEL_ROTATION_EULER[2]);
    group.position.set(MODEL_POSITION_OFFSET[0], MODEL_POSITION_OFFSET[1], MODEL_POSITION_OFFSET[2]);
  }, [localScene]);

    useFrame((_, delta) => {
    const wheels = wheelsRef.current;
    if (wheels.length === 0) return;

    const rotationSpeed = carVelocityStore.velocity * 8;

    // Only update wheels if car is moving
    if (Math.abs(rotationSpeed) > 0.001) {
      const rotation = rotationSpeed * delta;
      for (let i = 0; i < wheels.length; i++) {
        wheels[i].rotateX(-rotation);
      }
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={localScene} />
    </group>
  );
}

function PlaceholderCar() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.35, 0.8]} />
        <meshStandardMaterial color="white" metalness={0.65} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.35, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.05, 0.3, 0.7]} />
        <meshStandardMaterial color="white" metalness={0.35} roughness={0.35} />
      </mesh>
      <mesh position={[0.55, -0.22, 0.42]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.22, 16]} />
        <meshStandardMaterial color="black" roughness={0.65} />
      </mesh>
      <mesh position={[-0.55, -0.22, 0.42]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.22, 16]} />
        <meshStandardMaterial color="black" roughness={0.65} />
      </mesh>
      <mesh position={[0.55, -0.22, -0.42]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.22, 16]} />
        <meshStandardMaterial color="black" roughness={0.65} />
      </mesh>
      <mesh position={[-0.55, -0.22, -0.42]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.22, 16]} />
        <meshStandardMaterial color="black" roughness={0.65} />
      </mesh>
    </group>
  );
}

// Easing functions
function smootherstep(t: number): number {
  // Ken Perlin's smootherstep (smooth acceleration and deceleration)
  t = clamp01(t);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function easeOutQuart(t: number): number {
  const inv = 1 - clamp01(t);
  return 1 - inv * inv * inv * inv;
}

function easeInQuad(t: number): number {
  t = clamp01(t);
  return t * t;
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function lerpAngle(a: number, b: number, t: number): number {
  const twoPi = Math.PI * 2;
  const diff = THREE.MathUtils.euclideanModulo(b - a + Math.PI, twoPi) - Math.PI;
  return a + diff * t;
}

function WorldBoard({
  activeSection,
  portal,
  onSectionHeight,
}: {
  activeSection: number;
  portal: RefObject<HTMLElement>;
  onSectionHeight?: (sectionIndex: number, heightPx: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentTranslateRef = useRef<HTMLDivElement>(null);
  const activeSectionRef = useRef<number>(activeSection);
  const lastScrollRangeBySectionRef = useRef<number[]>([]);
  const lastReportedHeightBySectionRef = useRef<number[]>([]);
  const { viewport, camera } = useThree();
  const boardVelRef = useRef<{ x: number; y: number; z: number; yaw: number; pitch: number }>({
    x: 0,
    y: 0,
    z: 0,
    yaw: 0,
    pitch: 0,
  });

  const sideX = useMemo(() => {
    return Math.max(MIN_SIDE_X, viewport.width / 2 - EDGE_MARGIN);
  }, [viewport.width]);

  const carX = useMemo(() => {
    return activeSection % 2 === 0 ? -sideX : sideX;
  }, [activeSection, sideX]);

  // Stay near center, biased opposite the car
  const boardX = -carX * 0.20;
  const boardY = 0.48;
  // Larger Z bring the board closer to the camera
  const boardZ = 1.85;

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  const updateScrollMapping = () => {
    const container = scrollContainerRef.current;
    const translateEl = contentTranslateRef.current;
    if (!container || !translateEl) return;

    const idx = activeSectionRef.current;

    const sections = Array.from(document.querySelectorAll<HTMLElement>('.section'));
    const sectionEl = sections[idx];
    if (!sectionEl) return;

    const activeContentEl = container.querySelector<HTMLElement>(`[data-worldboard-section="${idx}"]`);

    const containerH = container.clientHeight;
    const measuredContentH = activeContentEl?.scrollHeight ?? 0;
    const contentH = measuredContentH > 0 ? measuredContentH : 0;
    const prevScrollRange = lastScrollRangeBySectionRef.current[idx] ?? 0;
    const scrollRange = Math.max(0, contentH - containerH);

    if (scrollRange > 0 || prevScrollRange === 0) {
      lastScrollRangeBySectionRef.current[idx] = scrollRange;
    }
    const effectiveScrollRange =
      scrollRange > 0 ? scrollRange : lastScrollRangeBySectionRef.current[idx] ?? 0;

    if (onSectionHeight) {
      const desiredHeight = window.innerHeight + effectiveScrollRange;
      const lastReported = lastReportedHeightBySectionRef.current[idx] ?? 0;
      if (Math.abs(desiredHeight - lastReported) > 1) {
        lastReportedHeightBySectionRef.current[idx] = desiredHeight;
        onSectionHeight(idx, desiredHeight);
      }
    }

    const sectionTop = sectionEl.getBoundingClientRect().top + window.scrollY;
    const offsetPx = window.scrollY - sectionTop;
    const y = offsetPx < 0 ? 0 : offsetPx > effectiveScrollRange ? effectiveScrollRange : offsetPx;
    translateEl.style.transform = `translate3d(0, ${-y}px, 0)`;
  };

  useLayoutEffect(() => {
    let raf2 = 0;
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        updateScrollMapping();
      });
    });

    const onScroll = () => updateScrollMapping();
    const onResize = () => updateScrollMapping();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.cancelAnimationFrame(raf1);
      if (raf2) window.cancelAnimationFrame(raf2);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const clampedDelta = Math.min(delta, 0.05);
    const vel = boardVelRef.current;

    // Smoothly animate to the new target instead of snapping.
    group.position.x = smoothDamp(group.position.x, boardX, vel, 'x', BOARD_POS_LAMBDA, clampedDelta);
    group.position.y = smoothDamp(group.position.y, boardY, vel, 'y', BOARD_POS_LAMBDA, clampedDelta);
    group.position.z = smoothDamp(group.position.z, boardZ, vel, 'z', BOARD_POS_LAMBDA, clampedDelta);

    // Yaw to face the camera, then add a slight inward offset.
    const toCamX = camera.position.x - group.position.x;
    const toCamZ = camera.position.z - group.position.z;
    const faceCameraYaw = Math.atan2(toCamX, toCamZ) *.35;
    const inwardYaw = -Math.sign(boardX) * 0.001;
    const targetYaw = faceCameraYaw + inwardYaw;

    // Tilt the board upward slightly (top leans toward the camera).
    const targetPitch = -0.10;
    group.rotation.x = smoothDampAngle(group.rotation.x, targetPitch, vel, 'pitch', BOARD_YAW_LAMBDA, clampedDelta);
    group.rotation.z = 0;
    group.rotation.y = smoothDampAngle(group.rotation.y, targetYaw, vel, 'yaw', BOARD_YAW_LAMBDA, clampedDelta);
  });

  if (!portal.current) return null;

  return (
    <group ref={groupRef}>
      <Html
        portal={portal}
        transform
        center
        occlude={false}
        distanceFactor={0.6}
        zIndexRange={[30, 0]}
        style={{ willChange: 'transform' }}
      >
        <div className="pointer-events-auto" style={{ willChange: 'transform' }}>
          <div className="bg-gray-900/85 backdrop-blur-md border border-gray-700/70 rounded-2xl shadow-xl overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="max-w-5xl w-[90vw] md:w-[70vw] lg:w-[60vw] max-h-[72vh] overflow-hidden"
              style={{ willChange: 'transform' }}
            >
              <div ref={contentTranslateRef} className="will-change-transform" style={{ willChange: 'transform' }}>
                <div>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={activeSection}
                      data-worldboard-section={activeSection}
                      initial={{ opacity: 0, y: 18, scale: 0.985 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.985 }}
                      transition={{ duration: 0.26, ease: 'easeOut' }}
                      onAnimationComplete={() => {
                        updateScrollMapping();
                      }}
                    >
                      {activeSection === 0 ? (
                        <Hero />
                      ) : activeSection === 1 ? (
                        <About />
                      ) : activeSection === 2 ? (
                        <Experience />
                      ) : (
                        <>
                          <Projects />
                          <p className="text-center py-2 mt-4 mb-4 text-gray-300">
                            &copy; {new Date().getFullYear()} Kevin Farokhrouz. All Rights Reserved.
                            <a href="/secret" className="ml-2 hover:underline font-bold">
                              Do NOT click me.
                            </a>
                          </p>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { SKY_ISLAND, TORCH_VIEWPOINTS, generateTerrain } from './terrain'
import type { Block, BlockType } from './terrain'
import { useNight } from './worldState'
import { playBreak } from './useSound'

const BLOCK_COLORS: Record<BlockType, string> = {
  grass: '#5ebb2b',
  dirt: '#79553a',
  stone: '#8b8b8b',
  wood: '#6b4a2b',
  leaves: '#3e8f27',
  coal: '#2b2b2b',
  iron: '#d1b89d',
  gold: '#facc15',
  redstone: '#ef4444',
  diamond: '#38bdf8',
  emerald: '#10b981',
  flower_red: '#f43f5e',
  flower_yellow: '#fde047',
  mushroom_red: '#dc2626',
}

const DAY_SKY = new THREE.Color('#7fb8ff')
const NIGHT_SKY = new THREE.Color('#0b0e1a')

interface Burst {
  pos: THREE.Vector3
  color: string
  t0: number
}

function BlockMesh({
  blocks,
  type,
  onBreak,
}: {
  blocks: Block[]
  type: BlockType
  onBreak: (pos: THREE.Vector3, color: string) => void
}) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const clock = useThree((s) => s.clock)
  const broken = useRef(new Map<number, number>())
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const isFlora =
    type === 'flower_red' ||
    type === 'flower_yellow' ||
    type === 'mushroom_red'

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const color = new THREE.Color()
    blocks.forEach((b, i) => {
      if (isFlora) {
        dummy.position.set(b.x, b.y - 0.22, b.z)
        dummy.scale.set(0.42, 0.58, 0.42)
      } else {
        dummy.position.set(b.x, b.y, b.z)
        dummy.scale.setScalar(1)
      }
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      // slight per-block shade variation so faces read as blocks, not one slab
      const shade = 0.9 + ((Math.sin(b.x * 12.9898 + b.z * 78.233 + b.y) + 1) / 2) * 0.15
      mesh.setColorAt(i, color.set(BLOCK_COLORS[type]).multiplyScalar(shade))
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [blocks, type, dummy, isFlora])

  useFrame(({ clock }) => {
    const mesh = ref.current
    if (!mesh || broken.current.size === 0) return
    for (const [id, respawnAt] of broken.current) {
      if (clock.elapsedTime >= respawnAt) {
        const b = blocks[id]
        if (isFlora) {
          dummy.position.set(b.x, b.y - 0.22, b.z)
          dummy.scale.set(0.42, 0.58, 0.42)
        } else {
          dummy.position.set(b.x, b.y, b.z)
          dummy.scale.setScalar(1)
        }
        dummy.updateMatrix()
        mesh.setMatrixAt(id, dummy.matrix)
        mesh.instanceMatrix.needsUpdate = true
        broken.current.delete(id)
      }
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const mesh = ref.current
    const id = e.instanceId
    if (!mesh || id === undefined || broken.current.has(id)) return
    const b = blocks[id]
    dummy.position.set(b.x, isFlora ? b.y - 0.22 : b.y, b.z)
    dummy.scale.setScalar(0.001)
    dummy.updateMatrix()
    mesh.setMatrixAt(id, dummy.matrix)
    mesh.instanceMatrix.needsUpdate = true
    broken.current.set(id, clock.elapsedTime + 5)
    playBreak()
    onBreak(new THREE.Vector3(b.x, b.y, b.z), BLOCK_COLORS[b.type])
  }

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, blocks.length]}
      onClick={handleClick}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial />
    </instancedMesh>
  )
}

/* Ponytail burst pool: particle break effect */
function BreakParticles({ burst }: { burst: Burst | null }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const dirs = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        return new THREE.Vector3(Math.cos(a), 1.2 + (i % 3) * 0.4, Math.sin(a))
      }),
    [],
  )

  useFrame(({ clock }) => {
    const mesh = ref.current
    if (!mesh) return
    if (!burst) {
      mesh.visible = false
      return
    }
    const t = clock.elapsedTime - burst.t0
    if (t > 0.5) {
      mesh.visible = false
      return
    }
    mesh.visible = true
    const color = new THREE.Color(burst.color)
    dirs.forEach((d, i) => {
      dummy.position
        .copy(burst.pos)
        .addScaledVector(d, t * 4)
        .setY(burst.pos.y + d.y * t * 4 - 9 * t * t)
      dummy.scale.setScalar(0.18 * (1 - t / 0.5))
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      mesh.setColorAt(i, color)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 8]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial />
    </instancedMesh>
  )
}

function SkyAndLights() {
  const night = useNight()
  const { scene } = useThree()
  const sun = useRef<THREE.DirectionalLight>(null)
  const ambient = useRef<THREE.AmbientLight>(null)
  const stars = useRef<THREE.Points>(null)
  const bg = useMemo(() => NIGHT_SKY.clone(), [])

  const starPositions = useMemo(() => {
    const arr = new Float32Array(300 * 3)
    for (let i = 0; i < 300; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 0.45
      arr[i * 3] = Math.sin(phi) * Math.cos(theta) * 90
      arr[i * 3 + 1] = Math.cos(phi) * 90
      arr[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * 90
    }
    return arr
  }, [])

  useLayoutEffect(() => {
    scene.background = bg
  }, [scene, bg])

  useFrame((_, delta) => {
    const k = Math.min(delta * 1.5, 1)
    bg.lerp(night ? NIGHT_SKY : DAY_SKY, k)
    if (sun.current) {
      sun.current.intensity += ((night ? 0.3 : 1.1) - sun.current.intensity) * k
    }
    if (ambient.current) {
      ambient.current.intensity += ((night ? 0.4 : 0.75) - ambient.current.intensity) * k
    }
    if (stars.current) {
      const mat = stars.current.material as THREE.PointsMaterial
      mat.opacity += ((night ? 0.9 : 0) - mat.opacity) * k
    }
  })

  return (
    <>
      <ambientLight ref={ambient} intensity={0.4} />
      <directionalLight ref={sun} position={[30, 40, 10]} intensity={0.3} color="#fff5d6" />
      <points ref={stars}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.6} color="#ffffff" transparent opacity={0.9} />
      </points>
    </>
  )
}

function Clouds() {
  const group = useRef<THREE.Group>(null)
  const seeds = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        x: i * 16 - 40,
        y: 19 + (i % 3) * 2,
        z: (i % 2 ? -1 : 1) * (6 + i * 3),
        w: 5 + (i % 3) * 3,
      })),
    [],
  )

  useFrame((_, delta) => {
    group.current?.children.forEach((cloud) => {
      cloud.position.x += delta * 0.6
      if (cloud.position.x > 48) cloud.position.x = -48
    })
  })

  return (
    <group ref={group}>
      {seeds.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]}>
          <boxGeometry args={[s.w, 0.8, 3.5]} />
          <meshLambertMaterial color="#ffffff" transparent opacity={0.75} />
        </mesh>
      ))}
    </group>
  )
}

/** Animated voxel water plane around the island at y = 0.5 */
function WaterPlane() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = clock.elapsedTime
    mesh.position.y = 0.48 + Math.sin(t * 1.3) * 0.04
    const pos = mesh.geometry.attributes.position
    if (!pos) return
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i)
      const v = pos.getY(i)
      const wave = Math.sin(u * 0.35 + t * 1.8) * Math.cos(v * 0.35 + t * 1.4) * 0.06
      pos.setZ(i, wave)
    }
    pos.needsUpdate = true
  })

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.5, 0]}
    >
      <planeGeometry args={[75, 75, 24, 24]} />
      <meshStandardMaterial
        color="#2563eb"
        transparent
        opacity={0.7}
        roughness={0.15}
        metalness={0.1}
      />
    </mesh>
  )
}

/** Floating sky island beacon with rotating crystal monolith & light beam */
function BeaconMonolith() {
  const crystalRef = useRef<THREE.Mesh>(null)
  const beamRef = useRef<THREE.Mesh>(null)
  const { x, y, z } = SKY_ISLAND

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (crystalRef.current) {
      crystalRef.current.rotation.y = t * 1.2
      crystalRef.current.rotation.z = Math.sin(t * 0.8) * 0.1
      crystalRef.current.position.y = y + 2.3 + Math.sin(t * 2.2) * 0.12
    }
    if (beamRef.current) {
      beamRef.current.rotation.y = -t * 0.5
      const mat = beamRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.45 + Math.sin(t * 2.5) * 0.12
    }
  })

  return (
    <group position={[x, 0, z]}>
      {/* Ancient glowing crystal monolith */}
      <mesh ref={crystalRef} position={[0, y + 2.3, 0]}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={1.4}
          roughness={0.1}
        />
      </mesh>

      {/* Luminous beacon light beam rising into the clouds */}
      <mesh ref={beamRef} position={[0, y + 10.5, 0]}>
        <cylinderGeometry args={[0.22, 0.45, 17, 12, 1, true]} />
        <meshBasicMaterial
          color="#67e8f9"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Point light casting mystical glow on sky island */}
      <pointLight position={[0, y + 2.5, 0]} color="#38bdf8" intensity={2.2} distance={16} />
    </group>
  )
}

/** Viewpoint torches with warm night glow and gentle flame flicker */
function Torches() {
  const night = useNight()
  const lightRefs = useRef<(THREE.PointLight | null)[]>([])

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime
    TORCH_VIEWPOINTS.forEach((_, i) => {
      const light = lightRefs.current[i]
      if (!light) return
      const targetIntensity = night ? 2.2 : 0.25
      const flicker = 1 + Math.sin(t * 15 + i * 3) * 0.08
      light.intensity += (targetIntensity * flicker - light.intensity) * Math.min(delta * 4, 1)
    })
  })

  return (
    <group>
      {TORCH_VIEWPOINTS.map((p, i) => (
        <group key={i} position={[p.x, p.y + 2, p.z]}>
          {/* Glowing torch head */}
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[0.28, 0.35, 0.28]} />
            <meshStandardMaterial
              color="#ffaa33"
              emissive="#ff8800"
              emissiveIntensity={night ? 1.6 : 0.6}
            />
          </mesh>
          {/* Atmospheric warm point light */}
          <pointLight
            ref={(el) => {
              lightRefs.current[i] = el
            }}
            position={[0, 0.1, 0]}
            color="#ff9922"
            distance={15}
            intensity={night ? 2.2 : 0.25}
          />
        </group>
      ))}
    </group>
  )
}

/** Ambient floating fireflies at night and daylight spores */
function AmbientParticles() {
  const night = useNight()
  const pointsRef = useRef<THREE.Points>(null)
  const count = 140

  const { positions, baseCoords, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const base = new Float32Array(count * 3)
    const ph = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 36
      const y = 1.5 + Math.random() * 12
      const z = (Math.random() - 0.5) * 36
      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z
      base[i * 3] = x
      base[i * 3 + 1] = y
      base[i * 3 + 2] = z
      ph[i] = Math.random() * Math.PI * 2
    }
    return { positions: pos, baseCoords: base, phases: ph }
  }, [count])

  const dayColor = useMemo(() => new THREE.Color('#fef08a'), [])
  const nightColor = useMemo(() => new THREE.Color('#bef264'), [])

  useFrame(({ clock }, delta) => {
    const pts = pointsRef.current
    if (!pts) return
    const t = clock.elapsedTime
    const geo = pts.geometry
    const posAttr = geo.attributes.position

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      const phase = phases[i]
      posAttr.setXYZ(
        i,
        baseCoords[idx] + Math.sin(t * 0.4 + phase) * 1.5,
        baseCoords[idx + 1] + Math.sin(t * 0.7 + phase * 2) * 0.8,
        baseCoords[idx + 2] + Math.cos(t * 0.4 + phase) * 1.5,
      )
    }
    posAttr.needsUpdate = true

    const mat = pts.material as THREE.PointsMaterial
    const targetColor = night ? nightColor : dayColor
    mat.color.lerp(targetColor, Math.min(delta * 2, 1))

    if (night) {
      const pulse = 0.55 + 0.35 * Math.sin(t * 2.8)
      mat.opacity += (pulse - mat.opacity) * Math.min(delta * 3, 1)
      mat.size = 0.42
    } else {
      mat.opacity += (0.35 - mat.opacity) * Math.min(delta * 2, 1)
      mat.size = 0.28
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.35}
        color="#bef264"
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function CameraRig() {
  const { camera } = useThree()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const doc = document.documentElement
    const max = doc.scrollHeight - window.innerHeight
    const scroll = max > 0 ? window.scrollY / max : 0
    const angle = t * 0.03 + scroll * 0.9
    const r = 32
    camera.position.set(
      Math.sin(angle) * r,
      17 - scroll * 9 + Math.sin(t * 0.12) * 0.6,
      Math.cos(angle) * r,
    )
    camera.lookAt(0, 2, 0)
  })
  return null
}

export default function VoxelWorld() {
  const blocks = useMemo(() => generateTerrain(40), [])
  const byType = useMemo(() => {
    const groups = {} as Record<BlockType, Block[]>
    for (const b of blocks) (groups[b.type] ??= []).push(b)
    return groups
  }, [blocks])
  const [burst, setBurst] = useState<Burst | null>(null)
  const clockRef = useRef<THREE.Clock | null>(null)

  return (
    <Canvas
      className="!fixed inset-0"
      style={{ position: 'fixed', zIndex: 0 }}
      camera={{ position: [32, 17, 32], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false }}
      onCreated={({ clock }) => {
        clockRef.current = clock
      }}
    >
      <SkyAndLights />
      <Clouds />
      <WaterPlane />
      <BeaconMonolith />
      <Torches />
      <AmbientParticles />
      <CameraRig />
      {(Object.keys(byType) as BlockType[]).map((type) => (
        <BlockMesh
          key={type}
          type={type}
          blocks={byType[type]}
          onBreak={(pos, color) =>
            setBurst({ pos, color, t0: clockRef.current?.elapsedTime ?? 0 })
          }
        />
      ))}
      <BreakParticles burst={burst} />
    </Canvas>
  )
}

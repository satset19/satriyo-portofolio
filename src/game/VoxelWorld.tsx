import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { generateTerrain } from './terrain'
import type { Block, BlockType } from './terrain'
import { useNight } from './worldState'
import { playBreak } from './useSound'

const BLOCK_COLORS: Record<BlockType, string> = {
  grass: '#5ebb2b',
  dirt: '#79553a',
  stone: '#8b8b8b',
  wood: '#6b4a2b',
  leaves: '#3e8f27',
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
  // brokenUntil[instanceId] = clock time when the block respawns
  const broken = useRef(new Map<number, number>())
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const color = new THREE.Color()
    blocks.forEach((b, i) => {
      dummy.position.set(b.x, b.y, b.z)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      // slight per-block shade variation so faces read as blocks, not one slab
      const shade = 0.9 + ((Math.sin(b.x * 12.9898 + b.z * 78.233 + b.y) + 1) / 2) * 0.15
      mesh.setColorAt(i, color.set(BLOCK_COLORS[type]).multiplyScalar(shade))
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [blocks, type, dummy])

  useFrame(({ clock }) => {
    const mesh = ref.current
    if (!mesh || broken.current.size === 0) return
    for (const [id, respawnAt] of broken.current) {
      if (clock.elapsedTime >= respawnAt) {
        const b = blocks[id]
        dummy.position.set(b.x, b.y, b.z)
        dummy.scale.setScalar(1)
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
    dummy.position.set(b.x, b.y, b.z)
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

/* ponytail: one burst pool — a second click mid-burst just retargets it */
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
    () => Array.from({ length: 6 }, (_, i) => ({ x: i * 16 - 40, y: 19 + (i % 3) * 2, z: (i % 2 ? -1 : 1) * (6 + i * 3), w: 5 + (i % 3) * 3 })),
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

export type BlockType =
  | 'grass'
  | 'dirt'
  | 'stone'
  | 'wood'
  | 'leaves'
  | 'coal'
  | 'iron'
  | 'gold'
  | 'redstone'
  | 'diamond'
  | 'emerald'
  | 'flower_red'
  | 'flower_yellow'
  | 'mushroom_red'

export interface Block {
  x: number
  y: number
  z: number
  type: BlockType
}

export const SKY_ISLAND = {
  x: 11,
  y: 12,
  z: -11,
}

export const TORCH_VIEWPOINTS = [
  { x: -3, y: 7, z: -1 },
  { x: -3, y: 6, z: -9 },
  { x: 5, y: 6, z: 2 },
]

// Deterministic hash → 0..1 (no seeds/assets; same island every load)
function hash(x: number, z: number): number {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t)
}

// 2D value noise with bilinear interpolation
function noise(x: number, z: number): number {
  const xi = Math.floor(x)
  const zi = Math.floor(z)
  const xf = smooth(x - xi)
  const zf = smooth(z - zi)
  const a = hash(xi, zi)
  const b = hash(xi + 1, zi)
  const c = hash(xi, zi + 1)
  const d = hash(xi + 1, zi + 1)
  return a + (b - a) * xf + (c - a) * zf + (a - b - c + d) * xf * zf
}

interface OreVein {
  x: number
  y: number
  z: number
  rSq: number
  type: BlockType
}

/** Procedural voxel island: radial falloff heightmap + cliffs + trees + ores + flora + sky island. */
export function generateTerrain(size = 40): Block[] {
  const blocks: Block[] = []
  const half = size / 2
  const heights = new Map<string, number>()

  for (let x = -half; x <= half; x++) {
    for (let z = -half; z <= half; z++) {
      const dist = Math.hypot(x, z) / half
      const n = noise(x * 0.12 + 7, z * 0.12 + 3) * 0.7 + noise(x * 0.35, z * 0.35) * 0.3
      const cliff = noise(x * 0.2 + 20, z * 0.2 + 20) > 0.6 ? 1.5 : 0
      const h = Math.round(n * 6 + 3 + cliff - dist * 6.5)
      if (h <= 0) continue
      heights.set(`${x},${z}`, h)
    }
  }

  // Find exposed cliff face coordinates for natural surface ore exposures
  const cliffSpots: { x: number; y: number; z: number }[] = []
  for (let x = -half; x <= half; x++) {
    for (let z = -half; z <= half; z++) {
      const h = heights.get(`${x},${z}`)
      if (!h) continue
      const minNeighbor = Math.min(
        heights.get(`${x + 1},${z}`) ?? 0,
        heights.get(`${x - 1},${z}`) ?? 0,
        heights.get(`${x},${z + 1}`) ?? 0,
        heights.get(`${x},${z - 1}`) ?? 0,
      )
      for (let y = minNeighbor; y < h - 1; y++) {
        cliffSpots.push({ x, y, z })
      }
    }
  }

  const veins: OreVein[] = []
  let seed = 424242
  function rand() {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }

  // 1. Cliff-exposed ore veins (so coal, iron, gold, redstone, diamond, emerald show on rock faces)
  const oreList: BlockType[] = ['coal', 'iron', 'gold', 'redstone', 'diamond', 'emerald']
  const cliffSorted = [...cliffSpots].sort((a, b) => hash(a.x, a.z) - hash(b.x, b.z))
  for (let i = 0; i < 18; i++) {
    if (cliffSorted.length === 0) break
    const spot = cliffSorted[(i * 11) % cliffSorted.length]
    const type = oreList[i % oreList.length]
    const r = type === 'coal' ? 1.7 : type === 'iron' ? 1.5 : 1.35
    veins.push({ x: spot.x, y: spot.y, z: spot.z, rSq: r * r, type })
  }

  // 2. Underground ore veins embedded inside stone cliffs and deep ground
  const undergroundCfgs: { type: BlockType; count: number; minH: number; maxH: number; r: number }[] = [
    { type: 'diamond', count: 4, minH: 0, maxH: 2, r: 1.35 },
    { type: 'emerald', count: 3, minH: 2, maxH: 5, r: 1.25 },
    { type: 'gold', count: 6, minH: 0, maxH: 3, r: 1.4 },
    { type: 'redstone', count: 6, minH: 0, maxH: 3, r: 1.45 },
    { type: 'iron', count: 10, minH: 0, maxH: 5, r: 1.6 },
    { type: 'coal', count: 12, minH: 0, maxH: 6, r: 1.8 },
  ]

  for (const cfg of undergroundCfgs) {
    for (let i = 0; i < cfg.count; i++) {
      const vx = Math.round((rand() - 0.5) * 26)
      const vz = Math.round((rand() - 0.5) * 26)
      const h = heights.get(`${vx},${vz}`)
      if (!h || h <= 1) continue
      const vy = Math.min(Math.floor(cfg.minH + rand() * (cfg.maxH - cfg.minH + 1)), Math.max(0, h - 2))
      veins.push({ x: vx, y: vy, z: vz, rSq: cfg.r * cfg.r, type: cfg.type })
    }
  }

  // Populate main island blocks
  for (let x = -half; x <= half; x++) {
    for (let z = -half; z <= half; z++) {
      const h = heights.get(`${x},${z}`)
      if (!h) continue

      const minNeighbor = Math.min(
        heights.get(`${x + 1},${z}`) ?? 0,
        heights.get(`${x - 1},${z}`) ?? 0,
        heights.get(`${x},${z + 1}`) ?? 0,
        heights.get(`${x},${z - 1}`) ?? 0,
      )

      for (let y = 0; y < h; y++) {
        const isTop = y === h - 1
        const isCliffFace = y >= minNeighbor && minNeighbor < h

        let type: BlockType
        if (isTop) {
          type = 'grass'
        } else if (isCliffFace) {
          type = 'stone'
        } else if (y >= h - 3) {
          type = 'dirt'
        } else {
          type = 'stone'
        }

        if (type === 'stone') {
          for (const vein of veins) {
            const dx = x - vein.x
            const dy = y - vein.y
            const dz = z - vein.z
            if (dx * dx + dy * dy + dz * dz <= vein.rSq) {
              type = vein.type
              break
            }
          }
        }
        blocks.push({ x, y, z, type })
      }
    }
  }

  // Trees on flat-ish grass spots, avoiding viewpoints
  const treePositions = new Set<string>()
  const torchKeys = new Set(TORCH_VIEWPOINTS.map((t) => `${t.x},${t.z}`))
  let trees = 0
  for (let x = -half + 3; x <= half - 3 && trees < 7; x += 3) {
    for (let z = -half + 3; z <= half - 3 && trees < 7; z += 3) {
      const key = `${x},${z}`
      if (torchKeys.has(key)) continue
      const h = heights.get(key)
      if (!h || h < 3 || hash(x * 3.7, z * 5.1) < 0.93) continue
      trees++
      treePositions.add(key)
      const trunkTop = h + 3
      for (let y = h; y < trunkTop; y++) blocks.push({ x, y, z, type: 'wood' })
      for (let dx = -1; dx <= 1; dx++) {
        for (let dz = -1; dz <= 1; dz++) {
          for (let dy = 0; dy < 2; dy++) {
            if (dx === 0 && dz === 0 && dy === 0) continue
            blocks.push({ x: dx + x, y: trunkTop - 1 + dy, z: dz + z, type: 'leaves' })
          }
        }
      }
      blocks.push({ x, y: trunkTop + 1, z, type: 'leaves' })
    }
  }

  // Flora blocks scattered on top of grass
  for (let x = -half; x <= half; x++) {
    for (let z = -half; z <= half; z++) {
      const key = `${x},${z}`
      if (treePositions.has(key) || torchKeys.has(key)) continue
      const h = heights.get(key)
      if (!h || h <= 0) continue
      const f = hash(x * 17.3 + 5.1, z * 23.9 + 11.7)
      if (f > 0.86) {
        const floraType: BlockType =
          f > 0.95 ? 'mushroom_red' : f > 0.90 ? 'flower_yellow' : 'flower_red'
        blocks.push({ x, y: h, z, type: floraType })
      }
    }
  }

  // Wooden posts for viewpoints
  for (const p of TORCH_VIEWPOINTS) {
    blocks.push({ x: p.x, y: p.y, z: p.z, type: 'wood' })
    blocks.push({ x: p.x, y: p.y + 1, z: p.z, type: 'wood' })
  }

  // Satellite floating sky island
  const { x: sx, y: sy, z: sz } = SKY_ISLAND
  // Top grassy surface at y = 12
  for (let dx = -2; dx <= 2; dx++) {
    for (let dz = -2; dz <= 2; dz++) {
      const d = Math.hypot(dx, dz)
      if (d <= 2.2) {
        blocks.push({ x: sx + dx, y: sy, z: sz + dz, type: 'grass' })
      }
    }
  }
  // Dirt and stone underlayer at y = 11
  for (let dx = -2; dx <= 2; dx++) {
    for (let dz = -2; dz <= 2; dz++) {
      const d = Math.hypot(dx, dz)
      if (d <= 1.8) {
        blocks.push({ x: sx + dx, y: sy - 1, z: sz + dz, type: d <= 1.0 ? 'stone' : 'dirt' })
      }
    }
  }
  // Underbelly with exposed diamond and emerald gems at y = 10
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      const d = Math.hypot(dx, dz)
      if (d <= 1.3) {
        const type: BlockType =
          dx === 1 && dz === 0 ? 'diamond' : dx === 0 && dz === 1 ? 'emerald' : 'stone'
        blocks.push({ x: sx + dx, y: sy - 2, z: sz + dz, type })
      }
    }
  }
  // Inverted stalactite tip at y = 9 and y = 8
  blocks.push({ x: sx, y: sy - 3, z: sz, type: 'stone' })
  blocks.push({ x: sx, y: sy - 4, z: sz, type: 'stone' })
  // Ancient stone pedestal at y = 13
  blocks.push({ x: sx, y: sy + 1, z: sz, type: 'stone' })
  // Sky island flora
  blocks.push({ x: sx + 1, y: sy + 1, z: sz + 1, type: 'flower_yellow' })
  blocks.push({ x: sx - 1, y: sy + 1, z: sz, type: 'flower_red' })

  return blocks
}

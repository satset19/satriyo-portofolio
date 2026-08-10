export type BlockType = 'grass' | 'dirt' | 'stone' | 'wood' | 'leaves'

export interface Block {
  x: number
  y: number
  z: number
  type: BlockType
}

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

/** Procedural voxel island: radial falloff heightmap + a few trees. */
export function generateTerrain(size = 40): Block[] {
  const blocks: Block[] = []
  const half = size / 2
  const heights = new Map<string, number>()

  for (let x = -half; x <= half; x++) {
    for (let z = -half; z <= half; z++) {
      const dist = Math.hypot(x, z) / half
      const n = noise(x * 0.12 + 7, z * 0.12 + 3) * 0.7 + noise(x * 0.35, z * 0.35) * 0.3
      const h = Math.round(n * 5 + 3 - dist * 6)
      if (h <= 0) continue
      heights.set(`${x},${z}`, h)
      for (let y = 0; y < h; y++) {
        const type: BlockType = y === h - 1 ? 'grass' : y >= h - 3 ? 'dirt' : 'stone'
        blocks.push({ x, y, z, type })
      }
    }
  }

  // Trees on flat-ish grass spots, deterministically scattered
  let trees = 0
  for (let x = -half + 3; x <= half - 3 && trees < 7; x += 3) {
    for (let z = -half + 3; z <= half - 3 && trees < 7; z += 3) {
      const h = heights.get(`${x},${z}`)
      if (!h || h < 3 || hash(x * 3.7, z * 5.1) < 0.93) continue
      trees++
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

  return blocks
}

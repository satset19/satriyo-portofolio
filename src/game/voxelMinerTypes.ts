export type GameMode = 'rush' | 'survival'

export type BlockType =
  | 'empty'
  | 'dirt'
  | 'stone'
  | 'coal'
  | 'iron'
  | 'gold'
  | 'redstone'
  | 'diamond'
  | 'emerald'
  | 'tnt'
  | 'gravel'
  | 'dynamite_item'
  | 'boost_item'
  | 'heart_item'

export interface Block {
  type: BlockType
  maxHits: number
  hitsLeft: number
}

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  life: number
  maxLife: number
}

export interface FloatingText {
  id: number
  text: string
  x: number
  y: number
  color: string
  alpha: number
  vy: number
}

export interface Player {
  x: number // cell col
  y: number // cell row
  facing: 'left' | 'right' | 'down'
  digAnim: number // 0 to 1 for swinging pickaxe
  health: number
  maxHealth: number
  dynamiteCount: number
  boostTimer: number // seconds remaining of insta-mine pickaxe
}

export interface ActiveDynamite {
  x: number // pixel x
  y: number // pixel y
  col: number
  row: number
  timer: number // countdown seconds
}

export const ORE_VALUES: Record<
  string,
  { name: string; points: number; timeBonus: number; hits: number; color: string; speckColor: string }
> = {
  dirt: { name: 'Dirt', points: 5, timeBonus: 0, hits: 1, color: '#866043', speckColor: '#5c3d28' },
  stone: { name: 'Stone', points: 10, timeBonus: 0, hits: 2, color: '#7a7a7d', speckColor: '#58585b' },
  coal: { name: 'Coal', points: 25, timeBonus: 1, hits: 1, color: '#707073', speckColor: '#1c1c1e' },
  iron: { name: 'Iron', points: 50, timeBonus: 1.5, hits: 2, color: '#727278', speckColor: '#d6a076' },
  gold: { name: 'Gold', points: 100, timeBonus: 2, hits: 2, color: '#6e6e73', speckColor: '#ffd700' },
  redstone: { name: 'Redstone', points: 150, timeBonus: 2.5, hits: 2, color: '#68686e', speckColor: '#ff2b2b' },
  diamond: { name: 'Diamond', points: 300, timeBonus: 3.5, hits: 3, color: '#566069', speckColor: '#4dedf4' },
  emerald: { name: 'Emerald', points: 500, timeBonus: 5, hits: 3, color: '#4d5c52', speckColor: '#2ecc71' },
  gravel: { name: 'Gravel', points: 10, timeBonus: 0, hits: 1, color: '#95a5a6', speckColor: '#7f8c8d' },
}

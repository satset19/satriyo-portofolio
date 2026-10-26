import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Trophy,
  Heart,
  Timer,
  Bomb,
  Zap,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
} from 'lucide-react'
import {
  playBreak,
  playGem,
  playExplosion,
  playPowerup,
  playGameOver,
  playHighScore,
  playClick,
  useMuted,
  toggleMute,
} from './useSound'
import type {
  GameMode,
  Block,
  Particle,
  FloatingText,
  Player,
  ActiveDynamite,
} from './voxelMinerTypes'
import { ORE_VALUES } from './voxelMinerTypes'

// Grid & Dimension constants
const COLS = 10
const CELL_SIZE = 36 // logical px per cell
const CANVAS_WIDTH = COLS * CELL_SIZE // 360
const CANVAS_HEIGHT = 504 // 14 rows visible (14 * 36)

interface VoxelMinerGameProps {
  onStatsUpdate?: (stats: { highScore: number; totalMined: number; bestCombo: number }) => void
}

export function VoxelMinerGame({ onStatsUpdate }: VoxelMinerGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const muted = useMuted()

  // High score
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('voxel_miner_highscore') ?? 0)
    } catch {
      return 0
    }
  })

  // Game UI state
  const [gameMode, setGameMode] = useState<GameMode>('rush')
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover'>('idle')
  const [score, setScore] = useState<number>(0)
  const [depth, setDepth] = useState<number>(0)
  const [combo, setCombo] = useState<number>(1)
  const [timeLeft, setTimeLeft] = useState<number>(60)
  const [playerHealth, setPlayerHealth] = useState<number>(3)
  const [dynamites, setDynamites] = useState<number>(1)
  const [boostActive, setBoostActive] = useState<boolean>(false)
  const [isNewHigh, setIsNewHigh] = useState<boolean>(false)

  // Internal mutable game loop state
  const gameRef = useRef<{
    grid: Block[][]
    player: Player
    cameraY: number
    particles: Particle[]
    floatingTexts: FloatingText[]
    activeDynamites: ActiveDynamite[]
    screenShake: number
    score: number
    depth: number
    combo: number
    comboTimer: number
    timeLeft: number
    state: 'idle' | 'playing' | 'paused' | 'gameover'
    mode: GameMode
    totalMined: number
    bestCombo: number
    lastTime: number
    textCounter: number
  }>({
    grid: [],
    player: {
      x: 4,
      y: 0,
      facing: 'right',
      digAnim: 0,
      health: 3,
      maxHealth: 3,
      dynamiteCount: 1,
      boostTimer: 0,
    },
    cameraY: 0,
    particles: [],
    floatingTexts: [],
    activeDynamites: [],
    screenShake: 0,
    score: 0,
    depth: 0,
    combo: 1,
    comboTimer: 0,
    timeLeft: 60,
    state: 'idle',
    mode: 'rush',
    totalMined: 0,
    bestCombo: 0,
    lastTime: 0,
    textCounter: 0,
  })

  // Procedural block generator
  const generateRow = useCallback((r: number): Block[] => {
    const row: Block[] = []
    for (let c = 0; c < COLS; c++) {
      if (r === 0) {
        if (c >= 3 && c <= 5) {
          row.push({ type: 'empty', maxHits: 0, hitsLeft: 0 })
        } else {
          row.push({ type: 'dirt', maxHits: 1, hitsLeft: 1 })
        }
        continue
      }

      const rand = Math.random()

      if (rand < 0.025) {
        row.push({ type: 'dynamite_item', maxHits: 1, hitsLeft: 1 })
        continue
      }
      if (rand < 0.045) {
        row.push({ type: 'boost_item', maxHits: 1, hitsLeft: 1 })
        continue
      }
      if (rand < 0.065) {
        row.push({ type: 'heart_item', maxHits: 1, hitsLeft: 1 })
        continue
      }

      const tntChance = Math.min(0.14, 0.03 + r * 0.0015)
      if (rand < 0.065 + tntChance) {
        row.push({ type: 'tnt', maxHits: 1, hitsLeft: 1 })
        continue
      }
      if (rand < 0.065 + tntChance + 0.07) {
        row.push({ type: 'gravel', maxHits: 1, hitsLeft: 1 })
        continue
      }

      if (r > 35 && Math.random() < 0.07) {
        row.push({ type: 'emerald', maxHits: 3, hitsLeft: 3 })
      } else if (r > 25 && Math.random() < 0.1) {
        row.push({ type: 'diamond', maxHits: 3, hitsLeft: 3 })
      } else if (r > 15 && Math.random() < 0.12) {
        row.push({ type: 'redstone', maxHits: 2, hitsLeft: 2 })
      } else if (r > 10 && Math.random() < 0.14) {
        row.push({ type: 'gold', maxHits: 2, hitsLeft: 2 })
      } else if (r > 4 && Math.random() < 0.18) {
        row.push({ type: 'iron', maxHits: 2, hitsLeft: 2 })
      } else if (r > 2 && Math.random() < 0.22) {
        row.push({ type: 'coal', maxHits: 1, hitsLeft: 1 })
      } else if (r > 1 && Math.random() < 0.6) {
        row.push({ type: 'stone', maxHits: 2, hitsLeft: 2 })
      } else {
        row.push({ type: 'dirt', maxHits: 1, hitsLeft: 1 })
      }
    }
    return row
  }, [])

  const ensureRows = useCallback(
    (targetRow: number) => {
      const g = gameRef.current
      while (g.grid.length <= targetRow + 15) {
        const nextRowIdx = g.grid.length
        g.grid.push(generateRow(nextRowIdx))
      }
    },
    [generateRow],
  )

  const addFloatingText = (text: string, x: number, y: number, color = '#ffd700') => {
    const g = gameRef.current
    g.floatingTexts.push({
      id: ++g.textCounter,
      text,
      x,
      y,
      color,
      alpha: 1,
      vy: -1.2,
    })
  }

  const addDebris = (cellX: number, cellY: number, color: string, count = 8) => {
    const g = gameRef.current
    const cx = (cellX + 0.5) * CELL_SIZE
    const cy = (cellY + 0.5) * CELL_SIZE
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 1.5 + Math.random() * 3.5
      g.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: Math.random() * 4 + 2,
        color,
        alpha: 1,
        life: 0,
        maxLife: 20 + Math.random() * 15,
      })
    }
  }

  // Handle game over logic
  const handleGameOver = useCallback(() => {
    const g = gameRef.current
    if (g.state === 'gameover') return
    g.state = 'gameover'
    setGameState('gameover')
    playGameOver()

    let newHigh = false
    const currentHigh = Number(localStorage.getItem('voxel_miner_highscore') ?? 0)
    let finalHigh = currentHigh
    if (g.score > currentHigh) {
      localStorage.setItem('voxel_miner_highscore', String(g.score))
      setHighScore(g.score)
      finalHigh = g.score
      newHigh = true
      setIsNewHigh(true)
      setTimeout(() => playHighScore(), 400)
    }

    let finalTotal = 0
    let finalBestCombo = 0
    try {
      const prevTotal = Number(localStorage.getItem('voxel_miner_total_mined') ?? 0)
      finalTotal = prevTotal + g.totalMined
      localStorage.setItem('voxel_miner_total_mined', String(finalTotal))

      const prevBestCombo = Number(localStorage.getItem('voxel_miner_best_combo') ?? 0)
      finalBestCombo = Math.max(prevBestCombo, g.bestCombo)
      localStorage.setItem('voxel_miner_best_combo', String(finalBestCombo))

      if (onStatsUpdate) {
        onStatsUpdate({
          highScore: finalHigh,
          totalMined: finalTotal,
          bestCombo: finalBestCombo,
        })
      }
    } catch {
      // storage errors ignored
    }

    if (!newHigh && onStatsUpdate) {
      onStatsUpdate({
        highScore: finalHigh,
        totalMined: finalTotal,
        bestCombo: finalBestCombo,
      })
    }
  }, [onStatsUpdate])

  // TNT explosion
  const triggerExplosion = useCallback(
    (col: number, row: number) => {
      const g = gameRef.current
      playExplosion()
      g.screenShake = 14

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const targetR = row + dr
          const targetC = col + dc
          if (targetR < 0 || targetC < 0 || targetC >= COLS) continue
          if (!g.grid[targetR]) continue

          const b = g.grid[targetR][targetC]
          if (b.type !== 'empty') {
            if (b.type === 'tnt' && !(dr === 0 && dc === 0)) {
              b.type = 'empty'
              setTimeout(() => triggerExplosion(targetC, targetR), 100)
            } else {
              if (ORE_VALUES[b.type]) {
                const pts = ORE_VALUES[b.type].points
                g.score += pts
                addFloatingText(`+${pts}`, (targetC + 0.5) * CELL_SIZE, (targetR + 0.5) * CELL_SIZE)
              }
              addDebris(targetC, targetR, '#ff4757', 6)
              b.type = 'empty'
              b.hitsLeft = 0
            }
          }
        }
      }

      // Damage player if in range
      const pDist = Math.hypot(g.player.x - col, g.player.y - row)
      if (pDist <= 1.5) {
        if (g.mode === 'rush') {
          g.timeLeft = Math.max(0, g.timeLeft - 10)
          setTimeLeft(Math.floor(g.timeLeft))
          addFloatingText('-10s!', (g.player.x + 0.5) * CELL_SIZE, (g.player.y + 0.5) * CELL_SIZE, '#ff3838')
        } else {
          g.player.health -= 1
          setPlayerHealth(g.player.health)
          addFloatingText('-1 HP!', (g.player.x + 0.5) * CELL_SIZE, (g.player.y + 0.5) * CELL_SIZE, '#ff3838')
          if (g.player.health <= 0) {
            handleGameOver()
          }
        }
      }
    },
    [handleGameOver],
  )

  const startGame = useCallback(
    (mode: GameMode = gameMode) => {
      playClick()
      const g = gameRef.current
      g.mode = mode
      g.state = 'playing'
      g.grid = []
      g.player = {
        x: 4,
        y: 0,
        facing: 'right',
        digAnim: 0,
        health: 3,
        maxHealth: 3,
        dynamiteCount: 1,
        boostTimer: 0,
      }
      g.cameraY = 0
      g.particles = []
      g.floatingTexts = []
      g.activeDynamites = []
      g.screenShake = 0
      g.score = 0
      g.depth = 0
      g.combo = 1
      g.comboTimer = 0
      g.timeLeft = mode === 'rush' ? 60 : 999
      g.totalMined = 0
      g.bestCombo = 1
      g.lastTime = performance.now()

      ensureRows(20)

      setGameMode(mode)
      setGameState('playing')
      setScore(0)
      setDepth(0)
      setCombo(1)
      setTimeLeft(mode === 'rush' ? 60 : 999)
      setPlayerHealth(3)
      setDynamites(1)
      setBoostActive(false)
      setIsNewHigh(false)
    },
    [ensureRows, gameMode],
  )

  const deployDynamite = useCallback(() => {
    const g = gameRef.current
    if (g.state !== 'playing' || g.player.dynamiteCount <= 0) return
    playClick()
    g.player.dynamiteCount--
    setDynamites(g.player.dynamiteCount)

    const dropCol = g.player.x
    const dropRow = g.player.y + 1

    g.activeDynamites.push({
      x: (dropCol + 0.5) * CELL_SIZE,
      y: (dropRow + 0.5) * CELL_SIZE,
      col: dropCol,
      row: dropRow,
      timer: 1.0,
    })
    addFloatingText('🧨 FUSE LIT!', (dropCol + 0.5) * CELL_SIZE, (dropRow + 0.5) * CELL_SIZE, '#ff7979')
  }, [])

  const tryAction = useCallback(
    (dx: number, dy: number) => {
      const g = gameRef.current
      if (g.state !== 'playing') return

      const p = g.player
      if (dx < 0) p.facing = 'left'
      if (dx > 0) p.facing = 'right'
      if (dy > 0 && dx === 0) p.facing = 'down'

      const targetX = p.x + dx
      const targetY = p.y + dy

      if (targetX < 0 || targetX >= COLS || targetY < 0) return

      ensureRows(targetY + 10)
      const targetBlock = g.grid[targetY]?.[targetX]
      if (!targetBlock) return

      p.digAnim = 1.0

      if (targetBlock.type === 'empty') {
        p.x = targetX
        p.y = targetY
        if (p.y > g.depth) {
          g.depth = p.y
          setDepth(p.y)
        }
        return
      }

      if (targetBlock.type === 'dynamite_item') {
        playPowerup()
        p.dynamiteCount++
        setDynamites(p.dynamiteCount)
        addFloatingText('+1 DYNAMITE!', (targetX + 0.5) * CELL_SIZE, (targetY + 0.5) * CELL_SIZE, '#ff5252')
        targetBlock.type = 'empty'
        p.x = targetX
        p.y = targetY
        return
      }

      if (targetBlock.type === 'boost_item') {
        playPowerup()
        p.boostTimer = 8.0
        setBoostActive(true)
        addFloatingText('⚡ SPEED MINER 8s!', (targetX + 0.5) * CELL_SIZE, (targetY + 0.5) * CELL_SIZE, '#ffd700')
        targetBlock.type = 'empty'
        p.x = targetX
        p.y = targetY
        return
      }

      if (targetBlock.type === 'heart_item') {
        playPowerup()
        if (g.mode === 'rush') {
          g.timeLeft += 10
          setTimeLeft(Math.floor(g.timeLeft))
          addFloatingText('+10 SECONDS!', (targetX + 0.5) * CELL_SIZE, (targetY + 0.5) * CELL_SIZE, '#2ecc71')
        } else {
          p.health = Math.min(p.maxHealth, p.health + 1)
          setPlayerHealth(p.health)
          addFloatingText('+1 HEART!', (targetX + 0.5) * CELL_SIZE, (targetY + 0.5) * CELL_SIZE, '#ff4757')
        }
        targetBlock.type = 'empty'
        p.x = targetX
        p.y = targetY
        return
      }

      if (targetBlock.type === 'tnt') {
        targetBlock.type = 'empty'
        triggerExplosion(targetX, targetY)
        return
      }

      const isBoosted = p.boostTimer > 0
      const hitPower = isBoosted ? 99 : 1
      targetBlock.hitsLeft -= hitPower
      playBreak()
      g.screenShake = 3

      const ore = ORE_VALUES[targetBlock.type]
      addDebris(targetX, targetY, ore?.speckColor ?? '#8b8b8b', 6)

      if (targetBlock.hitsLeft <= 0) {
        g.totalMined++
        targetBlock.type = 'empty'

        if (ore) {
          playGem()
          if (g.comboTimer > 0) {
            g.combo = Math.min(5, g.combo + 1)
          } else {
            g.combo = 1
          }
          g.comboTimer = 2.0
          if (g.combo > g.bestCombo) {
            g.bestCombo = g.combo
          }

          const pts = ore.points * g.combo
          g.score += pts
          setScore(g.score)
          setCombo(g.combo)

          if (g.mode === 'rush' && ore.timeBonus > 0) {
            g.timeLeft += ore.timeBonus
            setTimeLeft(Math.floor(g.timeLeft))
          }

          const comboBadge = g.combo > 1 ? ` x${g.combo}!` : ''
          addFloatingText(`+${pts}${comboBadge}`, (targetX + 0.5) * CELL_SIZE, (targetY + 0.5) * CELL_SIZE, ore.speckColor)
        }

        p.x = targetX
        p.y = targetY
        if (p.y > g.depth) {
          g.depth = p.y
          setDepth(p.y)
        }
      }
    },
    [ensureRows, triggerExplosion],
  )

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const g = gameRef.current
      if (g.state !== 'playing') {
        if (e.code === 'Space' || e.code === 'Enter') {
          if (g.state === 'idle' || g.state === 'gameover') {
            startGame()
          }
        }
        return
      }

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          e.preventDefault()
          tryAction(-1, 0)
          break
        case 'ArrowRight':
        case 'KeyD':
          e.preventDefault()
          tryAction(1, 0)
          break
        case 'ArrowDown':
        case 'KeyS':
          e.preventDefault()
          tryAction(0, 1)
          break
        case 'ArrowUp':
        case 'KeyW':
          e.preventDefault()
          tryAction(0, -1)
          break
        case 'Space':
        case 'KeyE':
          e.preventDefault()
          deployDynamite()
          break
        case 'KeyP':
        case 'Escape':
          e.preventDefault()
          setGameState((s) => {
            const next = s === 'paused' ? 'playing' : 'paused'
            g.state = next
            return next
          })
          break
        case 'KeyR':
          e.preventDefault()
          startGame()
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [deployDynamite, startGame, tryAction])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const g = gameRef.current
    if (!canvas) return

    if (g.state !== 'playing') {
      startGame()
      return
    }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const clickX = (e.clientX - rect.left) * scaleX
    const clickY = (e.clientY - rect.top) * scaleY + g.cameraY

    const col = Math.floor(clickX / CELL_SIZE)
    const row = Math.floor(clickY / CELL_SIZE)

    const dx = col - g.player.x
    const dy = row - g.player.y

    if (Math.abs(dx) + Math.abs(dy) === 1) {
      tryAction(dx, dy)
    } else if (Math.abs(dx) > Math.abs(dy)) {
      tryAction(Math.sign(dx), 0)
    } else if (dy !== 0) {
      tryAction(0, Math.sign(dy))
    }
  }

  // Animation and physics frame loop
  useEffect(() => {
    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const render = (time: number) => {
      const g = gameRef.current
      const dt = Math.min(0.05, (time - (g.lastTime || time)) / 1000)
      g.lastTime = time

      if (g.state === 'playing') {
        if (g.mode === 'rush') {
          g.timeLeft = Math.max(0, g.timeLeft - dt)
          setTimeLeft(Math.ceil(g.timeLeft))
          if (g.timeLeft <= 0) {
            handleGameOver()
          }
        }

        if (g.comboTimer > 0) {
          g.comboTimer = Math.max(0, g.comboTimer - dt)
          if (g.comboTimer <= 0) {
            g.combo = 1
            setCombo(1)
          }
        }

        if (g.player.boostTimer > 0) {
          g.player.boostTimer = Math.max(0, g.player.boostTimer - dt)
          if (g.player.boostTimer <= 0) {
            setBoostActive(false)
          }
        }

        if (g.player.digAnim > 0) {
          g.player.digAnim = Math.max(0, g.player.digAnim - dt * 6)
        }

        ensureRows(g.player.y + 4)
        const cellBelow = g.grid[g.player.y + 1]?.[g.player.x]
        if (cellBelow && cellBelow.type === 'empty') {
          if (!g.player.digAnim) {
            g.player.y += 1
            if (g.player.y > g.depth) {
              g.depth = g.player.y
              setDepth(g.player.y)
            }
          }
        }

        // Gravel physics
        for (let r = g.grid.length - 2; r >= 0; r--) {
          for (let c = 0; c < COLS; c++) {
            const b = g.grid[r][c]
            if (b.type === 'gravel') {
              const below = g.grid[r + 1]?.[c]
              if (below && below.type === 'empty') {
                if (g.player.x === c && g.player.y === r + 1) {
                  g.player.health -= 1
                  setPlayerHealth(g.player.health)
                  playBreak()
                  addFloatingText('CRUSHED -1 HP!', (c + 0.5) * CELL_SIZE, (r + 1.5) * CELL_SIZE, '#ff3838')
                  if (g.player.health <= 0) {
                    handleGameOver()
                  }
                }
                below.type = 'gravel'
                below.hitsLeft = 1
                b.type = 'empty'
                b.hitsLeft = 0
              }
            }
          }
        }

        // Active dynamites
        for (let i = g.activeDynamites.length - 1; i >= 0; i--) {
          const d = g.activeDynamites[i]
          d.timer -= dt
          if (d.timer <= 0) {
            triggerExplosion(d.col, d.row)
            g.activeDynamites.splice(i, 1)
          }
        }

        const targetCamY = Math.max(0, g.player.y * CELL_SIZE - CANVAS_HEIGHT * 0.35)
        g.cameraY += (targetCamY - g.cameraY) * 0.12

        if (g.screenShake > 0) {
          g.screenShake = Math.max(0, g.screenShake - dt * 25)
        }
      }

      // Particles
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const p = g.particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.2
        p.alpha = Math.max(0, 1 - p.life / p.maxLife)
        if (p.life >= p.maxLife) {
          g.particles.splice(i, 1)
        }
      }

      // Floating texts
      for (let i = g.floatingTexts.length - 1; i >= 0; i--) {
        const ft = g.floatingTexts[i]
        ft.y += ft.vy
        ft.alpha -= dt * 0.8
        if (ft.alpha <= 0) {
          g.floatingTexts.splice(i, 1)
        }
      }

      // Render canvas
      ctx.save()

      if (g.screenShake > 0) {
        const sx = (Math.random() - 0.5) * g.screenShake * 2
        const sy = (Math.random() - 0.5) * g.screenShake * 2
        ctx.translate(sx, sy)
      }

      ctx.fillStyle = '#0f1423'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      ctx.save()
      ctx.translate(0, -g.cameraY)

      const startRow = Math.max(0, Math.floor(g.cameraY / CELL_SIZE))
      const endRow = Math.min(g.grid.length - 1, Math.ceil((g.cameraY + CANVAS_HEIGHT) / CELL_SIZE))

      for (let r = startRow; r <= endRow; r++) {
        for (let c = 0; c < COLS; c++) {
          const block = g.grid[r]?.[c]
          if (!block || block.type === 'empty') continue

          const bx = c * CELL_SIZE
          const by = r * CELL_SIZE

          ctx.lineWidth = 1

          if (block.type === 'dirt') {
            ctx.fillStyle = r === 0 ? '#438a2c' : '#79553a'
            ctx.fillRect(bx, by, CELL_SIZE, CELL_SIZE)
            ctx.fillStyle = '#9c6a46'
            ctx.fillRect(bx + 1, by + 1, CELL_SIZE - 2, 3)
            ctx.fillStyle = '#533924'
            ctx.fillRect(bx + 1, by + CELL_SIZE - 4, CELL_SIZE - 2, 3)
            ctx.fillStyle = '#3a2618'
            ctx.fillRect(bx + 8, by + 12, 4, 4)
            ctx.fillRect(bx + 20, by + 22, 5, 4)
          } else if (block.type === 'stone') {
            ctx.fillStyle = r > 30 ? '#42454f' : '#7a7a80'
            ctx.fillRect(bx, by, CELL_SIZE, CELL_SIZE)
            ctx.fillStyle = '#95959e'
            ctx.fillRect(bx + 1, by + 1, CELL_SIZE - 2, 3)
            ctx.fillStyle = '#505055'
            ctx.fillRect(bx + 1, by + CELL_SIZE - 4, CELL_SIZE - 2, 3)
            ctx.fillStyle = '#3c3c40'
            ctx.fillRect(bx + 10, by + 14, 5, 5)
            ctx.fillRect(bx + 22, by + 8, 4, 4)
          } else if (block.type === 'gravel') {
            ctx.fillStyle = '#838e96'
            ctx.fillRect(bx, by, CELL_SIZE, CELL_SIZE)
            ctx.fillStyle = '#5d676e'
            ctx.fillRect(bx + 6, by + 6, 7, 7)
            ctx.fillRect(bx + 20, by + 18, 6, 6)
            ctx.fillStyle = '#a6b4bd'
            ctx.fillRect(bx + 18, by + 8, 5, 5)
          } else if (block.type === 'tnt') {
            ctx.fillStyle = '#c0392b'
            ctx.fillRect(bx, by, CELL_SIZE, CELL_SIZE)
            ctx.fillStyle = '#ecf0f1'
            ctx.fillRect(bx, by + 11, CELL_SIZE, 14)
            ctx.fillStyle = '#111'
            ctx.font = 'bold 9px monospace'
            ctx.textAlign = 'center'
            ctx.fillText('TNT', bx + CELL_SIZE / 2, by + 22)
            ctx.fillStyle = '#f39c12'
            ctx.fillRect(bx + CELL_SIZE / 2 - 1, by + 2, 2, 4)
          } else if (block.type === 'dynamite_item') {
            ctx.fillStyle = '#1a2238'
            ctx.fillRect(bx, by, CELL_SIZE, CELL_SIZE)
            ctx.fillStyle = '#e74c3c'
            ctx.fillRect(bx + 14, by + 8, 8, 20)
            ctx.fillStyle = '#fff'
            ctx.fillRect(bx + 14, by + 16, 8, 4)
            ctx.fillStyle = '#f1c40f'
            ctx.fillRect(bx + 17, by + 4, 2, 4)
          } else if (block.type === 'boost_item') {
            ctx.fillStyle = '#1a2238'
            ctx.fillRect(bx, by, CELL_SIZE, CELL_SIZE)
            ctx.fillStyle = '#ffd700'
            ctx.fillRect(bx + 10, by + 8, 16, 5)
            ctx.fillStyle = '#b7791f'
            ctx.fillRect(bx + 16, by + 12, 4, 16)
          } else if (block.type === 'heart_item') {
            ctx.fillStyle = '#1a2238'
            ctx.fillRect(bx, by, CELL_SIZE, CELL_SIZE)
            ctx.fillStyle = '#ff4757'
            ctx.beginPath()
            ctx.arc(bx + 13, by + 14, 5, 0, Math.PI * 2)
            ctx.arc(bx + 23, by + 14, 5, 0, Math.PI * 2)
            ctx.fill()
            ctx.beginPath()
            ctx.moveTo(bx + 8, by + 15)
            ctx.lineTo(bx + 18, by + 27)
            ctx.lineTo(bx + 28, by + 15)
            ctx.fill()
          } else {
            const ore = ORE_VALUES[block.type]
            ctx.fillStyle = r > 30 ? '#383b42' : ore?.color ?? '#707073'
            ctx.fillRect(bx, by, CELL_SIZE, CELL_SIZE)

            const sc = ore?.speckColor ?? '#ffd700'
            ctx.fillStyle = sc

            if (block.type === 'diamond' || block.type === 'emerald' || block.type === 'gold') {
              const shine = (Math.sin(time * 0.005 + r + c) + 1) * 0.5
              ctx.shadowColor = sc
              ctx.shadowBlur = shine * 8
            }

            ctx.fillRect(bx + 6, by + 7, 7, 7)
            ctx.fillRect(bx + 21, by + 10, 6, 6)
            ctx.fillRect(bx + 11, by + 21, 8, 7)
            ctx.fillRect(bx + 23, by + 24, 5, 5)
            ctx.shadowBlur = 0
          }

          if (block.hitsLeft < block.maxHits) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.65)'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(bx + 6, by + 6)
            ctx.lineTo(bx + 18, by + 18)
            ctx.lineTo(bx + 12, by + 28)
            ctx.stroke()
          }

          ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)'
          ctx.strokeRect(bx, by, CELL_SIZE, CELL_SIZE)
        }
      }

      // Draw Active Dynamites
      for (const d of g.activeDynamites) {
        ctx.fillStyle = '#ff3838'
        ctx.fillRect(d.x - 6, d.y - 12, 12, 24)
        ctx.fillStyle = '#fff'
        ctx.fillRect(d.x - 6, d.y - 3, 12, 6)
        ctx.fillStyle = '#ffd32a'
        ctx.beginPath()
        ctx.arc(d.x, d.y - 14, 3 + Math.random() * 2, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw Particles
      for (const p of g.particles) {
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
      }
      ctx.globalAlpha = 1.0

      // Draw Player Miner
      const px = g.player.x * CELL_SIZE
      const py = g.player.y * CELL_SIZE

      // Headlamp cone
      const gradient = ctx.createRadialGradient(
        px + CELL_SIZE / 2,
        py + 12,
        4,
        px + CELL_SIZE / 2,
        py + CELL_SIZE + 24,
        CELL_SIZE * 1.8,
      )
      gradient.addColorStop(0, 'rgba(255, 240, 160, 0.28)')
      gradient.addColorStop(1, 'rgba(255, 240, 160, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(px + CELL_SIZE / 2, py + CELL_SIZE, CELL_SIZE * 1.8, 0, Math.PI * 2)
      ctx.fill()

      if (g.player.boostTimer > 0) {
        ctx.strokeStyle = '#ffd700'
        ctx.lineWidth = 2
        ctx.strokeRect(px + 4, py + 4, CELL_SIZE - 8, CELL_SIZE - 6)
      }

      // Boots
      ctx.fillStyle = '#2c3e50'
      ctx.fillRect(px + 9, py + 26, 6, 8)
      ctx.fillRect(px + 21, py + 26, 6, 8)
      ctx.fillStyle = '#1e272e'
      ctx.fillRect(px + 8, py + 31, 8, 4)
      ctx.fillRect(px + 20, py + 31, 8, 4)

      // Overalls
      ctx.fillStyle = '#2980b9'
      ctx.fillRect(px + 9, py + 16, 18, 11)
      ctx.fillStyle = '#d35400'
      ctx.fillRect(px + 6, py + 16, 4, 9)
      ctx.fillRect(px + 26, py + 16, 4, 9)

      // Face & Eyes
      ctx.fillStyle = '#f5cd79'
      ctx.fillRect(px + 10, py + 7, 16, 10)
      ctx.fillStyle = '#2d3436'
      if (g.player.facing === 'left') {
        ctx.fillRect(px + 11, py + 10, 3, 3)
      } else if (g.player.facing === 'right') {
        ctx.fillRect(px + 22, py + 10, 3, 3)
      } else {
        ctx.fillRect(px + 13, py + 10, 3, 3)
        ctx.fillRect(px + 20, py + 10, 3, 3)
      }

      // Helmet
      ctx.fillStyle = '#f1c40f'
      ctx.fillRect(px + 8, py + 2, 20, 6)
      ctx.fillRect(px + 6, py + 6, 24, 3)
      ctx.fillStyle = '#00d2d3'
      ctx.fillRect(px + (g.player.facing === 'left' ? 7 : g.player.facing === 'right' ? 22 : 16), py + 3, 4, 4)

      // Pickaxe swing
      ctx.save()
      const pickX = px + (g.player.facing === 'left' ? 4 : 30)
      const pickY = py + 20
      ctx.translate(pickX, pickY)
      if (g.player.facing === 'left') ctx.scale(-1, 1)

      const swingAngle = g.player.digAnim * 1.2
      ctx.rotate(0.3 + swingAngle)

      ctx.fillStyle = '#8a5a2b'
      ctx.fillRect(-2, -18, 4, 22)
      ctx.fillStyle = g.player.boostTimer > 0 ? '#ffd700' : '#bdc3c7'
      ctx.fillRect(-8, -22, 16, 5)
      ctx.fillRect(-10, -20, 4, 3)
      ctx.fillRect(6, -20, 4, 3)
      ctx.restore()

      // Floating Texts
      ctx.font = 'bold 11px monospace'
      ctx.textAlign = 'center'
      for (const ft of g.floatingTexts) {
        ctx.fillStyle = ft.color
        ctx.globalAlpha = Math.max(0, ft.alpha)
        ctx.shadowColor = '#000'
        ctx.shadowBlur = 4
        ctx.fillText(ft.text, ft.x, ft.y)
      }
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1.0

      ctx.restore()

      // Overlay Screens
      if (g.state === 'idle') {
        ctx.fillStyle = 'rgba(11, 14, 26, 0.78)'
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        ctx.fillStyle = '#ffd700'
        ctx.font = '12px "Press Start 2P", monospace'
        ctx.textAlign = 'center'
        ctx.fillText('VOXEL MINER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 36)
        ctx.fillStyle = '#80ff20'
        ctx.fillText('ORE RUSH', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 14)

        ctx.fillStyle = '#ffffff'
        ctx.font = '16px "VT323", monospace'
        ctx.fillText('PRESS SPACE OR CLICK TO START', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30)
      } else if (g.state === 'paused') {
        ctx.fillStyle = 'rgba(11, 14, 26, 0.78)'
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        ctx.fillStyle = '#ffd700'
        ctx.font = '16px "Press Start 2P", monospace'
        ctx.textAlign = 'center'
        ctx.fillText('GAME PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
      } else if (g.state === 'gameover') {
        ctx.fillStyle = 'rgba(11, 14, 26, 0.88)'
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        ctx.fillStyle = '#ff4757'
        ctx.font = '14px "Press Start 2P", monospace'
        ctx.textAlign = 'center'
        ctx.fillText('RUN COMPLETE!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 45)

        ctx.fillStyle = '#ffffff'
        ctx.font = '22px "VT323", monospace'
        ctx.fillText(`SCORE: ${g.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 15)
        ctx.fillText(`DEPTH REACHED: ${g.depth}m`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10)

        if (g.score >= highScore && g.score > 0) {
          ctx.fillStyle = '#f1c40f'
          ctx.font = '10px "Press Start 2P", monospace'
          ctx.fillText('★ NEW HIGH SCORE! ★', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40)
        }

        ctx.fillStyle = '#80ff20'
        ctx.font = '18px "VT323", monospace'
        ctx.fillText('TAP OR PRESS SPACE TO RETRY', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 75)
      }

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [ensureRows, handleGameOver, highScore, triggerExplosion])

  return (
    <div className="flex flex-col items-center">
      {/* Top Arcade HUD & Mode Bar */}
      <div className="mc-panel mb-3 flex w-full max-w-[440px] flex-wrap items-center justify-between gap-2 p-2.5 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setGameMode('rush')
              if (gameState !== 'playing') startGame('rush')
            }}
            className={`mc-btn px-2.5 py-1 text-[8px] sm:text-[9px] ${gameMode === 'rush' ? 'mc-btn-green' : ''}`}
          >
            Rush (60s)
          </button>
          <button
            type="button"
            onClick={() => {
              setGameMode('survival')
              if (gameState !== 'playing') startGame('survival')
            }}
            className={`mc-btn px-2.5 py-1 text-[8px] sm:text-[9px] ${gameMode === 'survival' ? 'mc-btn-green' : ''}`}
          >
            Survival
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className="mc-btn p-1.5 text-slate-300"
            aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {gameState === 'playing' || gameState === 'paused' ? (
            <button
              type="button"
              onClick={() => {
                const next = gameState === 'paused' ? 'playing' : 'paused'
                gameRef.current.state = next
                setGameState(next)
              }}
              className="mc-btn px-2 py-1 text-[8px]"
            >
              {gameState === 'paused' ? 'Resume' : 'Pause'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => startGame()}
              className="mc-btn mc-btn-green inline-flex items-center gap-1 px-2.5 py-1 text-[8px]"
            >
              <Play size={10} /> Start
            </button>
          )}

          <button
            type="button"
            onClick={() => startGame()}
            className="mc-btn p-1.5 text-slate-300"
            title="Restart run (R)"
            aria-label="Restart run"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Realtime Stats Bar */}
      <div className="grid w-full max-w-[440px] grid-cols-4 gap-1.5 mb-2.5 text-center">
        <div className="mc-slot p-1.5">
          <p className="pixel-text text-[7px] text-slate-400">SCORE</p>
          <p className="pixel-text text-[11px] text-gold">{score}</p>
        </div>
        <div className="mc-slot p-1.5">
          <p className="pixel-text text-[7px] text-slate-400">DEPTH</p>
          <p className="pixel-text text-[11px] text-xp">{depth}m</p>
        </div>
        <div className="mc-slot p-1.5">
          <p className="pixel-text text-[7px] text-slate-400">
            {gameMode === 'rush' ? 'TIME' : 'HEARTS'}
          </p>
          <p className="pixel-text text-[11px] text-accent flex items-center justify-center gap-0.5">
            {gameMode === 'rush' ? (
              <>
                <Timer size={12} className="inline" /> {timeLeft}s
              </>
            ) : (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Heart
                    key={i}
                    size={11}
                    className={i < playerHealth ? 'fill-red-500 text-red-500' : 'text-slate-600'}
                  />
                ))}
              </>
            )}
          </p>
        </div>
        <div className="mc-slot p-1.5">
          <p className="pixel-text text-[7px] text-slate-400">COMBO</p>
          <p className="pixel-text text-[11px] text-cyan-400">
            {combo > 1 ? `${combo}x` : '1x'}
          </p>
        </div>
      </div>

      {/* Main Game Screen Canvas */}
      <div className="relative w-full max-w-[440px] overflow-hidden rounded border-2 border-black mc-panel shadow-2xl">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleCanvasClick}
          className="block w-full h-auto cursor-pointer"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* New High Score Banner */}
        {isNewHigh && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 mc-panel px-3 py-1 flex items-center gap-1.5 bg-yellow-950/90 border-gold animate-bounce">
            <Trophy size={14} className="text-gold" />
            <span className="pixel-text text-[8px] text-gold">NEW HIGH SCORE!</span>
          </div>
        )}

        {/* Active Powerup Alert */}
        {boostActive && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 mc-panel px-2.5 py-0.5 flex items-center gap-1 bg-amber-950/80 border-amber-400">
            <Zap size={12} className="text-yellow-400 animate-pulse" />
            <span className="pixel-text text-[8px] text-yellow-300">SPEED PICKAXE!</span>
          </div>
        )}
      </div>

      {/* On-screen Touch Controls (D-pad & Action buttons) for Mobile */}
      <div className="mt-4 flex w-full max-w-[440px] items-center justify-between px-2">
        {/* Directional D-Pad */}
        <div className="grid grid-cols-3 gap-1 w-32 sm:w-36">
          <div />
          <button
            type="button"
            onClick={() => tryAction(0, -1)}
            aria-label="Move Up / Climb"
            className="mc-btn flex h-10 items-center justify-center active:scale-95"
          >
            <ArrowUp size={18} />
          </button>
          <div />

          <button
            type="button"
            onClick={() => tryAction(-1, 0)}
            aria-label="Dig Left"
            className="mc-btn flex h-10 items-center justify-center active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => tryAction(0, 1)}
            aria-label="Dig Down"
            className="mc-btn flex h-10 items-center justify-center active:scale-95"
          >
            <ArrowDown size={18} />
          </button>
          <button
            type="button"
            onClick={() => tryAction(1, 0)}
            aria-label="Dig Right"
            className="mc-btn flex h-10 items-center justify-center active:scale-95"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Dynamite Action Button */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={deployDynamite}
            disabled={dynamites <= 0}
            className={`mc-btn flex h-14 w-20 flex-col items-center justify-center gap-0.5 px-2 active:scale-95 ${
              dynamites > 0 ? 'bg-red-800 border-red-500' : 'opacity-50'
            }`}
          >
            <Bomb size={18} className="text-red-400" />
            <span className="pixel-text text-[7px]">TNT ({dynamites})</span>
          </button>
          <span className="pixel-text text-[7px] text-slate-400">SPACE or TAP</span>
        </div>
      </div>

      {/* Control hints */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-center text-slate-400 text-xs">
        <span>Controls: Arrow Keys / WASD to move &amp; dig</span>
        <span>•</span>
        <span>Space: Deploy TNT</span>
        <span>•</span>
        <span>P: Pause</span>
      </div>
    </div>
  )
}

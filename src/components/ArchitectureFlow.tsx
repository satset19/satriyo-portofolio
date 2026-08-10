import { useState } from 'react'
import { archNodes } from '../data/archNodes'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { playClick } from '../game/useSound'

const W = 1040
const H = 190
const SPINE_Y = 95
const NODE_W = 128
const NODE_H = 100
const NODE_Y = 45
const centerX = (i: number) => 80 + i * (880 / 6)
const SPINE_PATH = `M 80 ${SPINE_Y} H 960`

const PULSES = ['0s', '1.6s', '3.2s']

export function ArchitectureFlow() {
  const [activeId, setActiveId] = useState('cdc')
  const reducedMotion = usePrefersReducedMotion()
  const active = archNodes.find((n) => n.id === activeId) ?? archNodes[0]
  const ActiveIcon = active.icon

  return (
    <div>
      <div className="mc-slot overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="min-w-[900px]"
          role="group"
          aria-label="End-to-end message pipeline. Select a stage to read what it does."
        >
          {/* rail track: wooden ties + two steel rails */}
          <path
            d={SPINE_PATH}
            fill="none"
            stroke="#6b4a2b"
            strokeWidth="10"
            strokeDasharray="4 10"
          />
          <path d={`M 80 ${SPINE_Y - 4} H 960`} fill="none" stroke="#8b8b8b" strokeWidth="2" />
          <path d={`M 80 ${SPINE_Y + 4} H 960`} fill="none" stroke="#8b8b8b" strokeWidth="2" />

          {/* redstone pulses travelling down the rail */}
          {!reducedMotion &&
            PULSES.map((begin) => (
              <rect
                key={begin}
                x="-4"
                y="-4"
                width="8"
                height="8"
                fill="#ff5533"
                style={{ filter: 'drop-shadow(0 0 5px #ff3b30)' }}
              >
                <animateMotion dur="5s" begin={begin} repeatCount="indefinite" path={SPINE_PATH} />
              </rect>
            ))}

          {/* nodes */}
          {archNodes.map((node, i) => {
            const cx = centerX(i)
            const isActive = node.id === activeId
            const Icon = node.icon
            return (
              <g
                key={node.id}
                tabIndex={0}
                role="button"
                aria-pressed={isActive}
                aria-label={`${node.label}: ${node.blurb}`}
                onMouseEnter={() => setActiveId(node.id)}
                onFocus={() => setActiveId(node.id)}
                onClick={() => {
                  playClick()
                  setActiveId(node.id)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActiveId(node.id)
                  }
                }}
                className="cursor-pointer outline-none"
              >
                <rect
                  x={cx - NODE_W / 2}
                  y={NODE_Y}
                  width={NODE_W}
                  height={NODE_H}
                  rx="2"
                  fill={isActive ? '#2b2b2e' : '#1f1f22'}
                  stroke={isActive ? '#80ff20' : '#0a0a0a'}
                  strokeWidth={isActive ? 3 : 2}
                  style={
                    isActive
                      ? { filter: 'drop-shadow(0 0 8px rgb(128 255 32 / 0.4))' }
                      : undefined
                  }
                  className="transition-[stroke,fill] duration-200"
                />
                <Icon
                  size={22}
                  x={cx - 11}
                  y={NODE_Y + 16}
                  color={isActive ? '#80ff20' : '#94a3b8'}
                  aria-hidden
                />
                <text
                  x={cx}
                  y={NODE_Y + 66}
                  textAnchor="middle"
                  fill={isActive ? '#fcd34d' : '#94a3b8'}
                  fontSize="16"
                  fontFamily="'VT323', monospace"
                >
                  {node.label}
                </text>
                <text
                  x={cx}
                  y={NODE_Y + 84}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="13"
                  fontFamily="'VT323', monospace"
                >
                  {`0${i + 1}`}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* detail panel */}
      <div aria-live="polite" className="mc-panel mt-4 min-h-24 p-5">
        {/* key remount + .fade-swap = subtle crossfade when the active node changes */}
        <div key={active.id} className="fade-swap flex items-center gap-4">
          <span className="mc-slot shrink-0 p-3 text-gold">
            <ActiveIcon size={22} aria-hidden />
          </span>
          <div>
            <p className="pixel-text text-[10px] text-gold">{active.label}</p>
            <p className="mt-1.5 text-lg leading-snug text-slate-300">{active.blurb}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

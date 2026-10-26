import { useState } from 'react'
import { ARCH_TOPOLOGIES, type ArchTopology } from '../data/archNodes'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { playClick } from '../game/useSound'

const W = 1040
const H = 200
const SPINE_Y = 100
const NODE_W = 126
const NODE_H = 108
const NODE_Y = 46
const SPINE_PATH = `M 80 ${SPINE_Y} H 960`

const PULSES = ['0s', '1.6s', '3.2s']

const TOPOLOGY_KEYS: ArchTopology[] = ['cdc', 'gateway', 'multiagent']

interface ArchitectureFlowProps {
  initialTopology?: ArchTopology
  onTopologyChange?: (topology: ArchTopology) => void
}

export function ArchitectureFlow({
  initialTopology = 'cdc',
  onTopologyChange,
}: ArchitectureFlowProps) {
  const [currentTopologyKey, setCurrentTopologyKey] = useState<ArchTopology>(initialTopology)
  const currentTopology = ARCH_TOPOLOGIES[currentTopologyKey]
  const [activeNodeId, setActiveNodeId] = useState<string>(
    currentTopologyKey === 'cdc'
      ? 'cdc'
      : currentTopologyKey === 'gateway'
        ? 'route-reg'
        : 'orchestrator',
  )
  const reducedMotion = usePrefersReducedMotion()

  const handleSelectTopology = (topo: ArchTopology) => {
    playClick()
    setCurrentTopologyKey(topo)
    const defaultNode =
      topo === 'cdc'
        ? 'cdc'
        : topo === 'gateway'
          ? 'route-reg'
          : 'orchestrator'
    setActiveNodeId(defaultNode)
    onTopologyChange?.(topo)
  }

  const nodes = currentTopology.nodes
  const activeNode =
    nodes.find((n) => n.id === activeNodeId) ?? nodes[0]
  const ActiveIcon = activeNode.icon

  const centerX = (i: number) => 80 + i * (880 / (nodes.length - 1))

  return (
    <div className="space-y-4">
      {/* Topology Selector Tabs */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Select architectural topology view"
          className="flex flex-wrap gap-2"
        >
          {TOPOLOGY_KEYS.map((key) => {
            const config = ARCH_TOPOLOGIES[key]
            const isSelected = currentTopologyKey === key
            return (
              <button
                key={key}
                role="tab"
                id={`tab-${key}`}
                aria-selected={isSelected}
                aria-controls={`panel-${key}`}
                type="button"
                onClick={() => handleSelectTopology(key)}
                className={`mc-btn px-3 py-2 text-[10px] tracking-wide transition-all focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-xp ${
                  isSelected ? 'mc-btn-green shadow-inner' : 'hover:border-slate-500'
                }`}
              >
                {config.shortLabel}
              </button>
            )
          })}
        </div>

        {/* Rail subtitle info */}
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{
              backgroundColor: currentTopology.pulseColor,
              boxShadow: `0 0 8px ${currentTopology.glowColor}`,
            }}
          />
          <span className="font-mono text-xs text-slate-300">
            {currentTopology.railTitle}
          </span>
        </div>
      </div>

      {/* SVG Canvas & Node Rail */}
      <div
        id={`panel-${currentTopologyKey}`}
        role="tabpanel"
        aria-labelledby={`tab-${currentTopologyKey}`}
        className="mc-slot overflow-x-auto p-1"
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="min-w-[920px]"
          role="group"
          aria-label={`${currentTopology.label}: Select a stage to view mechanics.`}
        >
          <defs>
            <linearGradient id={`railGrad-${currentTopologyKey}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={currentTopology.railColor} stopOpacity="0.3" />
              <stop offset="50%" stopColor={currentTopology.railColor} stopOpacity="0.9" />
              <stop offset="100%" stopColor={currentTopology.railColor} stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Wooden/Obsidian Ties */}
          <path
            d={SPINE_PATH}
            fill="none"
            stroke={currentTopology.railTrackColor}
            strokeWidth="12"
            strokeDasharray="4 12"
          />

          {/* Two parallel metallic rail tracks */}
          <path
            d={`M 80 ${SPINE_Y - 4} H 960`}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            opacity="0.8"
          />
          <path
            d={`M 80 ${SPINE_Y + 4} H 960`}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            opacity="0.8"
          />

          {/* Glowing center energy line */}
          <path
            d={SPINE_PATH}
            fill="none"
            stroke={`url(#railGrad-${currentTopologyKey})`}
            strokeWidth="3"
            opacity="0.75"
          />

          {/* Traveling energy pulses */}
          {!reducedMotion &&
            PULSES.map((begin) => (
              <rect
                key={begin}
                x="-4"
                y="-4"
                width="8"
                height="8"
                fill={currentTopology.pulseColor}
                style={{ filter: `drop-shadow(0 0 6px ${currentTopology.glowColor})` }}
              >
                <animateMotion
                  dur="4.5s"
                  begin={begin}
                  repeatCount="indefinite"
                  path={SPINE_PATH}
                />
              </rect>
            ))}

          {/* Nodes */}
          {nodes.map((node, i) => {
            const cx = centerX(i)
            const isActive = node.id === activeNodeId
            const Icon = node.icon
            return (
              <g
                key={node.id}
                tabIndex={0}
                role="button"
                aria-pressed={isActive}
                aria-label={`${node.label}: ${node.blurb}`}
                onMouseEnter={() => setActiveNodeId(node.id)}
                onFocus={() => setActiveNodeId(node.id)}
                onClick={() => {
                  playClick()
                  setActiveNodeId(node.id)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    playClick()
                    setActiveNodeId(node.id)
                  }
                }}
                className="cursor-pointer outline-none"
              >
                {/* Node Box */}
                <rect
                  x={cx - NODE_W / 2}
                  y={NODE_Y}
                  width={NODE_W}
                  height={NODE_H}
                  rx="3"
                  fill={isActive ? '#2a2a30' : '#18181b'}
                  stroke={isActive ? currentTopology.pulseColor : '#334155'}
                  strokeWidth={isActive ? 3 : 1.5}
                  style={
                    isActive
                      ? {
                          filter: `drop-shadow(0 0 10px ${currentTopology.glowColor})`,
                        }
                      : undefined
                  }
                  className="transition-all duration-200"
                />

                {/* Node Icon */}
                <Icon
                  size={20}
                  x={cx - 10}
                  y={NODE_Y + 14}
                  color={isActive ? currentTopology.pulseColor : '#94a3b8'}
                  aria-hidden
                />

                {/* Node Label */}
                <text
                  x={cx}
                  y={NODE_Y + 62}
                  textAnchor="middle"
                  fill={isActive ? '#fcd34d' : '#e2e8f0'}
                  fontSize="15"
                  fontFamily="'VT323', monospace"
                  fontWeight="bold"
                >
                  {node.label}
                </text>

                {/* Node Metric Pill / Step Number */}
                <text
                  x={cx}
                  y={NODE_Y + 80}
                  textAnchor="middle"
                  fill={isActive ? currentTopology.pulseColor : '#64748b'}
                  fontSize="12"
                  fontFamily="'VT323', monospace"
                >
                  {node.metric ? `[${node.metric}]` : `0${i + 1}`}
                </text>

                {/* Step Index in corner */}
                <text
                  x={cx + NODE_W / 2 - 8}
                  y={NODE_Y + 16}
                  textAnchor="end"
                  fill="#475569"
                  fontSize="11"
                  fontFamily="'VT323', monospace"
                >
                  #{i + 1}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Detail Panel */}
      <div aria-live="polite" className="mc-panel p-5">
        <div key={`${currentTopologyKey}-${activeNode.id}`} className="fade-swap flex flex-col gap-4 sm:flex-row sm:items-center">
          <div
            className="mc-slot shrink-0 self-start p-3 sm:self-center"
            style={{
              borderColor: currentTopology.pulseColor,
              boxShadow: `0 0 8px ${currentTopology.glowColor}20`,
            }}
          >
            <ActiveIcon size={26} color={currentTopology.pulseColor} aria-hidden />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="pixel-text text-[11px] text-gold">{activeNode.label}</span>
              {activeNode.metric && (
                <span className="rounded bg-black/40 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-900/60">
                  {activeNode.metric}
                </span>
              )}
              <span className="font-mono text-xs text-slate-500">
                Stage {nodes.findIndex((n) => n.id === activeNode.id) + 1} of {nodes.length}
              </span>
            </div>

            <p className="mt-1.5 text-base leading-snug text-slate-200">
              {activeNode.blurb}
            </p>

            <p className="mt-2 text-xs text-slate-400 font-mono">
              Topology Context: <span className="text-slate-300">{currentTopology.summary}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

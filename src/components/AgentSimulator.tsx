import { useState, useEffect, useRef } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Bot,
  Terminal,
  Activity,
  Layers,
  CheckCircle2,
  Cpu,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { playClick, playChime } from '../game/useSound'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

export type AgentStatus =
  | 'IDLE'
  | 'ORCHESTRATING'
  | 'TOOL_CALL'
  | 'EXECUTING'
  | 'VERIFYING'
  | 'COMPLETED'
  | 'PAUSED'

export interface TraceStep {
  id: string
  timestamp: string
  agent: 'ORCHESTRATOR' | 'ARCHITECT' | 'CODER' | 'EVAL_GATE' | 'GATEWAY'
  type: 'PLAN' | 'SPAWN' | 'TOOL_CALL' | 'TOOL_RESULT' | 'GATE_CHECK' | 'COMPLETE'
  title: string
  toolName?: string
  toolPayload?: Record<string, unknown>
  toolResult?: Record<string, unknown>
  deltaInputTokens: number
  deltaOutputTokens: number
  stepLatencyMs: number
  statusBadge: AgentStatus
}

export interface SimulatorPreset {
  id: string
  title: string
  description: string
  badge: string
  steps: TraceStep[]
}

const PRESETS: SimulatorPreset[] = [
  {
    id: 'bundle-optimizer',
    title: 'Autonomous Code Refactoring & Gate (ARC-01 / AUT-01)',
    badge: 'Code Splitting DAG',
    description:
      'Lead orchestrator analyzes bundle warnings, spawns AST and Coder subagents to optimize Vite manualChunks, and gates on Oxlint.',
    steps: [
      {
        id: 's1',
        timestamp: '14:20:01.102',
        agent: 'ORCHESTRATOR',
        type: 'PLAN',
        title: 'Task Ingested: Code-split Three.js bundle to eliminate >500kB warning',
        deltaInputTokens: 1420,
        deltaOutputTokens: 280,
        stepLatencyMs: 120,
        statusBadge: 'ORCHESTRATING',
      },
      {
        id: 's2',
        timestamp: '14:20:01.350',
        agent: 'ORCHESTRATOR',
        type: 'SPAWN',
        title: 'Spawned subagents: architect-worker (PID 4021) and coder-worker (PID 4022)',
        deltaInputTokens: 850,
        deltaOutputTokens: 310,
        stepLatencyMs: 95,
        statusBadge: 'ORCHESTRATING',
      },
      {
        id: 's3',
        timestamp: '14:20:01.620',
        agent: 'ARCHITECT',
        type: 'TOOL_CALL',
        title: 'Inspect package dependencies & AST module imports',
        toolName: 'read_file',
        toolPayload: { path: 'package.json', fields: ['dependencies', 'devDependencies'] },
        toolResult: { three: '^0.185.1', '@react-three/fiber': '^9.7.0', vite: '^8.2.0' },
        deltaInputTokens: 2150,
        deltaOutputTokens: 420,
        stepLatencyMs: 240,
        statusBadge: 'TOOL_CALL',
      },
      {
        id: 's4',
        timestamp: '14:20:02.100',
        agent: 'CODER',
        type: 'TOOL_CALL',
        title: 'Apply manualChunks split in vite.config.ts for three-core & three-fiber',
        toolName: 'patch_file',
        toolPayload: {
          path: 'vite.config.ts',
          manualChunks: "['three-core', 'three-fiber']",
          chunkSizeWarningLimit: 800,
        },
        toolResult: { bytes_written: 529, verified: true, status: 'PATCH_APPLIED' },
        deltaInputTokens: 3200,
        deltaOutputTokens: 580,
        stepLatencyMs: 310,
        statusBadge: 'EXECUTING',
      },
      {
        id: 's5',
        timestamp: '14:20:02.680',
        agent: 'EVAL_GATE',
        type: 'GATE_CHECK',
        title: 'Execute test gate: tsc -b && vite build && oxlint',
        toolName: 'terminal',
        toolPayload: { command: 'pnpm build && pnpm lint' },
        toolResult: {
          exit_code: 0,
          build_time: '2.12s',
          chunks: ['three-core: 724kB', 'three-fiber: 167kB', 'VoxelWorld: 5.8kB'],
          warnings: 0,
        },
        deltaInputTokens: 4100,
        deltaOutputTokens: 640,
        stepLatencyMs: 540,
        statusBadge: 'VERIFYING',
      },
      {
        id: 's6',
        timestamp: '14:20:03.450',
        agent: 'ORCHESTRATOR',
        type: 'COMPLETE',
        title: 'All gates passed. Clean bundle emission with 0 warnings. Session closed.',
        deltaInputTokens: 980,
        deltaOutputTokens: 420,
        stepLatencyMs: 110,
        statusBadge: 'COMPLETED',
      },
    ],
  },
  {
    id: 'route-failover',
    title: 'Cross-Pod WebSocket Failover & Route Migration (ARC-02)',
    badge: 'Redis Route Mesh',
    description:
      'Simulates graceful pod drain and route re-registration of 10,000 live WebSocket client connections.',
    steps: [
      {
        id: 'f1',
        timestamp: '15:10:00.040',
        agent: 'ORCHESTRATOR',
        type: 'PLAN',
        title: 'Node eviction alert on k8s-worker-04; drain signal dispatched to gw-pod-3',
        deltaInputTokens: 1120,
        deltaOutputTokens: 240,
        stepLatencyMs: 140,
        statusBadge: 'ORCHESTRATING',
      },
      {
        id: 'f2',
        timestamp: '15:10:00.320',
        agent: 'GATEWAY',
        type: 'TOOL_CALL',
        title: 'Acquire Redis distributed re-hash lock for tenant partition cluster',
        toolName: 'redis_lock',
        toolPayload: { key: 'lock:partition:gw-pod-3', ttl_ms: 15000 },
        toolResult: { acquired: true, token: 'redlock-994b-ac8' },
        deltaInputTokens: 1940,
        deltaOutputTokens: 380,
        stepLatencyMs: 190,
        statusBadge: 'TOOL_CALL',
      },
      {
        id: 'f3',
        timestamp: '15:10:00.750',
        agent: 'GATEWAY',
        type: 'TOOL_CALL',
        title: 'Forward active frame buffers to sibling pods over gRPC mesh',
        toolName: 'grpc_stream_transfer',
        toolPayload: { target_pods: ['gw-pod-1', 'gw-pod-2'], buffered_frames: 4820 },
        toolResult: { frames_transferred: 4820, drop_count: 0, p99_latency_ms: 12 },
        deltaInputTokens: 2860,
        deltaOutputTokens: 490,
        stepLatencyMs: 290,
        statusBadge: 'EXECUTING',
      },
      {
        id: 'f4',
        timestamp: '15:10:01.210',
        agent: 'EVAL_GATE',
        type: 'GATE_CHECK',
        title: 'Verify route registry consistency & heartbeat SLO',
        toolName: 'redis_verify_routes',
        toolPayload: { expected_connections: 10000, verified_nodes: 2 },
        toolResult: { routed_live: 10000, orphaned: 0, max_disconnect_ms: 48 },
        deltaInputTokens: 3450,
        deltaOutputTokens: 510,
        stepLatencyMs: 380,
        statusBadge: 'VERIFYING',
      },
      {
        id: 'f5',
        timestamp: '15:10:01.800',
        agent: 'ORCHESTRATOR',
        type: 'COMPLETE',
        title: '10k sessions migrated seamlessly. Zero client disconnects. Lock released.',
        deltaInputTokens: 1200,
        deltaOutputTokens: 380,
        stepLatencyMs: 90,
        statusBadge: 'COMPLETED',
      },
    ],
  },
  {
    id: 'cdc-stream',
    title: 'PostgreSQL WAL CDC Ingestion & JetStream Replay (ARC-03)',
    badge: '5k msg/s CDC',
    description:
      'Traces Postgres logical replication slot WAL consumption, Redis SETNX deduplication, and fan-out.',
    steps: [
      {
        id: 'c1',
        timestamp: '16:05:12.110',
        agent: 'ORCHESTRATOR',
        type: 'PLAN',
        title: 'Tenant burst detected: 5,400 orders/sec on shard pg-tenant-08',
        deltaInputTokens: 980,
        deltaOutputTokens: 210,
        stepLatencyMs: 110,
        statusBadge: 'ORCHESTRATING',
      },
      {
        id: 'c2',
        timestamp: '16:05:12.380',
        agent: 'ARCHITECT',
        type: 'TOOL_CALL',
        title: 'Read logical replication slot pgoutput WAL stream',
        toolName: 'pg_replication_consume',
        toolPayload: { slot: 'order_cdc_slot', wal_lsn: '16/B432E90', batch_size: 2500 },
        toolResult: { events_read: 2500, wal_lag_bytes: 0, bytes_per_sec: '4.2MB/s' },
        deltaInputTokens: 2400,
        deltaOutputTokens: 410,
        stepLatencyMs: 220,
        statusBadge: 'TOOL_CALL',
      },
      {
        id: 'c3',
        timestamp: '16:05:12.890',
        agent: 'CODER',
        type: 'TOOL_CALL',
        title: 'Redis SETNX exact-once dedup & NATS JetStream publish',
        toolName: 'nats_jetstream_pub',
        toolPayload: {
          stream: 'ORDERS_STREAM',
          subject: 'events.orders.v1',
          dedup_window: '30s',
        },
        toolResult: { published: 2500, duplicates_filtered: 14, ack_latency_p95_ms: 1.8 },
        deltaInputTokens: 3100,
        deltaOutputTokens: 530,
        stepLatencyMs: 310,
        statusBadge: 'EXECUTING',
      },
      {
        id: 'c4',
        timestamp: '16:05:13.410',
        agent: 'EVAL_GATE',
        type: 'GATE_CHECK',
        title: 'Inspect end-to-end telemetry: Commit-to-browser delta <200ms',
        toolName: 'telemetry_slo_check',
        toolPayload: { p50_target: 80, p95_target: 200 },
        toolResult: { p50_actual_ms: 64, p95_actual_ms: 142, status: 'SLO_MET' },
        deltaInputTokens: 2900,
        deltaOutputTokens: 460,
        stepLatencyMs: 280,
        statusBadge: 'VERIFYING',
      },
      {
        id: 'c5',
        timestamp: '16:05:13.920',
        agent: 'ORCHESTRATOR',
        type: 'COMPLETE',
        title: 'Burst ingested and fanned out. DLQ zero-exhaustion confirmed.',
        deltaInputTokens: 890,
        deltaOutputTokens: 320,
        stepLatencyMs: 80,
        statusBadge: 'COMPLETED',
      },
    ],
  },
]

export function AgentSimulator() {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1)
  const [activeLogId, setActiveLogId] = useState<string | null>(null)
  const [logFilter, setLogFilter] = useState<'ALL' | 'TOOLS' | 'GATES'>('ALL')
  const reducedMotion = usePrefersReducedMotion()
  const logContainerRef = useRef<HTMLDivElement>(null)

  const preset = PRESETS[selectedPresetIndex]
  const steps = preset.steps
  const activeStep = steps[currentStepIndex] || steps[0]

  // Calculate cumulative tokens and latency up to current step
  const accumulated = steps.slice(0, currentStepIndex + 1).reduce(
    (acc, s) => {
      acc.inputTokens += s.deltaInputTokens
      acc.outputTokens += s.deltaOutputTokens
      acc.totalLatency += s.stepLatencyMs
      if (s.toolName) acc.toolCallsCount += 1
      return acc
    },
    { inputTokens: 0, outputTokens: 0, totalLatency: 0, toolCallsCount: 0 },
  )

  const isCompleted = currentStepIndex >= steps.length - 1 && steps.length > 0
  const currentStatus: AgentStatus = isPlaying
    ? activeStep.statusBadge
    : isCompleted
      ? 'COMPLETED'
      : currentStepIndex === 0
        ? 'IDLE'
        : 'PAUSED'

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) return

    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false)
      playChime()
      return
    }

    const delay = Math.max(
      400,
      Math.floor((activeStep.stepLatencyMs * 4) / playbackSpeed),
    )

    const timer = window.setTimeout(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1
        playClick()
        if (next >= steps.length - 1) {
          setIsPlaying(false)
          playChime()
        }
        return next
      })
    }, delay)

    return () => clearTimeout(timer)
  }, [isPlaying, currentStepIndex, steps.length, playbackSpeed, activeStep.stepLatencyMs])

  // Auto-scroll log box
  useEffect(() => {
    if (!reducedMotion && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [currentStepIndex, reducedMotion])

  const handleSelectPreset = (index: number) => {
    playClick()
    setIsPlaying(false)
    setSelectedPresetIndex(index)
    setCurrentStepIndex(0)
    setActiveLogId(null)
  }

  const handleTogglePlay = () => {
    playClick()
    if (isCompleted) {
      setCurrentStepIndex(0)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const handleReset = () => {
    playClick()
    setIsPlaying(false)
    setCurrentStepIndex(0)
    setActiveLogId(null)
  }

  const handleStepForward = () => {
    playClick()
    setIsPlaying(false)
    if (currentStepIndex < steps.length - 1) {
      const next = currentStepIndex + 1
      setCurrentStepIndex(next)
      if (next >= steps.length - 1) playChime()
    }
  }

  const visibleLogs = steps
    .slice(0, currentStepIndex + 1)
    .filter((s) => {
      if (logFilter === 'TOOLS') return !!s.toolName
      if (logFilter === 'GATES') return s.type === 'GATE_CHECK'
      return true
    })

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'ORCHESTRATING':
        return 'text-amber-400 bg-amber-950/40 border-amber-800/80'
      case 'TOOL_CALL':
        return 'text-sky-400 bg-sky-950/40 border-sky-800/80'
      case 'EXECUTING':
        return 'text-purple-400 bg-purple-950/40 border-purple-800/80'
      case 'VERIFYING':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/80'
      case 'COMPLETED':
        return 'text-green-300 bg-green-950/50 border-green-600'
      case 'PAUSED':
        return 'text-slate-400 bg-slate-900/60 border-slate-700'
      default:
        return 'text-slate-400 bg-slate-900/60 border-slate-700'
    }
  }

  return (
    <div className="mc-panel space-y-6 p-4 sm:p-7">
      {/* Header Bar */}
      <div className="flex flex-col gap-3 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="mc-slot flex h-8 w-8 items-center justify-center p-1 text-gold">
              <Bot size={18} aria-hidden />
            </span>
            <div>
              <p className="pixel-text text-[10px] leading-relaxed uppercase tracking-wider text-gold">
                AUT-01 & AUT-02 • Execution Sandbox
              </p>
              <h2 className="pixel-text text-xs leading-relaxed sm:text-base text-slate-100">
                Autonomous Multi-Agent Telemetry Simulator
              </h2>
            </div>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-3">
          <div
            role="status"
            className={`flex items-center gap-2 rounded border px-3 py-1 font-mono text-base font-semibold ${getStatusColor(
              currentStatus,
            )}`}
          >
            <span
              aria-hidden
              className={`h-2 w-2 rounded-full ${
                isPlaying ? 'animate-ping bg-current' : 'bg-current'
              }`}
            />
            STATUS: {currentStatus}
          </div>

          <div className="hidden rounded bg-black/50 px-2.5 py-1 font-mono text-base text-slate-400 sm:block">
            STEP {currentStepIndex + 1}/{steps.length}
          </div>
        </div>
      </div>

      {/* Preset Scenario Picker */}
      <div>
        <p id="sim-scenario-label" className="mb-2 block font-mono text-base uppercase tracking-wide text-slate-300">
          Select Simulation Scenario:
        </p>
        <div role="group" aria-labelledby="sim-scenario-label" className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {PRESETS.map((p, idx) => {
            const isSelected = selectedPresetIndex === idx
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleSelectPreset(idx)}
                className={`mc-slot mc-card-interactive p-3 text-left ${
                  isSelected
                    ? 'border-gold bg-[#252528] shadow-[0_0_12px_rgba(252,211,77,0.15)]'
                    : 'hover:bg-[#1a1a1d]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-base text-amber-300">
                    {p.badge}
                  </span>
                  {isSelected && <Sparkles size={14} className="text-gold" aria-hidden />}
                </div>
                <p className="mt-2 text-base font-bold text-slate-200 line-clamp-1">{p.title}</p>
                <p className="mt-1 text-base text-slate-400 line-clamp-2 leading-relaxed font-sans">
                  {p.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Playback Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded bg-black/40 p-3 border border-slate-800">
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={handleTogglePlay}
            className={`mc-btn flex min-h-11 items-center gap-2 px-4 py-2 text-[10px] tracking-wide ${
              isPlaying ? 'mc-btn-yellow' : 'mc-btn-green'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause size={14} aria-hidden /> PAUSE
              </>
            ) : isCompleted ? (
              <>
                <RotateCcw size={14} aria-hidden /> REPLAY TRACE
              </>
            ) : (
              <>
                <Play size={14} aria-hidden /> RUN TRACE
              </>
            )}
          </button>

          {/* Step Forward Button */}
          <button
            type="button"
            disabled={isPlaying || isCompleted}
            onClick={handleStepForward}
            className="mc-btn flex h-11 w-11 shrink-0 items-center justify-center disabled:opacity-40"
            aria-label="Step forward one trace event"
            title="Step forward one trace event"
          >
            <ChevronRight size={16} aria-hidden />
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            className="mc-btn flex h-11 w-11 shrink-0 items-center justify-center"
            aria-label="Reset simulation"
            title="Reset simulation"
          >
            <RotateCcw size={16} aria-hidden />
          </button>
        </div>

        {/* Speed Selector */}
        <div role="group" aria-labelledby="sim-speed-label" className="flex items-center gap-1.5">
          <span id="sim-speed-label" className="font-mono text-base text-slate-300 flex items-center gap-1">
            <FastForward size={13} aria-hidden /> SPEED:
          </span>
          {([1, 2, 4] as const).map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => {
                playClick()
                setPlaybackSpeed(spd)
              }}
              aria-pressed={playbackSpeed === spd}
              className={`flex h-11 min-w-11 items-center justify-center rounded px-2 font-mono text-base transition-colors active:translate-y-px ${
                playbackSpeed === spd
                  ? 'bg-amber-400 text-black font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Telemetry Metrics Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Input Tokens */}
        <div className="mc-slot p-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono text-base uppercase">Input Tokens</span>
            <Activity size={14} className="text-sky-400" aria-hidden />
          </div>
          <p className="mt-1 font-mono text-lg font-bold text-sky-300">
            {accumulated.inputTokens.toLocaleString()}
          </p>
          <p className="text-base text-slate-400 font-mono">prompt + tool context</p>
        </div>

        {/* Output Tokens */}
        <div className="mc-slot p-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono text-base uppercase">Output Tokens</span>
            <Sparkles size={14} className="text-amber-400" aria-hidden />
          </div>
          <p className="mt-1 font-mono text-lg font-bold text-amber-300">
            {accumulated.outputTokens.toLocaleString()}
          </p>
          <p className="text-base text-slate-400 font-mono">reasoning + tool calls</p>
        </div>

        {/* Tool Invocations */}
        <div className="mc-slot p-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono text-base uppercase">Tool Invocations</span>
            <Cpu size={14} className="text-purple-400" aria-hidden />
          </div>
          <p className="mt-1 font-mono text-lg font-bold text-purple-300">
            {accumulated.toolCallsCount}
          </p>
          <p className="text-base text-slate-400 font-mono">sandboxed executions</p>
        </div>

        {/* Pipeline Latency */}
        <div className="mc-slot p-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono text-base uppercase">Sim Latency</span>
            <CheckCircle2 size={14} className="text-emerald-400" aria-hidden />
          </div>
          <p className="mt-1 font-mono text-lg font-bold text-emerald-300">
            {accumulated.totalLatency}ms
          </p>
          <p className="text-base text-slate-400 font-mono">subagent execution time</p>
        </div>
      </div>

      {/* Subagents Pool Mesh Indicator */}
      <div className="rounded bg-black/30 p-3 border border-slate-800">
        <p className="mb-2 font-mono text-base uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Layers size={14} className="text-gold" aria-hidden />
          Active Subagent Pool Matrix:
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-base font-mono">
          <div
            className={`p-2 rounded border ${
              activeStep.agent === 'ORCHESTRATOR'
                ? 'border-amber-500/80 bg-amber-950/20 text-amber-200'
                : 'border-slate-800 bg-slate-900/40 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>Hermes Lead</span>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
            </div>
            <p className="text-base text-slate-400">Plan & State DAG</p>
          </div>

          <div
            className={`p-2 rounded border ${
              activeStep.agent === 'ARCHITECT'
                ? 'border-sky-500/80 bg-sky-950/20 text-sky-200'
                : 'border-slate-800 bg-slate-900/40 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>Architect Subagent</span>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
            </div>
            <p className="text-base text-slate-400">AST & Dependency</p>
          </div>

          <div
            className={`p-2 rounded border ${
              activeStep.agent === 'CODER' || activeStep.agent === 'GATEWAY'
                ? 'border-purple-500/80 bg-purple-950/20 text-purple-200'
                : 'border-slate-800 bg-slate-900/40 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>Worker Subagent</span>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
            </div>
            <p className="text-base text-slate-400">Tool Execution</p>
          </div>

          <div
            className={`p-2 rounded border ${
              activeStep.agent === 'EVAL_GATE'
                ? 'border-emerald-500/80 bg-emerald-950/20 text-emerald-200'
                : 'border-slate-800 bg-slate-900/40 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>Eval Gate</span>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
            </div>
            <p className="text-base text-slate-400">Oxlint & Test Suite</p>
          </div>
        </div>
      </div>

      {/* Terminal Trace Stream Box */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-emerald-400" aria-hidden />
            <span className="font-mono text-base uppercase tracking-wide text-slate-300">
              Live Subagent Trace Log
            </span>
          </div>

          {/* Filter Tabs */}
          <div role="group" aria-label="Filter trace log" className="flex items-center gap-1 font-mono text-base">
            {(['ALL', 'TOOLS', 'GATES'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  playClick()
                  setLogFilter(filter)
                }}
                aria-pressed={logFilter === filter}
                className={`flex h-11 min-w-11 items-center justify-center rounded px-2 transition-colors ${
                  logFilter === filter
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Terminal Window */}
        <div className="rounded border border-slate-700 bg-[#0d0e12] shadow-2xl overflow-hidden">
          {/* Window Title Bar */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-slate-800 bg-[#16171f] px-3 py-1.5 text-base font-mono text-slate-400">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
              <span className="ml-2 min-w-0 truncate text-slate-300">
                hermes-agent-trace://session/{preset.id}
              </span>
            </div>
            <span className="text-base text-emerald-400">STREAMING • WS-ONLINE</span>
          </div>

          {/* Logs Container */}
          <div
            ref={logContainerRef}
            className="max-h-64 min-h-48 overflow-y-auto p-3 font-mono text-base leading-relaxed space-y-2 selection:bg-slate-800"
          >
            {visibleLogs.map((log, index) => {
              const isLatest = index === visibleLogs.length - 1
              const isSelected = activeLogId === log.id

              let agentColor = 'text-amber-400'
              if (log.agent === 'ARCHITECT') agentColor = 'text-sky-400'
              if (log.agent === 'CODER' || log.agent === 'GATEWAY') agentColor = 'text-purple-400'
              if (log.agent === 'EVAL_GATE') agentColor = 'text-emerald-400'

              return (
                <div
                  key={log.id}
                  role="button"
                  tabIndex={0}
                  aria-expanded={log.toolPayload || log.toolResult ? isSelected : undefined}
                  onClick={() => {
                    playClick()
                    setActiveLogId(isSelected ? null : log.id)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      playClick()
                      setActiveLogId(isSelected ? null : log.id)
                    }
                  }}
                  className={`cursor-pointer rounded p-1.5 transition-colors ${
                    isSelected
                      ? 'bg-slate-800/80 border border-slate-600'
                      : isLatest
                        ? 'bg-slate-900/60'
                        : 'hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-slate-400 text-base">[{log.timestamp}]</span>
                    <span className={`font-bold text-base ${agentColor}`}>
                      [{log.agent}]
                    </span>
                    <span className="rounded bg-black/60 px-1 py-0.5 text-base text-slate-400">
                      {log.type}
                    </span>
                    <span className="flex-1 text-slate-200">{log.title}</span>
                    {log.toolName && (
                      <span className="rounded bg-sky-950/80 px-1.5 py-0.5 text-base text-sky-300 border border-sky-800/60">
                        ⚡ {log.toolName}
                      </span>
                    )}
                  </div>

                  {/* Expandable Tool Inspection */}
                  {isSelected && (log.toolPayload || log.toolResult) && (
                    <div className="mt-2.5 rounded bg-black/80 p-2.5 text-base text-slate-300 border border-slate-800">
                      {log.toolPayload && (
                        <div>
                          <p className="text-base font-bold text-sky-400 mb-1">
                            &gt; Tool Arguments:
                          </p>
                          <pre className="overflow-x-auto text-slate-300 whitespace-pre-wrap font-mono">
                            {JSON.stringify(log.toolPayload, null, 2)}
                          </pre>
                        </div>
                      )}
                      {log.toolResult && (
                        <div className="mt-2 pt-2 border-t border-slate-800">
                          <p className="text-base font-bold text-emerald-400 mb-1">
                            &lt; Tool Execution Output:
                          </p>
                          <pre className="overflow-x-auto text-slate-300 whitespace-pre-wrap font-mono">
                            {JSON.stringify(log.toolResult, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {visibleLogs.length === 0 && (
              <p className="text-slate-400 italic">No events match current filter.</p>
            )}

            {isPlaying && (
              <div className="flex items-center gap-2 pt-1 text-slate-400 text-base">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span>Executing autonomous step...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

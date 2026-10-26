import type { LucideIcon } from 'lucide-react'
import {
  Smartphone,
  Server,
  Waypoints,
  Database,
  GitBranch,
  Radio,
  MonitorSmartphone,
  ShieldCheck,
  Cpu,
  Terminal,
  Bot,
  Layers,
  Wrench,
  CheckCircle2,
  Network,
  Activity,
} from 'lucide-react'

export type ArchTopology = 'cdc' | 'gateway' | 'multiagent'

export interface ArchNode {
  id: string
  label: string
  icon: LucideIcon
  blurb: string
  metric?: string
}

export interface ArchTopologyConfig {
  id: ArchTopology
  label: string
  shortLabel: string
  railTitle: string
  summary: string
  railColor: string
  railTrackColor: string
  pulseColor: string
  glowColor: string
  nodes: ArchNode[]
}

export const ARCH_TOPOLOGIES: Record<ArchTopology, ArchTopologyConfig> = {
  cdc: {
    id: 'cdc',
    label: 'Realtime CDC Event Pipeline',
    shortLabel: 'CDC Pipeline',
    railTitle: 'Redstone Rail — WAL to WebSocket in <200ms',
    summary:
      'High-throughput change data capture streaming PostgreSQL WAL events to connected browsers with exactly-once Redis dedup and subject-based tenant isolation.',
    railColor: '#ff5533',
    railTrackColor: '#6b4a2b',
    pulseColor: '#ff5533',
    glowColor: '#ff3b30',
    nodes: [
      {
        id: 'device',
        label: 'Device',
        icon: Smartphone,
        metric: '<10ms',
        blurb: "A customer's phone sends an inbound message over edge networks.",
      },
      {
        id: 'edge',
        label: 'Edge Gateway',
        icon: Server,
        metric: '1 Pod/Acct',
        blurb:
          'A dedicated per-account container holds the persistent session and normalizes every event.',
      },
      {
        id: 'bus',
        label: 'Event Bus',
        icon: Waypoints,
        metric: 'NATS JS',
        blurb:
          'A clustered streaming bus (NATS JetStream) with subject-based tenant isolation.',
      },
      {
        id: 'persistence',
        label: 'Persistence',
        icon: Database,
        metric: 'WAL Commit',
        blurb:
          'Validated events land in per-tenant PostgreSQL schemas; failures route to a dead-letter queue.',
      },
      {
        id: 'cdc',
        label: 'CDC Processor',
        icon: GitBranch,
        metric: '5k msg/s',
        blurb:
          'Database commits become change events — deduplicated exactly-once and enriched with routing metadata.',
      },
      {
        id: 'realtime',
        label: 'Realtime Gateway',
        icon: Radio,
        metric: 'Route Reg',
        blurb:
          'Routes each event to the right browser across pods via a route registry — WebSocket all the way.',
      },
      {
        id: 'browser',
        label: 'Browser',
        icon: MonitorSmartphone,
        metric: '<200ms P95',
        blurb:
          'The agent sees the message. Commit-to-screen latency: under 200ms at P95.',
      },
    ],
  },
  gateway: {
    id: 'gateway',
    label: 'Multi-Tenant WebSocket Gateway & Route Registry',
    shortLabel: 'WebSocket Gateway',
    railTitle: 'Lapis Lazuli Bus — Zero-Drop Cross-Pod Mesh',
    summary:
      'Distributed Go WebSocket cluster with Redis route registry, gRPC circuit-broken cross-pod forwarding, and exclusive sessions guarded by distributed locks.',
    railColor: '#00e5ff',
    railTrackColor: '#1e293b',
    pulseColor: '#00e5ff',
    glowColor: '#00b4d8',
    nodes: [
      {
        id: 'ws-client',
        label: 'WS Client',
        icon: Smartphone,
        metric: 'TLS 1.3',
        blurb:
          'Browser or mobile client opens a persistent TLS WebSocket connection with AES-GCM bearer auth token.',
      },
      {
        id: 'ingress',
        label: 'TLS Ingress',
        icon: ShieldCheck,
        metric: 'Envoy L7',
        blurb:
          'Kubernetes ingress terminates TLS, verifies cryptographic tenant bearer claims, and balances pod connections.',
      },
      {
        id: 'gw-pod',
        label: 'Gateway Pod',
        icon: Cpu,
        metric: 'Go Coroutines',
        blurb:
          'Dedicated Go WebSocket daemon enforces backpressure, buffered frame writes, and adaptive ping/pong keepalives.',
      },
      {
        id: 'route-reg',
        label: 'Route Registry',
        icon: Waypoints,
        metric: 'Redis Key-Val',
        blurb:
          'Records active socket-to-pod mappings in Redis with adaptive TTLs and exclusive distributed locks.',
      },
      {
        id: 'redis-bus',
        label: 'Redis Pub/Sub',
        icon: Radio,
        metric: 'Pub/Sub Stream',
        blurb:
          'Distributes tenant event broadcasts across all pods in the cluster with zero-drop fanout guarantees.',
      },
      {
        id: 'grpc-mesh',
        label: 'gRPC Pod Mesh',
        icon: GitBranch,
        metric: 'Circuit Breaker',
        blurb:
          'Misrouted unicast frames are forwarded directly pod-to-pod over pooled gRPC with circuit breakers.',
      },
      {
        id: 'agent-desk',
        label: 'Agent Desk',
        icon: MonitorSmartphone,
        metric: '<50ms P99',
        blurb:
          'Agent workstation UI receives framed events with guaranteed delivery order and sub-50ms handoff.',
      },
    ],
  },
  multiagent: {
    id: 'multiagent',
    label: 'Autonomous Multi-Agent AI Orchestrator Loop',
    shortLabel: 'Multi-Agent Loop',
    railTitle: 'Amethyst Telemetry Loop — Autonomous Subagent DAG',
    summary:
      'Distributed multi-agent execution runtime orchestrating up to 10 parallel subagents with sandboxed tool execution, Graphify codebase context, and live WebSocket telemetry.',
    railColor: '#c084fc',
    railTrackColor: '#4a1d96',
    pulseColor: '#c084fc',
    glowColor: '#a855f7',
    nodes: [
      {
        id: 'intent',
        label: 'Task Ingest',
        icon: Terminal,
        metric: 'Intent DAG',
        blurb:
          'Ingests high-level user prompt or PR trigger, decomposing requirements into a dependency graph of sub-tasks.',
      },
      {
        id: 'orchestrator',
        label: 'Lead Orchestrator',
        icon: Bot,
        metric: 'Hermes Core',
        blurb:
          'Lead state machine orchestrator (Hermes Agent) plans parallel execution streams, delegates roles, and monitors progress.',
      },
      {
        id: 'subagents',
        label: 'Subagent Pool',
        icon: Layers,
        metric: 'Up to 10 Workers',
        blurb:
          'Spawns specialized worker subagents (Architect, Coder, Reviewer) running concurrent execution loops.',
      },
      {
        id: 'sandbox',
        label: 'Tool Sandbox',
        icon: Wrench,
        metric: 'Policy Guard',
        blurb:
          'Executes filesystem, terminal, and search tools under strict sandboxing, AST analysis, and dangerous command filters.',
      },
      {
        id: 'eval-gate',
        label: 'Eval Gate',
        icon: CheckCircle2,
        metric: 'TDD & Oxlint',
        blurb:
          'Enforces quality gates before merge: Red-Green verification, Oxlint static analysis, and diff safety validation.',
      },
      {
        id: 'knowledge',
        label: 'Graph Memory',
        icon: Network,
        metric: 'Graphify Knowledge',
        blurb:
          'Leverages Graphify knowledge graph and vector context for cross-file architecture navigation and semantic indexing.',
      },
      {
        id: 'telemetry',
        label: 'Telemetry Stream',
        icon: Activity,
        metric: 'Real-time Trace',
        blurb:
          'Streams real-time tool calls, token usage counters, and subagent state transitions over WebSocket to client UI.',
      },
    ],
  },
}

// Backwards-compatible export for existing imports
export const archNodes: ArchNode[] = ARCH_TOPOLOGIES.cdc.nodes

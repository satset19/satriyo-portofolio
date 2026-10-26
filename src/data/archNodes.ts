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
    railTitle: 'Redstone Rail: WAL to WebSocket in <200ms',
    summary:
      'Change data capture that streams PostgreSQL WAL events to connected browsers, with exactly-once Redis dedup and subject-based tenant isolation.',
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
          'Database commits become change events, deduplicated exactly once and enriched with routing metadata.',
      },
      {
        id: 'realtime',
        label: 'Realtime Gateway',
        icon: Radio,
        metric: 'Route Reg',
        blurb:
          'A route registry sends each event to the right browser, whichever pod holds its WebSocket.',
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
    railTitle: 'Lapis Lazuli Bus: Cross-Pod Delivery Mesh',
    summary:
      'Go WebSocket cluster with a Redis route registry, gRPC cross-pod forwarding behind a circuit breaker, and one session per user enforced by distributed locks.',
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
          'A browser or mobile client opens a persistent TLS WebSocket, authenticated with an AES-GCM bearer token.',
      },
      {
        id: 'ingress',
        label: 'TLS Ingress',
        icon: ShieldCheck,
        metric: 'Envoy L7',
        blurb:
          'Kubernetes ingress terminates TLS, checks the tenant bearer token, and balances connections across pods.',
      },
      {
        id: 'gw-pod',
        label: 'Gateway Pod',
        icon: Cpu,
        metric: 'Goroutines',
        blurb:
          'Go WebSocket server with backpressure, buffered frame writes, and adaptive ping/pong keepalives.',
      },
      {
        id: 'route-reg',
        label: 'Route Registry',
        icon: Waypoints,
        metric: 'Redis KV',
        blurb:
          'Records active socket-to-pod mappings in Redis with adaptive TTLs and exclusive distributed locks.',
      },
      {
        id: 'redis-bus',
        label: 'Redis Pub/Sub',
        icon: Radio,
        metric: 'Pub/Sub Stream',
        blurb:
          'Fans tenant broadcasts out to every pod in the cluster.',
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
          'The agent desk UI receives events in order, with sub-50ms handoff at P99.',
      },
    ],
  },
  multiagent: {
    id: 'multiagent',
    label: 'Autonomous Multi-Agent AI Orchestrator Loop',
    shortLabel: 'Multi-Agent Loop',
    railTitle: 'Amethyst Telemetry Loop: Parallel Subagent DAG',
    summary:
      'Multi-agent runtime that runs up to 10 parallel subagents with sandboxed tools, Graphify codebase context, and live WebSocket telemetry.',
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
          'Takes a user prompt or PR trigger and breaks it into a dependency graph of sub-tasks.',
      },
      {
        id: 'orchestrator',
        label: 'Lead Orchestrator',
        icon: Bot,
        metric: 'Hermes Core',
        blurb:
          'The lead orchestrator (Hermes Agent) plans parallel work, assigns roles, and tracks progress.',
      },
      {
        id: 'subagents',
        label: 'Subagent Pool',
        icon: Layers,
        metric: 'Up to 10 Workers',
        blurb:
          'Starts specialized subagents (Architect, Coder, Reviewer) that run concurrently.',
      },
      {
        id: 'sandbox',
        label: 'Tool Sandbox',
        icon: Wrench,
        metric: 'Policy Guard',
        blurb:
          'Runs filesystem, terminal, and search tools in a sandbox with AST checks and dangerous-command filters.',
      },
      {
        id: 'eval-gate',
        label: 'Eval Gate',
        icon: CheckCircle2,
        metric: 'TDD + Oxlint',
        blurb:
          'Quality gates before merge: red-green test checks, Oxlint static analysis, and diff safety validation.',
      },
      {
        id: 'knowledge',
        label: 'Graph Memory',
        icon: Network,
        metric: 'Graphify Knowledge',
        blurb:
          'Uses the Graphify knowledge graph and vector context to navigate architecture across files.',
      },
      {
        id: 'telemetry',
        label: 'Telemetry Stream',
        icon: Activity,
        metric: 'Live Trace',
        blurb:
          'Streams tool calls, token usage, and subagent state changes over WebSocket to the UI.',
      },
    ],
  },
}

// Backwards-compatible export for existing imports
export const archNodes: ArchNode[] = ARCH_TOPOLOGIES.cdc.nodes

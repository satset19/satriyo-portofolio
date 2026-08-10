import type { LucideIcon } from 'lucide-react'
import {
  GitBranch,
  Smartphone,
  Radio,
  Send,
  Database,
  LayoutDashboard,
  MessagesSquare,
  Wrench,
  Container,
} from 'lucide-react'

export type Category = 'backend' | 'frontend' | 'platform'

export interface Project {
  id: string
  title: string
  category: Category
  icon: LucideIcon
  oneLiner: string
  tags: string[]
  highlights: string[]
}

export const CATEGORY_LABELS: Record<Category, string> = {
  backend: 'Backend',
  frontend: 'Frontend',
  platform: 'Platform & DevOps',
}

export const projects: Project[] = [
  {
    id: 'cdc-pipeline',
    title: 'Realtime CDC Event Pipeline',
    category: 'backend',
    icon: GitBranch,
    oneLiner:
      'Streams PostgreSQL change events to connected browsers in under 200ms — deduplicated, enriched, and fanned out per recipient at 5k+ msg/s per replica.',
    tags: ['Go', 'NATS JetStream', 'Redis', 'PostgreSQL'],
    highlights: [
      'Exactly-once publishing via Redis SETNX dedup keyed on WAL position, surviving stream redelivery.',
      'Hexagonal (ports & adapters) architecture with compile-time dependency injection.',
      'Error classification layer: retryable failures redeliver, data-quality failures are acknowledged to avoid poison-message loops.',
      'Panic guard: a sustained consecutive-failure window triggers controlled shutdown instead of silent data loss.',
      'Schema-agnostic — new tenant schemas need no redeploy thanks to wildcard subject subscription.',
      '20+ Prometheus metrics and a benchmark harness targeting 5k msg/s per replica.',
    ],
  },
  {
    id: 'edge-gateway',
    title: 'WhatsApp Edge Gateway',
    category: 'backend',
    icon: Smartphone,
    oneLiner:
      'A one-container-per-account gateway that keeps persistent messaging sessions alive across pod restarts, with QR pairing and history-sync firehose handling.',
    tags: ['TypeScript', 'Redis', 'JetStream KV', 'Kubernetes'],
    highlights: [
      'Redis-backed session auth state, so pods can be restarted or rescheduled without losing the login.',
      'Handles the historical-sync firehose separately from live traffic to keep the realtime path fast.',
      'JetStream key-value watchers drive broadcast processing; durable consumers handle scheduled sends.',
      'Centralized HMAC-verified webhook receiver fans provider callbacks out by subject-based routing per phone number — one public endpoint for the whole fleet.',
      'OAuth embedded-signup onboarding: code exchange, number registration, and credential provisioning in one flow.',
      'Remote config loaded at boot from a central store, with hot reload.',
    ],
  },
  {
    id: 'ws-gateway',
    title: 'Realtime WebSocket Gateway',
    category: 'backend',
    icon: Radio,
    oneLiner:
      'Cross-pod WebSocket delivery with a Redis route registry, gRPC forwarding behind a circuit breaker, and exclusive sessions enforced by distributed locks.',
    tags: ['Go', 'gRPC', 'Redis', 'WebSocket'],
    highlights: [
      'Route registry records which pod owns each connection; misrouted events are forwarded pod-to-pod over gRPC with connection pooling and a circuit breaker.',
      'Exclusive sessions via distributed locks, with a kill-switch that migrates the session when the same user connects elsewhere.',
      'Adaptive, activity-based TTLs — idle sessions cost less to keep alive.',
      'Backpressure handling, buffered writes, compression, and ping/pong health checks.',
      'Hot config reload via file watch and SIGHUP — retune without a restart.',
      'Dedicated benchmark suites for auth, connection, and message-processing paths with baseline comparison.',
    ],
  },
  {
    id: 'campaign-orchestrator',
    title: 'Outbound Campaign Orchestrator',
    category: 'backend',
    icon: Send,
    oneLiner:
      'Rate-managed, pausable and resumable bulk message scheduling driven by a state machine, with a full delivery-status feedback loop.',
    tags: ['TypeScript', 'Fastify', 'MongoDB', 'Agenda'],
    highlights: [
      'Two dispatch modes: synchronous request/reply for interactive sends, durable stream publishing for batch campaigns.',
      'Broadcast state machine with explicit transitions, driven by scheduled jobs — campaigns can pause, resume, and cancel mid-flight.',
      'Batch consumer ingests task-status updates back from edge workers to close the delivery loop.',
      'Companion ingestion service persists the full inbound event stream with a dead-letter-queue design: retry with backoff, per-tenant DLQ streams, and an exhausted-events table for inspection.',
      'Bloom filters warmed at startup for active-agent deduplication; load-test harness with a mock event generator.',
      'Alerting integration — the messaging platform doubles as a monitoring alert channel.',
    ],
  },
  {
    id: 'data-apis',
    title: 'Multi-Tenant Data & Analytics APIs',
    category: 'backend',
    icon: Database,
    oneLiner:
      'Schema-per-tenant REST APIs and a warehouse-backed analytics API where the bearer token is the encrypted tenant ID itself — AES-GCM, no session store.',
    tags: ['Go', 'PostgreSQL', 'Trino', 'Redis'],
    highlights: [
      'Schema-based multi-tenancy in PostgreSQL; dynamic table-suffix isolation in the distributed SQL warehouse.',
      'Stateless auth: the AES-GCM bearer token decrypts to the tenant identity — a scheme shared consistently across five services.',
      'Header-driven PII masking: phone numbers keep first/last digits, display names masked only when they look like numbers.',
      'Time-bucketed aggregates for message volume, response times, and SLA summaries — read-only by design.',
      'Clean architecture with dependency inversion, in-process caching, and generated OpenAPI docs.',
      'GraphQL read / REST write protocol split on the general data API, with Redis-backed response caching.',
    ],
  },
  {
    id: 'customer-portal',
    title: 'Customer Self-Service Portal',
    category: 'frontend',
    icon: LayoutDashboard,
    oneLiner:
      'A multi-tenant business messaging portal: analytics dashboards, broadcast campaign management, bot automation config, and one-click tenant provisioning.',
    tags: ['React', 'TypeScript', 'TanStack', 'Tailwind CSS'],
    highlights: [
      'Role-based access control with three roles and per-route guards; JWT in HttpOnly cookies verified server-side on every protected load.',
      'Analytics dashboards: message trends, per-sender distribution, broadcast performance, and response-time SLA panels.',
      'Bot automation configuration: onboarding flows, auto-reply, working hours, auto-forward, and history sync.',
      'Task monitoring across three delivery channels with live status; reports exportable to CSV/XLSX.',
      'Form builder with a live viewer, QR device pairing, and embedded API reference docs.',
      'Hybrid architecture: Vite SPA served by an Express layer proxying nine backend services plus a WebSocket feed.',
    ],
  },
  {
    id: 'chat-console',
    title: 'Realtime Agent Chat Console',
    category: 'frontend',
    icon: MessagesSquare,
    oneLiner:
      'A live agent inbox with optimistic sends, delivery-status reconciliation, infinite scroll, and an LRU message cache — fully rewritten from a legacy framework with behavioral parity.',
    tags: ['React', 'Zustand', 'WebSocket', 'Vite'],
    highlights: [
      'Two-pane realtime workspace: conversation stream with search, filters, and IntersectionObserver infinite scroll beside a full message thread.',
      'Optimistic sending with status reconciliation once the server confirms delivery.',
      'Migrated a legacy UmiJS application to Vite + React with enforced behavioral parity — WebSocket lifecycle ported verbatim.',
      'Session hygiene: idle auto-logout, background revalidation, and a conflict dialog when the account signs in elsewhere.',
      'Rich text sanitized with DOMPurify; image paste and file upload with per-type previews.',
      'Client-side LRU message cache avoids refetching threads; notification sounds on inbound messages.',
    ],
  },
  {
    id: 'ops-console',
    title: 'Internal Operations Console',
    category: 'frontend',
    icon: Wrench,
    oneLiner:
      'A staff back-office for fleet monitoring with per-instance drill-down, cluster and container inspection, and campaign auditing.',
    tags: ['React', 'Ant Design', 'i18n'],
    highlights: [
      'Agent fleet monitoring with list, table, and card views, filters, and per-agent detail drill-down.',
      'Cluster and container inspection down to individual sender instances.',
      'Broadcast and mailing-campaign auditing with per-batch task detail.',
      'Bilingual interface (English/Indonesian) with full locale switching.',
      'User management, reporting, and an FAQ knowledge base for the operations team.',
    ],
  },
  {
    id: 'k8s-platform',
    title: 'Kubernetes Delivery Platform',
    category: 'platform',
    icon: Container,
    oneLiner:
      'One umbrella Helm chart shipping ~12 services to 6 environments with zero-duplication config — plus a control-plane API that turns tenant onboarding into a single API call.',
    tags: ['Kubernetes', 'Helm', 'GitLab CI', 'Prometheus'],
    highlights: [
      'Helmfile-driven umbrella chart rendered into six environments (three isolation tiers × dev/prod) from per-environment values only — every subchart values file is intentionally empty.',
      'Control-plane API provisions and tears down per-tenant workloads programmatically, including per-tenant Redis.',
      'Shared CI template inherited by every service: commit linting → semantic-release → three Docker build variants → namespace-discovering rollout.',
      'Cluster-wide PodMonitors pick up dynamically created tenant pods; alert rules organized by SLO boundary with runbook annotations.',
      'Clustered NATS JetStream (3 replicas, memory + file store) and Redis managed as stateful services with tuned limits.',
      'Generic deployment template: graceful WebSocket drain (preStop sleep + 45s grace), downward-API injection, polymorphic volumes.',
      'Hierarchical secrets broker API over a vault backend: global, tenant, and instance-scoped paths.',
    ],
  },
]

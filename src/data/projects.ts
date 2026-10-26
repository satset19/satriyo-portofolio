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
  Bot,
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
      'Gets database changes onto agent screens in under 200ms at P95. Satriyo built the Go service that turns PostgreSQL WAL events into deduplicated, per-recipient updates, designed for 5k msg/s per replica.',
    tags: ['Go', 'NATS JetStream', 'Redis', 'PostgreSQL', 'Prometheus'],
    highlights: [
      'Problem: agents needed new messages on screen in realtime, and stream redelivery was producing duplicates.',
      'Exactly-once publishing with Redis SETNX keys on the WAL position, so redelivered events are dropped.',
      'Error classification: retryable failures redeliver, bad-data failures are acknowledged to stop poison-message loops.',
      'Panic guard shuts the service down in a controlled way after sustained consecutive failures instead of losing data silently.',
      'Wildcard subject subscriptions: new tenant schemas go live with no redeploy.',
      'Impact: under 200ms commit-to-screen at P95, 20+ Prometheus metrics, and a benchmark harness for the 5k msg/s per-replica target.',
    ],
  },
  {
    id: 'edge-gateway',
    title: 'WhatsApp Edge Gateway',
    category: 'backend',
    icon: Smartphone,
    oneLiner:
      'Keeps WhatsApp sessions logged in through pod restarts. Satriyo built a one-container-per-account gateway with Redis-backed auth state, QR pairing, and a separate path for history sync.',
    tags: ['TypeScript', 'Redis', 'NATS JetStream', 'Kubernetes'],
    highlights: [
      'Problem: a pod restart or reschedule logged accounts out, and bulk history sync slowed live traffic.',
      'Session auth state stored in Redis, so pods can restart or move without losing the login.',
      'History sync runs separately from live traffic to keep the realtime path fast.',
      'JetStream key-value watchers drive broadcasts; durable consumers handle scheduled sends.',
      'One HMAC-verified webhook endpoint for the whole fleet, routing provider callbacks by phone-number subject.',
      'Impact: account onboarding (OAuth code exchange, number registration, credential provisioning) runs as one flow, with remote config hot-reloaded at boot.',
    ],
  },
  {
    id: 'ws-gateway',
    title: 'Realtime WebSocket Gateway',
    category: 'backend',
    icon: Radio,
    oneLiner:
      'Delivers each event to the right socket no matter which pod holds it. Satriyo built a Go gateway with a Redis route registry, gRPC pod-to-pod forwarding, and one active session per user.',
    tags: ['Go', 'gRPC', 'Redis', 'WebSocket'],
    highlights: [
      'Problem: with many gateway pods, events often reached a pod that did not hold the recipient connection.',
      'Redis route registry maps each connection to its pod; misrouted events forward over pooled gRPC behind a circuit breaker.',
      'Distributed locks enforce one session per user and move the session when the user connects elsewhere.',
      'Activity-based TTLs make idle sessions cheaper to keep alive.',
      'Backpressure handling, buffered writes, compression, and ping/pong health checks.',
      'Impact: config retunes through file watch or SIGHUP with no restart, and benchmark suites compare auth, connection, and message paths against a baseline.',
    ],
  },
  {
    id: 'campaign-orchestrator',
    title: 'Outbound Campaign Orchestrator',
    category: 'backend',
    icon: Send,
    oneLiner:
      'Lets operators pause, resume, or cancel bulk campaigns mid-send. Satriyo built a state-machine scheduler with rate limits and a delivery-status feedback loop from the edge workers.',
    tags: ['TypeScript', 'Fastify', 'MongoDB', 'Agenda'],
    highlights: [
      'Problem: bulk sends had no safe way to stop mid-flight and no confirmation of what was delivered.',
      'Two dispatch modes: request/reply for interactive sends, durable stream publishing for batch campaigns.',
      'Broadcast state machine with explicit transitions, driven by scheduled jobs.',
      'Batch consumer reads task-status updates from edge workers to close the delivery loop.',
      'Ingestion service with a dead-letter design: retry with backoff, per-tenant DLQ streams, and a table of exhausted events for inspection.',
      'Impact: failed events stay inspectable instead of disappearing, and the messaging platform also serves as the monitoring alert channel.',
    ],
  },
  {
    id: 'data-apis',
    title: 'Multi-Tenant Data & Analytics APIs',
    category: 'backend',
    icon: Database,
    oneLiner:
      'Serves tenant data and analytics without a session store. Satriyo built schema-per-tenant REST APIs and a Trino-backed analytics API where the AES-GCM bearer token decrypts to the tenant ID.',
    tags: ['Go', 'PostgreSQL', 'Trino', 'Redis', 'GraphQL'],
    highlights: [
      'Problem: many tenants shared one platform and needed isolated data, fast reporting, and PII protection.',
      'Schema-per-tenant PostgreSQL, with table-suffix isolation in the Trino warehouse.',
      'Stateless AES-GCM bearer tokens that decrypt to the tenant identity, shared across five services.',
      'Header-driven PII masking: phone numbers keep only the first and last digits; display names are masked when they look like numbers.',
      'Read-only, time-bucketed aggregates for message volume, response times, and SLA summaries.',
      'Impact: one auth scheme across five services, GraphQL reads and REST writes with Redis response caching, and generated OpenAPI docs.',
    ],
  },
  {
    id: 'customer-portal',
    title: 'Customer Self-Service Portal',
    category: 'frontend',
    icon: LayoutDashboard,
    oneLiner:
      'Lets business customers run messaging on their own. Satriyo built the portal for analytics, broadcast campaigns, bot automation, and one-click tenant provisioning.',
    tags: ['React', 'TypeScript', 'TanStack', 'Tailwind CSS', 'Express'],
    highlights: [
      'Problem: customers needed to manage campaigns, bots, and reports without filing support requests.',
      'Three-role access control with per-route guards; JWT in HttpOnly cookies, verified server-side on every protected load.',
      'Dashboards for message trends, per-sender distribution, broadcast performance, and response-time SLAs.',
      'Bot configuration for onboarding flows, auto-reply, working hours, auto-forward, and history sync.',
      'Task monitoring across three delivery channels with live status and CSV/XLSX export.',
      'Impact: customers self-serve through one Vite SPA, served by an Express layer that proxies nine backend services plus a live WebSocket feed.',
    ],
  },
  {
    id: 'chat-console',
    title: 'Realtime Agent Chat Console',
    category: 'frontend',
    icon: MessagesSquare,
    oneLiner:
      'Moved the live agent inbox off a legacy framework with no behavior change. Satriyo rewrote it in Vite and React with optimistic sends, delivery-status reconciliation, and an LRU message cache.',
    tags: ['React', 'Zustand', 'WebSocket', 'Vite'],
    highlights: [
      'Problem: the agent inbox ran on legacy UmiJS and had to be migrated without disrupting agents.',
      'Two-pane workspace: searchable, filterable conversation list with infinite scroll next to the full thread.',
      'Optimistic sends that reconcile status once the server confirms delivery.',
      'Session handling: idle auto-logout, background revalidation, and a conflict dialog when the account signs in elsewhere.',
      'DOMPurify-sanitized rich text, image paste, and file upload with per-type previews.',
      'Impact: behavioral parity with the legacy app (WebSocket lifecycle ported line for line), and the LRU cache avoids refetching open threads.',
    ],
  },
  {
    id: 'ops-console',
    title: 'Internal Operations Console',
    category: 'frontend',
    icon: Wrench,
    oneLiner:
      'Gives the operations team one place to monitor the sender fleet. Satriyo built a back-office with per-instance drill-down, cluster and container inspection, and campaign auditing.',
    tags: ['React', 'Ant Design', 'i18n'],
    highlights: [
      'Problem: staff had no single view of agent instances, containers, and campaign batches.',
      'Fleet monitoring in list, table, and card views with filters and per-agent detail.',
      'Cluster and container inspection down to individual sender instances.',
      'Broadcast and mailing-campaign auditing with per-batch task detail.',
      'Impact: one bilingual (English and Indonesian) console covering monitoring, user management, reporting, and an FAQ knowledge base.',
    ],
  },
  {
    id: 'k8s-platform',
    title: 'Kubernetes Delivery Platform',
    category: 'platform',
    icon: Container,
    oneLiner:
      'Ships about 12 services to 6 environments from one Helm chart with no duplicated config. Satriyo also built the control-plane API that turns tenant onboarding into a single API call.',
    tags: ['Kubernetes', 'Helm', 'GitLab CI', 'Prometheus', 'NATS JetStream'],
    highlights: [
      'Problem: deploying many services to several environments meant copied config and manual tenant setup.',
      'Helmfile umbrella chart rendered into six environments (three isolation tiers, dev and prod) from per-environment values only.',
      'Shared GitLab CI template: commit linting, semantic-release, three Docker build variants, and a rollout that discovers namespaces.',
      'PodMonitors pick up new tenant pods automatically; alert rules grouped by SLO with runbook annotations.',
      'Clustered NATS JetStream (3 replicas) and Redis run as tuned stateful services; WebSocket pods drain gracefully with a 45s grace period.',
      'Impact: tenant workloads, including per-tenant Redis, are provisioned and torn down by API, with secrets scoped globally, per tenant, or per instance.',
    ],
  },
  {
    id: 'agent-orchestrator',
    title: 'Autonomous Multi-Agent AI Orchestrator',
    category: 'backend',
    icon: Bot,
    oneLiner:
      'Runs up to 10 AI subagents in parallel with sandboxed tools. Satriyo built the runtime: task dispatch, tool policy checks, streaming LLM inference, and live WebSocket telemetry.',
    tags: ['Go', 'TypeScript', 'LLM APIs', 'Docker', 'WebSocket'],
    highlights: [
      'Problem: multi-step engineering tasks needed parallel AI workers without unchecked shell access.',
      'Dispatcher runs up to 10 subagents, each with its own isolated conversation context.',
      'Sandboxed tool layer with policy interception, AST safety checks, and dangerous-command blocking.',
      'WebSocket gateway streams reasoning tokens, tool calls, and lifecycle events with backpressure control.',
      'Memory combines local vector retrieval (RAG) with SQLite session storage; schema validation retries malformed API responses a bounded number of times.',
      'Impact: parallel agent work with guarded tool access, visible live in a 3D office view that shows each agent and its current task.',
    ],
  },
]

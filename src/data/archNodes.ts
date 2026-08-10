import type { LucideIcon } from 'lucide-react'
import {
  Smartphone,
  Server,
  Waypoints,
  Database,
  GitBranch,
  Radio,
  MonitorSmartphone,
} from 'lucide-react'

export interface ArchNode {
  id: string
  label: string
  icon: LucideIcon
  blurb: string
}

export const archNodes: ArchNode[] = [
  {
    id: 'device',
    label: 'Device',
    icon: Smartphone,
    blurb: "A customer's phone sends a message.",
  },
  {
    id: 'edge',
    label: 'Edge Gateway',
    icon: Server,
    blurb:
      'A dedicated per-account container holds the persistent session and normalizes every event.',
  },
  {
    id: 'bus',
    label: 'Event Bus',
    icon: Waypoints,
    blurb:
      'A clustered streaming bus (NATS JetStream) with subject-based tenant isolation.',
  },
  {
    id: 'persistence',
    label: 'Persistence',
    icon: Database,
    blurb:
      'Validated events land in per-tenant PostgreSQL schemas; failures route to a dead-letter queue.',
  },
  {
    id: 'cdc',
    label: 'CDC Processor',
    icon: GitBranch,
    blurb:
      'Database commits become change events — deduplicated exactly-once and enriched with routing metadata.',
  },
  {
    id: 'realtime',
    label: 'Realtime Gateway',
    icon: Radio,
    blurb:
      'Routes each event to the right browser across pods via a route registry — WebSocket all the way.',
  },
  {
    id: 'browser',
    label: 'Browser',
    icon: MonitorSmartphone,
    blurb:
      'The agent sees the message. Commit-to-screen latency: under 200ms at P95.',
  },
]

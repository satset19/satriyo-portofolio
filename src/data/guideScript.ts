import type { Page } from '../router'

export const GUIDE_LINES: Record<Page, string> = {
  spawn:
    "Welcome to Satriyo's world. He builds backend and infrastructure for realtime messaging, microservices, and multi-agent AI. Press 1-7 or use the hotbar to travel.",
  pipeline:
    'The redstone rail. Follow one message from device to browser in under 200ms at P95. Hover a station to see what it does.',
  quests:
    'The quest log. Each card is a shipped system: problem, what Satriyo built, and the result. Open one for details.',
  skills:
    'The skill tree. Languages, distributed systems, AI agents, frontend, and Kubernetes infrastructure, grouped by area.',
  lore:
    "Satriyo's engineering principles: idempotent pipelines, clear failure modes, and systems that stay quiet at 3 AM.",
  arcade:
    'Voxel Miner: Ore Rush. Dig, chain ore combos, and avoid the TNT. A break from the resume.',
  contact:
    'Hiring for backend or platform work? Send an email, copy the address, or check GitHub.',
}

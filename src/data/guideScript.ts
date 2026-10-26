import type { Page } from '../router'

export const GUIDE_LINES: Record<Page, string> = {
  spawn:
    "Hey, welcome traveler! I'm your guide in Satriyo's world. Press 1-6 or click the hotbar to teleport, mine the voxel blocks around you, and explore battle-tested systems built for scale. Ready for the tour?",
  pipeline:
    'The redstone telemetry line! Trace a single packet from mobile edge through Go gateways, Kafka queues, worker pods, and WebSockets to the browser in <200ms. Hover each station to inspect the mechanics.',
  quests:
    'The quest log! Shipped production beasts: autonomous multi-agent AI orchestrators, 5k msg/s messaging engines, and zero-downtime K8s platforms. Tap any quest card to inspect architectural deep-dives.',
  skills:
    'The master skill tree! Every weapon in the arsenal: Go, TypeScript, Kubernetes, Kafka, Redis, and React. Graded from battle-hardened core proficiencies to cutting-edge AI toolchains.',
  lore:
    "The engineering grimoire: Satriyo's architectural philosophy. Idempotent pipelines, graceful failure modes, zero magic, and systems that won't page you at 3 AM. Essential reading for architects.",
  arcade:
    "Welcome to Voxel Miner: Ore Rush! Dig deep into procedural caverns, chain ore combos, dodge hazardous TNT, and trigger dynamites. Let's see how deep you can delve!",
  contact:
    "Direct comms beacon reached! Dispatch an email, copy coordinates, or ping Satriyo's GitHub to recruit him for your server. Let's forge high-throughput infrastructure together!",
}

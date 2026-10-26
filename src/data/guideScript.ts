import type { Page } from '../router'

export const GUIDE_LINES: Record<Page, string> = {
  spawn:
    "Hey, welcome! I'm the guide around here. This world is Satriyo's portfolio — press 1-6 or use the hotbar to travel, and try clicking the blocks around you. Ready for the tour?",
  pipeline:
    'This is the redstone line: follow one message from a phone all the way to the browser. It arrives in under 200 milliseconds — hover the stations to see each stage.',
  quests:
    'The quest log! Ten shipped systems across backend, AI orchestration, frontend, and platform. Click any card to read the full story behind it.',
  skills: 'The skill tree — every language, framework, and tool used to complete those quests.',
  lore: 'A bit of lore: how Satriyo thinks about building software. Short read, worth it.',
  contact:
    "That's the whole tour! If you want him on your server, send a message — the address is right here.",
}

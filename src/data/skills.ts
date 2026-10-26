export interface SkillCategory {
  title: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Languages',
    skills: ['Go', 'TypeScript', 'JavaScript', 'Python', 'SQL'],
  },
  {
    title: 'Backend & Distributed Systems',
    skills: [
      'NATS JetStream',
      'gRPC',
      'WebSocket',
      'Fastify',
      'Fiber',
      'GraphQL',
      'REST APIs',
      'CDC pipelines',
    ],
  },
  {
    title: 'AI & Autonomous Systems',
    skills: [
      'Multi-Agent Orchestration',
      'Tool Execution Engines',
      'Prompt Workflows',
      'LLM APIs & Streaming',
      'Vector Stores & Embeddings',
      'RAG Architectures',
    ],
  },
  {
    title: 'Frontend & 3D Web',
    skills: [
      'React 19',
      'Three.js / React Three Fiber',
      'Vite',
      'TanStack Router/Query',
      'Zustand',
      'Tailwind CSS',
      'shadcn/ui',
    ],
  },
  {
    title: 'Data, Platform & Infrastructure',
    skills: [
      'PostgreSQL',
      'Redis',
      'MongoDB',
      'Trino',
      'Kubernetes',
      'Docker',
      'Helm / Helmfile',
      'GitLab CI',
      'Prometheus / Grafana',
    ],
  },
]

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
      'Express',
      'REST',
      'Change Data Capture (CDC)',
    ],
  },
  {
    title: 'AI & Autonomous Systems',
    skills: [
      'Multi-Agent Orchestration',
      'Sandboxed Tool Execution',
      'Prompt Engineering',
      'LLM APIs and Streaming',
      'Vector Search and Embeddings',
      'RAG',
    ],
  },
  {
    title: 'Frontend & 3D Web',
    skills: [
      'React',
      'Three.js and React Three Fiber',
      'Vite',
      'TanStack Router and Query',
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
      'SQLite',
      'Kubernetes',
      'Docker',
      'Helm and Helmfile',
      'GitLab CI',
      'Prometheus and Grafana',
    ],
  },
]

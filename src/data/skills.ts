export interface SkillCategory {
  title: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Languages',
    skills: ['Go', 'TypeScript', 'JavaScript', 'SQL'],
  },
  {
    title: 'Backend & Messaging',
    skills: [
      'NATS JetStream',
      'gRPC',
      'WebSocket',
      'Fastify',
      'Fiber',
      'GraphQL',
      'REST',
      'CDC pipelines',
    ],
  },
  {
    title: 'Frontend',
    skills: [
      'React',
      'Vite',
      'TanStack Router/Query',
      'Zustand',
      'Tailwind CSS',
      'shadcn/ui',
      'Ant Design',
    ],
  },
  {
    title: 'Data & Infrastructure',
    skills: [
      'PostgreSQL',
      'Redis',
      'MongoDB',
      'Trino',
      'Kubernetes',
      'Helm / Helmfile',
      'GitLab CI',
      'Prometheus / Grafana',
    ],
  },
]

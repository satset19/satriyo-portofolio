export interface Stat {
  value: number
  prefix?: string
  suffix?: string
  label: string
}

export const stats: Stat[] = [
  { value: 12, suffix: '+', label: 'Backend services' },
  { value: 3, label: 'Frontend products' },
  { value: 6, label: 'Deployment environments' },
  { value: 200, prefix: '<', suffix: 'ms', label: 'P95 pipeline latency' },
]

export interface Stat {
  value: number
  prefix?: string
  suffix?: string
  label: string
}

export const stats: Stat[] = [
  { value: 15, suffix: '+', label: 'Backend & Agent services' },
  { value: 4, label: 'Frontend & 3D apps' },
  { value: 6, label: 'Deployment environments' },
  { value: 200, prefix: '<', suffix: 'ms', label: 'P95 pipeline latency' },
]

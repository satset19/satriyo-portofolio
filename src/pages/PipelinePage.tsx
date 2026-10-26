import { useState } from 'react'
import { Section } from '../components/Section'
import { ArchitectureFlow } from '../components/ArchitectureFlow'
import { AgentSimulator } from '../components/AgentSimulator'
import type { ArchTopology } from '../data/archNodes'

export function PipelinePage() {
  const [activeTopology, setActiveTopology] = useState<ArchTopology>('cdc')

  return (
    <Section
      id="pipeline"
      kicker="Distributed architecture & multi-agent execution"
      title="How packets travel & agents reason: real-time topologies"
    >
      <div className="space-y-6">
        {/* Multi-Topology Visualizer */}
        <ArchitectureFlow
          initialTopology={activeTopology}
          onTopologyChange={setActiveTopology}
        />

        {/* Live Multi-Agent Telemetry & Tool Calling Simulator */}
        <AgentSimulator />
      </div>
    </Section>
  )
}

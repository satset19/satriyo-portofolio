import { Section } from '../components/Section'
import { ArchitectureFlow } from '../components/ArchitectureFlow'

export function PipelinePage() {
  return (
    <Section
      id="pipeline"
      kicker="System architecture"
      title="How a message travels — the redstone line"
    >
      <ArchitectureFlow />
    </Section>
  )
}

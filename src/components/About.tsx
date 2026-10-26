export function About() {
  return (
    <div className="grid max-w-3xl gap-6 text-xl leading-snug text-slate-300">
      <p className="leading-relaxed">
        I pick languages for what they&apos;re good at:{' '}
        <span className="text-text">Go where throughput and latency matter</span> — event
        pipelines, realtime gateways, query APIs —{' '}
        <span className="text-text">TypeScript at the protocol edge</span> where ecosystems live,
        and <span className="text-text">React where people do their work</span>.
      </p>
      <p className="leading-relaxed">
        Multi-tenancy is a design axis, not an afterthought. Across one platform I&apos;ve
        implemented it three ways: schema-per-tenant in PostgreSQL, table-suffix isolation in the
        analytics warehouse, and subject-based isolation on the message bus — with a single
        encrypted-tenant-token scheme shared consistently across five services.
      </p>
      <p className="leading-relaxed">
        I treat the platform around the code as part of the product: 60+ maintained architecture
        docs with owners and freshness tracking, SLO-organized alert rules with runbooks, and a
        shared CI pipeline every service inherits instead of copies.
      </p>
      <p className="leading-relaxed">
        Beyond raw message plumbing, I architect autonomous multi-agent runtimes and LLM tooling
        pipelines: dispatching concurrent subagent workflows, enforcing strict schema validation
        gates, and serving low-latency streaming back to user interfaces without sacrificing
        reliability.
      </p>
    </div>
  )
}

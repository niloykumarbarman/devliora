import { DASHBOARD_METRICS, type DashboardMetric } from "@/lib/cloudDevops";
import Reveal from "@/components/Reveal";

function Sparkline({ series, warn }: { series: number[]; warn: boolean }) {
  const width = 100;
  const height = 40;
  const max = Math.max(...series, 1);
  const min = Math.min(...series, 0);
  const span = max - min || 1;
  const points = series.map((v, i) => {
    const x = (i / (series.length - 1)) * width;
    const y = height - ((v - min) / span) * (height - 4) - 2;
    return [x, y] as const;
  });
  const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `0,${height} ${line} ${width},${height}`;
  const stroke = warn ? "var(--color-ember)" : "var(--color-signal)";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="h-10 w-full"
      aria-hidden
    >
      <polygon points={area} fill={stroke} opacity={0.14} />
      <polyline
        points={line}
        fill="none"
        stroke={stroke}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function MetricTile({ metric, index }: { metric: DashboardMetric; index: number }) {
  const Icon = metric.icon;
  const warn = metric.status === "warn";

  return (
    <Reveal
      delay={(index % 4) * 0.05}
      className="rounded-sm border border-paper/10 bg-graphite/30 p-4"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-paper/55">
          <Icon className="h-3.5 w-3.5" strokeWidth={2} />
          {metric.label}
        </span>
        <span
          className={`flex items-center gap-1 font-mono text-[0.65rem] font-semibold uppercase ${
            warn ? "text-ember" : "text-signal"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${warn ? "bg-ember" : "bg-signal"}`}
          />
          {warn ? "Watch" : "OK"}
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-semibold text-paper">{metric.value}</p>
      <p className="text-xs text-paper/50">{metric.caption}</p>
      <div className="mt-3">
        <Sparkline series={metric.series} warn={warn} />
      </div>
    </Reveal>
  );
}

export default function MonitoringDashboard() {
  return (
    <section
      id="monitoring-dashboard"
      className="bg-grain relative scroll-mt-24 overflow-hidden bg-ink text-paper"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-10%] left-[-10%] h-[440px] w-[440px] rounded-full bg-ember/12 blur-[140px] animate-ambient-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.paper/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.paper/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-signal">
            Monitoring &amp; Observability
          </p>
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            The view we build for <span className="text-signal">every system we run</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70">
            Golden signals and capacity on one screen, backed by Prometheus, Grafana
            and Loki.
          </p>
        </Reveal>

        <div className="mt-10 rounded-lg border border-paper/10 bg-ink/60 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-paper/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-signal" />
              <span className="font-mono text-xs uppercase tracking-widest text-paper/60">
                Cluster overview
              </span>
            </div>
            <span className="rounded-full border border-ember/30 bg-ember/10 px-3 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-wide text-ember">
              Illustrative demo · not connected to live infrastructure
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DASHBOARD_METRICS.map((metric, i) => (
              <MetricTile key={metric.label} metric={metric} index={i} />
            ))}
          </div>
        </div>

        <p className="mt-4 font-mono text-xs text-paper/55">
          Values shown are sample data for layout purposes. The component takes plain
          numbers and would render a live Prometheus feed the same way.
        </p>
      </div>
    </section>
  );
}

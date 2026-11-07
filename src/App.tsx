import { useState } from "react";
import { useDashboardFeed } from "./features/dashboard/hooks/useDashboardFeed";
import { useConnectionStatus } from "./features/dashboard/selectors/connectionSelectors";
import { useEvents } from "./features/dashboard/selectors/eventSelectors";
import { useMetric } from "./features/dashboard/selectors/metricSelectors";
import { KpiCard } from "./features/dashboard/components/KpiCard";
import { EventFeed } from "./features/dashboard/components/EventFeed";

function App() {
  const { pause, resume } = useDashboardFeed();

  // YENİ: Pause durumunu React state'inde tutuyoruz
  const [isPaused, setIsPaused] = useState(false);

  const status = useConnectionStatus();
  const cpu = useMetric("cpu");
  const memory = useMetric("memory");
  const requests = useMetric("requests");
  const latency = useMetric("latency");
  const events = useEvents();

  const statusConfig = {
    connecting: { color: "bg-yellow-500", text: "Connecting" },
    open: { color: "bg-green-500", text: "Live" },
    reconnecting: { color: "bg-orange-500", text: "Reconnecting" },
    closed: { color: "bg-red-500", text: "Disconnected" },
  }[status];

  const handleTogglePause = () => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
    setIsPaused(!isPaused);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Pulseboard
          </h1>
          <p className="text-slate-400 mt-1">Real-Time System Telemetry</p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${statusConfig.color} animate-pulse`}
            />
            <span className="text-sm font-medium text-slate-300">
              {statusConfig.text}
            </span>
          </div>
          <div className="w-px h-6 bg-slate-700 mx-2" />
          <button
            onClick={handleTogglePause}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            {isPaused ? "Resume Data" : "Pause Data"}
          </button>
        </div>
      </header>

      {/* KPI Grid (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="CPU Usage"
          value={cpu.current}
          unit="%"
          history={cpu.history}
          color="#3b82f6"
        />
        <KpiCard
          title="Memory"
          value={memory.current}
          unit="MB"
          history={memory.history}
          color="#8b5cf6"
        />
        <KpiCard
          title="Requests / sec"
          value={requests.current}
          unit="req"
          history={requests.history}
          color="#10b981"
        />
        <KpiCard
          title="Latency"
          value={latency.current}
          unit="ms"
          history={latency.history}
          color="#f59e0b"
        />
      </div>

      {/* Event Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <EventFeed events={events} />
        </div>
      </div>
    </div>
  );
}

export default App;

import type { EventLog } from "../../../protocol/messages";

interface EventFeedProps {
  events: EventLog["payload"][];
}

export function EventFeed({ events }: EventFeedProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm h-80 flex flex-col">
      <h2 className="text-slate-400 text-sm font-medium mb-4">Live Events</h2>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {events.length === 0 ? (
          <p className="text-slate-500 text-sm italic">Waiting for events...</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="flex gap-3 text-sm border-b border-slate-800/50 pb-2"
            >
              <span
                className={`font-mono text-xs px-2 py-0.5 rounded h-fit ${
                  event.level === "error"
                    ? "bg-red-500/10 text-red-400"
                    : event.level === "warn"
                      ? "bg-orange-500/10 text-orange-400"
                      : "bg-blue-500/10 text-blue-400"
                }`}
              >
                {event.level.toUpperCase()}
              </span>
              <span className="text-slate-300 flex-1">{event.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

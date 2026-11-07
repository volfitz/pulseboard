import { useEffect, useRef } from "react";
import { WebSocketTransport } from "../../../transport/WebSocketTransport";
import { IngestPipeline } from "../ingest/IngestPipeline";
import { useConnectionStore } from "../store/connectionStore";

/**
 * Custom hook to manage the lifecycle of the WebSocket connection and Ingest Pipeline.
 * Must be called exactly once at the top of the Dashboard component tree.
 */
export function useDashboardFeed() {
  // We use refs to keep the instances stable across renders
  const transportRef = useRef<WebSocketTransport | null>(null);
  const pipelineRef = useRef<IngestPipeline | null>(null);

  useEffect(() => {
    // 1. Initialize instances
    const transport = new WebSocketTransport();
    const pipeline = new IngestPipeline();

    transportRef.current = transport;
    pipelineRef.current = pipeline;

    // 2. Wire Transport -> Store (Connection Status)
    transport.onStatusChange((status) => {
      useConnectionStore.getState().setStatus(status);
    });

    // 3. Wire Transport -> Pipeline (Data)
    transport.onMessage((rawMessage) => {
      useConnectionStore.getState().markMessageReceived();
      pipeline.ingest(rawMessage);
    });

    // 4. Start the pipeline (batch flush timer)
    pipeline.start();

    // 5. Connect the transport
    transport.connect();

    // 6. Cleanup function (called on unmount)
    return () => {
      transport.disconnect();
      pipeline.stop();
      transportRef.current = null;
      pipelineRef.current = null;
    };
  }, []); // Empty dependency array ensures this runs only on mount/unmount

  // Optional: Expose pause/resume methods for the UI Toolbar
  const pause = () => pipelineRef.current?.pause();
  const resume = () => pipelineRef.current?.resume();

  return { pause, resume };
}

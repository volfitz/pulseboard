import type { Transport, ConnectionStatus } from "./Transport";
import { calculateBackoff } from "../shared/lib/backoff";
import { WS_URL } from "../shared/config/constants";

export class WebSocketTransport implements Transport {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private manualDisconnect = false;

  private messageCallbacks: Array<(raw: string) => void> = [];
  private statusCallbacks: Array<(status: ConnectionStatus) => void> = [];

  connect(): void {
    this.manualDisconnect = false;
    this.cleanup();
    this.updateStatus(
      this.reconnectAttempts > 0 ? "reconnecting" : "connecting",
    );

    try {
      this.ws = new WebSocket(WS_URL);
    } catch (err) {
      console.error("[Transport] WebSocket creation failed", err);
      this.handleReconnect();
      return;
    }

    this.ws.onopen = () => {
      console.log("[Transport] Connected");
      this.reconnectAttempts = 0; // Reset on successful connection
      this.updateStatus("open");
    };

    this.ws.onmessage = (event) => {
      if (typeof event.data === "string") {
        this.messageCallbacks.forEach((cb) => cb(event.data));
      }
    };

    this.ws.onclose = () => {
      if (!this.manualDisconnect) {
        this.handleReconnect();
      } else {
        this.updateStatus("closed");
      }
    };

    this.ws.onerror = (err) => {
      console.error("[Transport] WebSocket error", err);
      // 'onclose' will trigger right after this, so we don't need to handle reconnect here
    };
  }

  disconnect(): void {
    this.manualDisconnect = true;
    this.cleanup();
    this.updateStatus("closed");
  }

  onMessage(callback: (rawMessage: string) => void): void {
    this.messageCallbacks.push(callback);
  }

  onStatusChange(callback: (status: ConnectionStatus) => void): void {
    this.statusCallbacks.push(callback);
  }

  private handleReconnect(): void {
    this.updateStatus("reconnecting");
    const delay = calculateBackoff(this.reconnectAttempts);
    console.log(
      `[Transport] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1})`,
    );

    this.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private cleanup(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      // Remove handlers to prevent double-firing on close
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.close();
      this.ws = null;
    }
  }

  private updateStatus(status: ConnectionStatus): void {
    this.statusCallbacks.forEach((cb) => cb(status));
  }
}

export type ConnectionStatus =
  | "connecting"
  | "open"
  | "reconnecting"
  | "closed";

export interface Transport {
  connect(): void;
  disconnect(): void;
  onMessage(callback: (rawMessage: string) => void): void;
  onStatusChange(callback: (status: ConnectionStatus) => void): void;
}

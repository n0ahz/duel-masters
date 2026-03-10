export interface SocketPayloadInterface<T = any> {
  gameRoom?: string;
  data?: T;
}

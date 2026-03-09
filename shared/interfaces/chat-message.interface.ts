export interface ChatMessageInterface {
  id?: string;
  gameId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date | string;
  isLog: boolean;
}

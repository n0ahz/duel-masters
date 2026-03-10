/** Commands: the client sends these to the server */
export enum CommonCommandsEnum {
  MSG_TO_SERVER = 'msgToServer',
}

/** Events: the server emits these to clients */
export enum CommonEventsEnum {
  MSG_TO_CLIENT = 'msgToClient',
}

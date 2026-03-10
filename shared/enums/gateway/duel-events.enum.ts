/** Commands: the client sends these to the server */
export enum DuelCommandsEnum {
  SET_UP        = 'setUp',
  IKUJO         = 'ikujo',
  KOI           = 'koi',
  DROP_CARDS    = 'dropCards',
  TAP_UNTAP_CARD = 'tapUntapCard',
}

/** Events: the server emits these to clients */
export enum DuelEventsEnum {
  ALL_SET       = 'allSet',
  IKUJO         = 'ikujo',
  KOI           = 'koi',
  DROP_CARDS    = 'dropCards',
  TAP_UNTAP_CARD = 'tapUntapCard',
}

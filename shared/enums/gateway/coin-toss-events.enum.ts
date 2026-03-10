/** Commands: the client sends these to the server */
export enum CoinTossCommandsEnum {
  COIN_SIDE_CHOSEN    = 'coinSideChosen',
  COIN_FLIPPED        = 'coinFlipped',
  DUEL_DECISION_MADE  = 'duelDecisionMade',
}

/** Events: the server emits these to clients */
export enum CoinTossEventsEnum {
  SET_COIN_SIDE     = 'setCoinSide',
  START_COIN_FLIP   = 'startCoinFlip',
  SET_DUEL_DECISION = 'setDuelDecision',
}

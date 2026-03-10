/** Commands: the client sends these to the server */
export enum GamesCommandsEnum {
  ADD_GAME        = 'addGame',
  GET_GAME        = 'getGame',
  GET_GAMES       = 'getGames',
  JOIN_GAME       = 'joinGame',
  LEAVE_GAME      = 'leaveGame',
  CHALLENGE       = 'challenge',
  SET_FIRST_TO_GO = 'setFirstToGo',
  START_DUEL      = 'startDuel',
}

/** Events: the server emits these to clients */
export enum GamesEventsEnum {
  GAMES_LIST     = 'gamesList',
  GAME_INFO      = 'gameInfo',
  USER_INFO      = 'userInfo',
  SET_CHALLENGER = 'setChallenger',
  INVITER_LEFT   = 'inviterLeft',
  DUEL           = 'duel',
  RESET_GAME     = 'resetGame',
}

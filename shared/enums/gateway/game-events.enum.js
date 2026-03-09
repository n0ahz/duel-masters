"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameEvents = void 0;
var GameEvents;
(function (GameEvents) {
    GameEvents["GAME_CREATED"] = "game_created";
    GameEvents["GAMES_LIST"] = "games_list";
    GameEvents["GAME_JOINED"] = "game_joined";
    GameEvents["GAME_LEFT"] = "game_left";
    GameEvents["CHALLENGED"] = "challenged";
    GameEvents["COIN_TOSS_RESULT"] = "coin_toss_result";
    GameEvents["DUEL_STARTED"] = "duel_started";
    GameEvents["GAME_STATE_UPDATE"] = "game_state_update";
    GameEvents["CARD_DROPPED"] = "card_dropped";
    GameEvents["CARD_TAPPED"] = "card_tapped";
    GameEvents["CARD_UNTAPPED"] = "card_untapped";
    GameEvents["PHASE_CHANGED"] = "phase_changed";
    GameEvents["CHAT_MESSAGE"] = "chat_message";
    GameEvents["GAME_ENDED"] = "game_ended";
    GameEvents["ERROR"] = "error";
})(GameEvents || (exports.GameEvents = GameEvents = {}));
//# sourceMappingURL=game-events.enum.js.map
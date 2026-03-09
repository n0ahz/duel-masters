"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameType = exports.GameStatus = void 0;
var GameStatus;
(function (GameStatus) {
    GameStatus["WAITING"] = "waiting";
    GameStatus["CHALLENGED"] = "challenged";
    GameStatus["COIN_TOSS"] = "coin-toss";
    GameStatus["IN_PROGRESS"] = "in-progress";
    GameStatus["COMPLETED"] = "completed";
})(GameStatus || (exports.GameStatus = GameStatus = {}));
var GameType;
(function (GameType) {
    GameType["STANDARD"] = "standard";
    GameType["CASUAL"] = "casual";
})(GameType || (exports.GameType = GameType = {}));
//# sourceMappingURL=game.enum.js.map
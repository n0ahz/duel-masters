"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = exports.PlayerSide = exports.ZoneSpacing = exports.ZoneVisibility = exports.ZoneType = void 0;
var ZoneType;
(function (ZoneType) {
    ZoneType["DECK"] = "deck";
    ZoneType["HAND"] = "hand";
    ZoneType["SHIELDS"] = "shields";
    ZoneType["BATTLE_ZONE"] = "battle-zone";
    ZoneType["GRAVEYARD"] = "graveyard";
    ZoneType["MANA"] = "mana";
})(ZoneType || (exports.ZoneType = ZoneType = {}));
var ZoneVisibility;
(function (ZoneVisibility) {
    ZoneVisibility["VISIBLE"] = "visible";
    ZoneVisibility["HIDDEN"] = "hidden";
    ZoneVisibility["OWNER_ONLY"] = "owner-only";
})(ZoneVisibility || (exports.ZoneVisibility = ZoneVisibility = {}));
var ZoneSpacing;
(function (ZoneSpacing) {
    ZoneSpacing["SPREAD"] = "spread";
    ZoneSpacing["STACK"] = "stack";
    ZoneSpacing["FAN"] = "fan";
})(ZoneSpacing || (exports.ZoneSpacing = ZoneSpacing = {}));
var PlayerSide;
(function (PlayerSide) {
    PlayerSide["BOTTOM"] = "bottom";
    PlayerSide["TOP"] = "top";
})(PlayerSide || (exports.PlayerSide = PlayerSide = {}));
var Position;
(function (Position) {
    Position["TAPPED"] = "tapped";
    Position["UNTAPPED"] = "untapped";
})(Position || (exports.Position = Position = {}));
//# sourceMappingURL=zone.enum.js.map
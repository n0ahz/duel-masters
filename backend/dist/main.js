/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../shared/constants/game-layout.ts"
/*!******************************************!*\
  !*** ../shared/constants/game-layout.ts ***!
  \******************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ZONE_LAYOUT = exports.CARD_DIMENSIONS = void 0;
exports.CARD_DIMENSIONS = {
    WIDTH: 80,
    HEIGHT: 112,
    SCALE: 1,
};
exports.ZONE_LAYOUT = {
    CARD_SPACING_X: 90,
    CARD_SPACING_Y: 10,
    HAND_Y_BOTTOM: 880,
    HAND_Y_TOP: 80,
    BATTLE_ZONE_Y_BOTTOM: 620,
    BATTLE_ZONE_Y_TOP: 340,
    MANA_Y_BOTTOM: 760,
    MANA_Y_TOP: 200,
    SHIELDS_Y_BOTTOM: 500,
    SHIELDS_Y_TOP: 460,
    DECK_X: 1860,
    DECK_Y_BOTTOM: 860,
    DECK_Y_TOP: 100,
    GRAVEYARD_X: 1860,
    GRAVEYARD_Y_BOTTOM: 760,
    GRAVEYARD_Y_TOP: 200,
    CENTER_X: 1000,
};


/***/ },

/***/ "../shared/constants/game-timings.ts"
/*!*******************************************!*\
  !*** ../shared/constants/game-timings.ts ***!
  \*******************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GAME_TIMINGS = void 0;
exports.GAME_TIMINGS = {
    CARD_FLIP_MS: 300,
    CARD_MOVE_MS: 400,
    CARD_TAP_MS: 250,
    SHIELD_BREAK_MS: 500,
    PHASE_TRANSITION_MS: 600,
    COIN_FLIP_MS: 1200,
    DRAW_CARD_MS: 350,
    ATTACK_ANIM_MS: 700,
};


/***/ },

/***/ "../shared/constants/game.constants.ts"
/*!*********************************************!*\
  !*** ../shared/constants/game.constants.ts ***!
  \*********************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GAME_CONSTANTS = void 0;
exports.GAME_CONSTANTS = {
    DECK_MAX: 40,
    SHIELDS: 5,
    INITIAL_HAND: 5,
    WORLD_WIDTH: 2000,
    WORLD_HEIGHT: 960,
    MAX_MANA: 99,
    ATTACK_TRIGGER_POWER: 0,
};


/***/ },

/***/ "../shared/enums/card.enum.ts"
/*!************************************!*\
  !*** ../shared/enums/card.enum.ts ***!
  \************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CardSet = exports.Rarity = exports.CardType = exports.Civilization = void 0;
var Civilization;
(function (Civilization) {
    Civilization["LIGHT"] = "Light";
    Civilization["WATER"] = "Water";
    Civilization["DARKNESS"] = "Darkness";
    Civilization["FIRE"] = "Fire";
    Civilization["NATURE"] = "Nature";
})(Civilization || (exports.Civilization = Civilization = {}));
var CardType;
(function (CardType) {
    CardType["CREATURE"] = "Creature";
    CardType["SPELL"] = "Spell";
    CardType["CROSS_GEAR"] = "Cross Gear";
})(CardType || (exports.CardType = CardType = {}));
var Rarity;
(function (Rarity) {
    Rarity["COMMON"] = "Common";
    Rarity["UNCOMMON"] = "Uncommon";
    Rarity["RARE"] = "Rare";
    Rarity["VERY_RARE"] = "Very Rare";
    Rarity["SUPER_RARE"] = "Super Rare";
})(Rarity || (exports.Rarity = Rarity = {}));
var CardSet;
(function (CardSet) {
    CardSet["DM_01"] = "DM-01 Base Set";
    CardSet["DM_02"] = "DM-02 Evo-Crushinators of Doom";
    CardSet["DM_03"] = "DM-03 Rampage of the Super Warriors";
    CardSet["DM_04"] = "DM-04 Shadowclash of Blinding Night";
    CardSet["DM_05"] = "DM-05 Survivors of the Megapocalypse";
    CardSet["DM_06"] = "DM-06 Stomp-A-Trons of Invincible Wrath";
    CardSet["DM_07"] = "DM-07 Epic Dragons of Hyperchaos";
    CardSet["DM_08"] = "DM-08 Binary Astro";
    CardSet["DM_09"] = "DM-09 Fatal Brood of Infinite Ruin";
    CardSet["DM_10"] = "DM-10 Shockwaves of the Shattered Rainbow";
    CardSet["DM_11"] = "DM-11 Blastosplosion of Gigantic Rage";
    CardSet["DM_12"] = "DM-12 Thrash of the Hybrid Megacreatures";
    CardSet["DM_13"] = "DM-13";
    CardSet["DM_14"] = "DM-14";
    CardSet["DM_15"] = "DM-15";
    CardSet["DM_16"] = "DM-16";
    CardSet["DM_17"] = "DM-17";
})(CardSet || (exports.CardSet = CardSet = {}));


/***/ },

/***/ "../shared/enums/game.enum.ts"
/*!************************************!*\
  !*** ../shared/enums/game.enum.ts ***!
  \************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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


/***/ },

/***/ "../shared/enums/gateway/game-commands.enum.ts"
/*!*****************************************************!*\
  !*** ../shared/enums/gateway/game-commands.enum.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameCommands = void 0;
var GameCommands;
(function (GameCommands) {
    GameCommands["CREATE_GAME"] = "create_game";
    GameCommands["LIST_GAMES"] = "list_games";
    GameCommands["JOIN_GAME"] = "join_game";
    GameCommands["LEAVE_GAME"] = "leave_game";
    GameCommands["CHALLENGE"] = "challenge";
    GameCommands["COIN_TOSS_PICK"] = "coin_toss_pick";
    GameCommands["COIN_TOSS_FLIP"] = "coin_toss_flip";
    GameCommands["DECIDE_WHO_GOES_FIRST"] = "decide_who_goes_first";
    GameCommands["CARD_DROP"] = "card_drop";
    GameCommands["TAP_CARD"] = "tap_card";
    GameCommands["UNTAP_CARD"] = "untap_card";
    GameCommands["PHASE_CHANGE"] = "phase_change";
    GameCommands["SEND_CHAT"] = "send_chat";
    GameCommands["CREATE_DECK"] = "create_deck";
    GameCommands["GET_DECKS"] = "get_decks";
    GameCommands["DELETE_DECK"] = "delete_deck";
    GameCommands["SUBMIT_DECK"] = "submit_deck";
    GameCommands["UPDATE_DECK"] = "update_deck";
})(GameCommands || (exports.GameCommands = GameCommands = {}));


/***/ },

/***/ "../shared/enums/gateway/game-events.enum.ts"
/*!***************************************************!*\
  !*** ../shared/enums/gateway/game-events.enum.ts ***!
  \***************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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
    GameEvents["PLAYER_JOINED_ROOM"] = "player_joined_room";
    GameEvents["PLAYER_LEFT_ROOM"] = "player_left_room";
    GameEvents["DECKS_LIST"] = "decks_list";
    GameEvents["DECK_CREATED"] = "deck_created";
    GameEvents["DECK_DELETED"] = "deck_deleted";
    GameEvents["DECK_SUBMITTED"] = "deck_submitted";
    GameEvents["DECK_UPDATED"] = "deck_updated";
})(GameEvents || (exports.GameEvents = GameEvents = {}));


/***/ },

/***/ "../shared/enums/phase.enum.ts"
/*!*************************************!*\
  !*** ../shared/enums/phase.enum.ts ***!
  \*************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Phase = void 0;
var Phase;
(function (Phase) {
    Phase["START"] = "start";
    Phase["DRAW"] = "draw";
    Phase["CHARGE"] = "charge";
    Phase["MAIN"] = "main";
    Phase["ATTACK"] = "attack";
    Phase["BLOCK"] = "block";
    Phase["END"] = "end";
})(Phase || (exports.Phase = Phase = {}));


/***/ },

/***/ "../shared/enums/zone.enum.ts"
/*!************************************!*\
  !*** ../shared/enums/zone.enum.ts ***!
  \************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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


/***/ },

/***/ "../shared/index.ts"
/*!**************************!*\
  !*** ../shared/index.ts ***!
  \**************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./constants/game.constants */ "../shared/constants/game.constants.ts"), exports);
__exportStar(__webpack_require__(/*! ./constants/game-timings */ "../shared/constants/game-timings.ts"), exports);
__exportStar(__webpack_require__(/*! ./constants/game-layout */ "../shared/constants/game-layout.ts"), exports);
__exportStar(__webpack_require__(/*! ./enums/game.enum */ "../shared/enums/game.enum.ts"), exports);
__exportStar(__webpack_require__(/*! ./enums/card.enum */ "../shared/enums/card.enum.ts"), exports);
__exportStar(__webpack_require__(/*! ./enums/zone.enum */ "../shared/enums/zone.enum.ts"), exports);
__exportStar(__webpack_require__(/*! ./enums/phase.enum */ "../shared/enums/phase.enum.ts"), exports);
__exportStar(__webpack_require__(/*! ./enums/gateway/game-commands.enum */ "../shared/enums/gateway/game-commands.enum.ts"), exports);
__exportStar(__webpack_require__(/*! ./enums/gateway/game-events.enum */ "../shared/enums/gateway/game-events.enum.ts"), exports);
__exportStar(__webpack_require__(/*! ./interfaces/card.interface */ "../shared/interfaces/card.interface.ts"), exports);
__exportStar(__webpack_require__(/*! ./interfaces/zone-card.interface */ "../shared/interfaces/zone-card.interface.ts"), exports);
__exportStar(__webpack_require__(/*! ./interfaces/game.interface */ "../shared/interfaces/game.interface.ts"), exports);
__exportStar(__webpack_require__(/*! ./interfaces/socket-payload.interface */ "../shared/interfaces/socket-payload.interface.ts"), exports);
__exportStar(__webpack_require__(/*! ./interfaces/game-state.interface */ "../shared/interfaces/game-state.interface.ts"), exports);
__exportStar(__webpack_require__(/*! ./interfaces/chat-message.interface */ "../shared/interfaces/chat-message.interface.ts"), exports);
__exportStar(__webpack_require__(/*! ./interfaces/deck.interface */ "../shared/interfaces/deck.interface.ts"), exports);


/***/ },

/***/ "../shared/interfaces/card.interface.ts"
/*!**********************************************!*\
  !*** ../shared/interfaces/card.interface.ts ***!
  \**********************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "../shared/interfaces/chat-message.interface.ts"
/*!******************************************************!*\
  !*** ../shared/interfaces/chat-message.interface.ts ***!
  \******************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "../shared/interfaces/deck.interface.ts"
/*!**********************************************!*\
  !*** ../shared/interfaces/deck.interface.ts ***!
  \**********************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "../shared/interfaces/game-state.interface.ts"
/*!****************************************************!*\
  !*** ../shared/interfaces/game-state.interface.ts ***!
  \****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const zone_enum_1 = __webpack_require__(/*! ../enums/zone.enum */ "../shared/enums/zone.enum.ts");


/***/ },

/***/ "../shared/interfaces/game.interface.ts"
/*!**********************************************!*\
  !*** ../shared/interfaces/game.interface.ts ***!
  \**********************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "../shared/interfaces/socket-payload.interface.ts"
/*!********************************************************!*\
  !*** ../shared/interfaces/socket-payload.interface.ts ***!
  \********************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "../shared/interfaces/zone-card.interface.ts"
/*!***************************************************!*\
  !*** ../shared/interfaces/zone-card.interface.ts ***!
  \***************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./src/app.module.ts"
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const cards_module_1 = __webpack_require__(/*! ./modules/cards/cards.module */ "./src/modules/cards/cards.module.ts");
const users_module_1 = __webpack_require__(/*! ./modules/users/users.module */ "./src/modules/users/users.module.ts");
const games_module_1 = __webpack_require__(/*! ./modules/games/games.module */ "./src/modules/games/games.module.ts");
const auth_module_1 = __webpack_require__(/*! ./modules/auth/auth.module */ "./src/modules/auth/auth.module.ts");
const chat_module_1 = __webpack_require__(/*! ./modules/chat/chat.module */ "./src/modules/chat/chat.module.ts");
const decks_module_1 = __webpack_require__(/*! ./modules/decks/decks.module */ "./src/modules/decks/decks.module.ts");
const gateway_module_1 = __webpack_require__(/*! ./gateway/gateway.module */ "./src/gateway/gateway.module.ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/duel-masters'),
            cards_module_1.CardsModule,
            users_module_1.UsersModule,
            games_module_1.GamesModule,
            auth_module_1.AuthModule,
            chat_module_1.ChatModule,
            decks_module_1.DecksModule,
            gateway_module_1.GatewayModule,
        ],
    })
], AppModule);


/***/ },

/***/ "./src/gateway/chat.gateway.ts"
/*!*************************************!*\
  !*** ./src/gateway/chat.gateway.ts ***!
  \*************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatGateway = void 0;
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const socket_io_1 = __webpack_require__(/*! socket.io */ "socket.io");
const shared_1 = __webpack_require__(/*! @dm/shared */ "../shared/index.ts");
const chat_service_1 = __webpack_require__(/*! ../modules/chat/chat.service */ "./src/modules/chat/chat.service.ts");
let ChatGateway = class ChatGateway {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async handleSendChat(data, socket) {
        try {
            const userId = socket.data.userId;
            const username = socket.data.username || 'Player';
            const saved = await this.chatService.saveMessage({
                gameId: data.gameId,
                userId,
                username,
                message: data.message,
            });
            this.server.to(data.gameId).emit(shared_1.GameEvents.CHAT_MESSAGE, {
                id: saved._id,
                gameId: data.gameId,
                userId,
                username,
                message: data.message,
                timestamp: saved.timestamp,
            });
        }
        catch (e) {
            socket.emit(shared_1.GameEvents.ERROR, { message: e.message });
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_b = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _b : Object)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.GameCommands.SEND_CHAT),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendChat", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof chat_service_1.ChatService !== "undefined" && chat_service_1.ChatService) === "function" ? _a : Object])
], ChatGateway);


/***/ },

/***/ "./src/gateway/decks.gateway.ts"
/*!**************************************!*\
  !*** ./src/gateway/decks.gateway.ts ***!
  \**************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DecksGateway = void 0;
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const socket_io_1 = __webpack_require__(/*! socket.io */ "socket.io");
const shared_1 = __webpack_require__(/*! @dm/shared */ "../shared/index.ts");
const decks_service_1 = __webpack_require__(/*! ../modules/decks/decks.service */ "./src/modules/decks/decks.service.ts");
let DecksGateway = class DecksGateway {
    constructor(decksService) {
        this.decksService = decksService;
    }
    async handleGetDecks(socket) {
        try {
            const userId = socket.data.userId;
            if (!userId)
                return socket.emit(shared_1.GameEvents.ERROR, { message: 'Not authenticated' });
            const decks = await this.decksService.getUserDecks(userId);
            socket.emit(shared_1.GameEvents.DECKS_LIST, decks.map((d) => ({
                _id: d._id.toString(),
                userId: d.userId,
                name: d.name,
                cards: d.cards,
            })));
        }
        catch (e) {
            socket.emit(shared_1.GameEvents.ERROR, { message: e.message });
        }
    }
    async handleCreateDeck(data, socket) {
        try {
            const userId = socket.data.userId;
            if (!userId)
                return socket.emit(shared_1.GameEvents.ERROR, { message: 'Not authenticated' });
            const deck = await this.decksService.createDeck(userId, data.name, data.cards);
            socket.emit(shared_1.GameEvents.DECK_CREATED, {
                _id: deck._id.toString(),
                userId: deck.userId,
                name: deck.name,
                cards: deck.cards,
            });
        }
        catch (e) {
            socket.emit(shared_1.GameEvents.ERROR, { message: e.message });
        }
    }
    async handleUpdateDeck(data, socket) {
        try {
            const userId = socket.data.userId;
            if (!userId)
                return socket.emit(shared_1.GameEvents.ERROR, { message: 'Not authenticated' });
            const deck = await this.decksService.updateDeck(data.deckId, userId, data.name, data.cards);
            socket.emit(shared_1.GameEvents.DECK_UPDATED, {
                _id: deck._id.toString(),
                userId: deck.userId,
                name: deck.name,
                cards: deck.cards,
            });
        }
        catch (e) {
            socket.emit(shared_1.GameEvents.ERROR, { message: e.message });
        }
    }
    async handleDeleteDeck(data, socket) {
        try {
            const userId = socket.data.userId;
            if (!userId)
                return socket.emit(shared_1.GameEvents.ERROR, { message: 'Not authenticated' });
            await this.decksService.deleteDeck(data.deckId, userId);
            socket.emit(shared_1.GameEvents.DECK_DELETED, { deckId: data.deckId });
        }
        catch (e) {
            socket.emit(shared_1.GameEvents.ERROR, { message: e.message });
        }
    }
};
exports.DecksGateway = DecksGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_b = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _b : Object)
], DecksGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.GameCommands.GET_DECKS),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], DecksGateway.prototype, "handleGetDecks", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.GameCommands.CREATE_DECK),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], DecksGateway.prototype, "handleCreateDeck", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.GameCommands.UPDATE_DECK),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_e = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], DecksGateway.prototype, "handleUpdateDeck", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.GameCommands.DELETE_DECK),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_f = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], DecksGateway.prototype, "handleDeleteDeck", null);
exports.DecksGateway = DecksGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof decks_service_1.DecksService !== "undefined" && decks_service_1.DecksService) === "function" ? _a : Object])
], DecksGateway);


/***/ },

/***/ "./src/gateway/duel-decision.gateway.ts"
/*!**********************************************!*\
  !*** ./src/gateway/duel-decision.gateway.ts ***!
  \**********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DuelDecisionGateway = void 0;
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const socket_io_1 = __webpack_require__(/*! socket.io */ "socket.io");
const shared_1 = __webpack_require__(/*! @dm/shared */ "../shared/index.ts");
const coin_toss_service_1 = __webpack_require__(/*! ../services/coin-toss.service */ "./src/services/coin-toss.service.ts");
const game_room_service_1 = __webpack_require__(/*! ../services/game-room.service */ "./src/services/game-room.service.ts");
const duel_state_service_1 = __webpack_require__(/*! ../services/duel-state.service */ "./src/services/duel-state.service.ts");
const games_service_1 = __webpack_require__(/*! ../modules/games/games.service */ "./src/modules/games/games.service.ts");
const decks_service_1 = __webpack_require__(/*! ../modules/decks/decks.service */ "./src/modules/decks/decks.service.ts");
let DuelDecisionGateway = class DuelDecisionGateway {
    constructor(coinTossService, gameRoomService, duelStateService, gamesService, decksService) {
        this.coinTossService = coinTossService;
        this.gameRoomService = gameRoomService;
        this.duelStateService = duelStateService;
        this.gamesService = gamesService;
        this.decksService = decksService;
        this.duelReadyState = new Map();
    }
    async handleCoinTossPick(data, socket) {
        const userId = socket.data.userId;
        this.coinTossService.pick(data.gameId, userId, data.side);
        const room = this.gameRoomService.getRoom(data.gameId);
        if (room?.dbId) {
            await this.gamesService.recordStep(room.dbId, {
                playerId: userId,
                type: 'coin_toss_pick',
                payload: { side: data.side },
            });
        }
    }
    async handleCoinTossFlip(data, socket) {
        const result = this.coinTossService.flip(data.gameId);
        if (!result)
            return socket.emit(shared_1.GameEvents.ERROR, {
                message: 'Not all players have picked',
            });
        const room = this.gameRoomService.getRoom(data.gameId);
        if (room?.dbId) {
            await this.gamesService.recordStep(room.dbId, {
                playerId: socket.data.userId,
                type: 'coin_toss_flip',
                payload: result,
            });
        }
        this.server
            .to(data.gameId)
            .emit(shared_1.GameEvents.COIN_TOSS_RESULT, { gameId: data.gameId, ...result });
    }
    async handleDecideFirst(data, socket) {
        try {
            const room = this.gameRoomService.getRoom(data.gameId);
            if (!room)
                return socket.emit(shared_1.GameEvents.ERROR, { message: 'Game not found' });
            const entry = this.getOrCreateEntry(data.gameId);
            entry.firstPlayerId = data.firstPlayerId;
            await this.gamesService.recordStep(room.dbId, {
                playerId: socket.data.userId,
                type: 'decide_first',
                payload: { firstPlayerId: data.firstPlayerId },
            });
            await this.checkAndStartDuel(data.gameId, socket);
        }
        catch (e) {
            socket.emit(shared_1.GameEvents.ERROR, { message: e.message });
        }
    }
    async handleSubmitDeck(data, socket) {
        try {
            const userId = socket.data.userId;
            const room = this.gameRoomService.getRoom(data.gameId);
            if (!room)
                return socket.emit(shared_1.GameEvents.ERROR, { message: 'Game not found' });
            const entry = this.getOrCreateEntry(data.gameId);
            entry.decks.set(userId, data.deckId);
            this.server.to(data.gameId).emit(shared_1.GameEvents.DECK_SUBMITTED, {
                gameId: data.gameId,
                userId,
                deckId: data.deckId,
            });
            await this.checkAndStartDuel(data.gameId, socket);
        }
        catch (e) {
            socket.emit(shared_1.GameEvents.ERROR, { message: e.message });
        }
    }
    getOrCreateEntry(gameId) {
        if (!this.duelReadyState.has(gameId)) {
            this.duelReadyState.set(gameId, { decks: new Map() });
        }
        return this.duelReadyState.get(gameId);
    }
    async checkAndStartDuel(gameId, socket) {
        const room = this.gameRoomService.getRoom(gameId);
        if (!room)
            return;
        const entry = this.duelReadyState.get(gameId);
        if (!entry?.firstPlayerId)
            return;
        const inviterId = room.inviterId;
        const challengerId = room.challengerId;
        if (!challengerId)
            return;
        if (!entry.decks.has(inviterId) || !entry.decks.has(challengerId))
            return;
        try {
            const inviterDeck = await this.decksService.expandDeck(entry.decks.get(inviterId));
            const challengerDeck = await this.decksService.expandDeck(entry.decks.get(challengerId));
            this.duelStateService.initGame(gameId, [
                { userId: inviterId, username: room.inviterName, deck: inviterDeck },
                {
                    userId: challengerId,
                    username: room.challengerName || 'Challenger',
                    deck: challengerDeck,
                },
            ]);
            await this.gamesService.startGame(room.dbId);
            await this.gamesService.recordStep(room.dbId, {
                playerId: socket.data.userId,
                type: 'duel_started',
                payload: { firstPlayerId: entry.firstPlayerId },
            });
            this.gameRoomService.updateRoom(gameId, {
                status: shared_1.GameStatus.IN_PROGRESS,
            });
            this.duelReadyState.delete(gameId);
            this.server.to(gameId).emit(shared_1.GameEvents.DUEL_STARTED, {
                gameId,
                firstPlayerId: entry.firstPlayerId,
            });
        }
        catch (e) {
            socket.emit(shared_1.GameEvents.ERROR, { message: e.message });
        }
    }
};
exports.DuelDecisionGateway = DuelDecisionGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_f = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _f : Object)
], DuelDecisionGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.GameCommands.COIN_TOSS_PICK),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_g = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], DuelDecisionGateway.prototype, "handleCoinTossPick", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.GameCommands.COIN_TOSS_FLIP),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_h = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], DuelDecisionGateway.prototype, "handleCoinTossFlip", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.GameCommands.DECIDE_WHO_GOES_FIRST),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_j = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], DuelDecisionGateway.prototype, "handleDecideFirst", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.GameCommands.SUBMIT_DECK),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_k = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _k : Object]),
    __metadata("design:returntype", Promise)
], DuelDecisionGateway.prototype, "handleSubmitDeck", null);
exports.DuelDecisionGateway = DuelDecisionGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof coin_toss_service_1.CoinTossService !== "undefined" && coin_toss_service_1.CoinTossService) === "function" ? _a : Object, typeof (_b = typeof game_room_service_1.GameRoomService !== "undefined" && game_room_service_1.GameRoomService) === "function" ? _b : Object, typeof (_c = typeof duel_state_service_1.DuelStateService !== "undefined" && duel_state_service_1.DuelStateService) === "function" ? _c : Object, typeof (_d = typeof games_service_1.GamesService !== "undefined" && games_service_1.GamesService) === "function" ? _d : Object, typeof (_e = typeof decks_service_1.DecksService !== "undefined" && decks_service_1.DecksService) === "function" ? _e : Object])
], DuelDecisionGateway);


/***/ },

/***/ "./src/gateway/duel.gateway.ts"
/*!*************************************!*\
  !*** ./src/gateway/duel.gateway.ts ***!
  \*************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DuelGateway = void 0;
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const socket_io_1 = __webpack_require__(/*! socket.io */ "socket.io");
const shared_1 = __webpack_require__(/*! @dm/shared */ "../shared/index.ts");
const duel_state_service_1 = __webpack_require__(/*! ../services/duel-state.service */ "./src/services/duel-state.service.ts");
const games_service_1 = __webpack_require__(/*! ../modules/games/games.service */ "./src/modules/games/games.service.ts");
const game_room_service_1 = __webpack_require__(/*! ../services/game-room.service */ "./src/services/game-room.service.ts");
let DuelGateway = class DuelGateway {
    constructor(duelStateService, gamesService, gameRoomService) {
        this.duelStateService = duelStateService;
        this.gamesService = gamesService;
        this.gameRoomService = gameRoomService;
    }
    async handleCardDrop(data, socket) {
        try {
            const room = this.gameRoomService.getRoom(data.gameId);
            if (!room)
                return socket.emit(shared_1.GameEvents.ERROR, { message: 'Game not found' });
            await this.gamesService.recordStep(room.dbId, {
                playerId: socket.data.userId,
                type: 'card_drop',
                payload: data,
            });
            const state = this.duelStateService.getState(data.gameId);
            this.server.to(data.gameId).emit(shared_1.GameEvents.CARD_DROPPED, {
                gameId: data.gameId,
                playerId: socket.data.userId,
                cardId: data.cardId,
                targetZone: data.targetZone,
            });
            if (state)
                this.server.to(data.gameId).emit(shared_1.GameEvents.GAME_STATE_UPDATE, state);
        }
        catch (e) {
            socket.emit(shared_1.GameEvents.ERROR, { message: e.message });
        }
    }
    async handleTapCard(data, socket) {
        try {
            const room = this.gameRoomService.getRoom(data.gameId);
            if (!room)
                return socket.emit(shared_1.GameEvents.ERROR, { message: 'Game not found' });
            await this.gamesService.recordStep(room.dbId, {
                playerId: socket.data.userId,
                type: 'tap_card',
                payload: data,
            });
            this.server.to(data.gameId).emit(shared_1.GameEvents.CARD_TAPPED, {
                gameId: data.gameId,
                playerId: socket.data.userId,
                cardId: data.cardId,
            });
        }
        catch (e) {
            socket.emit(shared_1.GameEvents.ERROR, { message: e.message });
        }
    }
    async handleUntapCard(data, socket) {
        try {
            const room = this.gameRoomService.getRoom(data.gameId);
            if (!room)
                return socket.emit(shared_1.GameEvents.ERROR, { message: 'Game not found' });
            await this.gamesService.recordStep(room.dbId, {
                playerId: socket.data.userId,
                type: 'untap_card',
                payload: data,
            });
            this.server.to(data.gameId).emit(shared_1.GameEvents.CARD_UNTAPPED, {
                gameId: data.gameId,
                playerId: socket.data.userId,
                cardId: data.cardId,
            });
        }
        catch (e) {
            socket.emit(shared_1.GameEvents.ERROR, { message: e.message });
        }
    }
    async handlePhaseChange(data, socket) {
        try {
            const room = this.gameRoomService.getRoom(data.gameId);
            if (!room)
                return socket.emit(shared_1.GameEvents.ERROR, { message: 'Game not found' });
            await this.gamesService.recordStep(room.dbId, {
                playerId: socket.data.userId,
                type: 'phase_change',
                payload: data,
            });
            this.server.to(data.gameId).emit(shared_1.GameEvents.PHASE_CHANGED, {
                gameId: data.gameId,
                phase: data.phase,
                playerId: socket.data.userId,
            });
        }
        catch (e) {
            socket.emit(shared_1.GameEvents.ERROR, { message: e.message });
        }
    }
};
exports.DuelGateway = DuelGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_d = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _d : Object)
], DuelGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.GameCommands.CARD_DROP),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_e = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], DuelGateway.prototype, "handleCardDrop", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.GameCommands.TAP_CARD),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_f = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], DuelGateway.prototype, "handleTapCard", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.GameCommands.UNTAP_CARD),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_g = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], DuelGateway.prototype, "handleUntapCard", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.GameCommands.PHASE_CHANGE),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_h = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], DuelGateway.prototype, "handlePhaseChange", null);
exports.DuelGateway = DuelGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof duel_state_service_1.DuelStateService !== "undefined" && duel_state_service_1.DuelStateService) === "function" ? _a : Object, typeof (_b = typeof games_service_1.GamesService !== "undefined" && games_service_1.GamesService) === "function" ? _b : Object, typeof (_c = typeof game_room_service_1.GameRoomService !== "undefined" && game_room_service_1.GameRoomService) === "function" ? _c : Object])
], DuelGateway);


/***/ },

/***/ "./src/gateway/games.gateway.ts"
/*!**************************************!*\
  !*** ./src/gateway/games.gateway.ts ***!
  \**************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GamesGateway = void 0;
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const socket_io_1 = __webpack_require__(/*! socket.io */ "socket.io");
const shared_1 = __webpack_require__(/*! @dm/shared */ "../shared/index.ts");
const game_room_service_1 = __webpack_require__(/*! ../services/game-room.service */ "./src/services/game-room.service.ts");
const games_service_1 = __webpack_require__(/*! ../modules/games/games.service */ "./src/modules/games/games.service.ts");
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
let GamesGateway = class GamesGateway {
    constructor(gameRoomService, gamesService) {
        this.gameRoomService = gameRoomService;
        this.gamesService = gamesService;
    }
    async handleCreateGame(data, socket) {
        try {
            const userId = socket.data.userId;
            const username = socket.data.username || 'Player';
            if (!userId)
                return socket.emit(shared_1.GameEvents.ERROR, { message: 'Not authenticated' });
            const gameId = (0, uuid_1.v4)();
            const dbGame = await this.gamesService.createGame({
                name: data.name,
                inviterId: userId,
                inviterName: username,
                type: data.type,
            });
            const dbId = dbGame._id.toString();
            this.gameRoomService.createRoom({
                id: gameId,
                dbId,
                name: data.name,
                inviterId: userId,
                inviterName: username,
                inviterSocketId: socket.id,
                type: data.type,
            });
            socket.join(gameId);
            socket.data.gameId = gameId;
            socket.data.dbGameId = dbId;
            this.server.emit(shared_1.GameEvents.GAME_CREATED, {
                id: gameId,
                dbId,
                name: data.name,
                inviterId: userId,
                inviterName: username,
                status: shared_1.GameStatus.WAITING,
                type: data.type || 'standard',
                createdAt: new Date(),
            });
        }
        catch (e) {
            socket.emit(shared_1.GameEvents.ERROR, { message: e.message });
        }
    }
    handleListGames(socket) {
        const rooms = this.gameRoomService.getWaitingRooms().map((r) => ({
            id: r.id,
            dbId: r.dbId,
            name: r.name,
            inviterId: r.inviterId,
            inviterName: r.inviterName,
            status: r.status,
            type: r.type,
            createdAt: r.createdAt,
        }));
        socket.emit(shared_1.GameEvents.GAMES_LIST, rooms);
    }
    handleJoinGame(data, socket) {
        try {
            const userId = socket.data.userId;
            const username = socket.data.username || 'Player';
            if (!userId)
                return socket.emit(shared_1.GameEvents.ERROR, { message: 'Not authenticated' });
            const room = this.gameRoomService.getRoom(data.gameId);
            if (!room)
                return socket.emit(shared_1.GameEvents.ERROR, { message: 'Game not found' });
            if (room.status !== shared_1.GameStatus.WAITING)
                return socket.emit(shared_1.GameEvents.ERROR, {
                    message: 'Game not available',
                });
            socket.join(data.gameId);
            socket.data.gameId = data.gameId;
            socket.data.dbGameId = room.dbId;
            room.users.add(userId);
            this.server
                .to(data.gameId)
                .emit(shared_1.GameEvents.GAME_JOINED, {
                gameId: data.gameId,
                userId,
                username,
            });
            this.server.to(data.gameId).emit(shared_1.GameEvents.PLAYER_JOINED_ROOM, {
                gameId: data.gameId,
                userId,
                username,
                timestamp: new Date(),
            });
        }
        catch (e) {
            socket.emit(shared_1.GameEvents.ERROR, { message: e.message });
        }
    }
    handleLeaveGame(data, socket) {
        const userId = socket.data.userId;
        const username = socket.data.username || 'Player';
        socket.leave(data.gameId);
        socket.data.gameId = undefined;
        this.server.to(data.gameId).emit(shared_1.GameEvents.GAME_LEFT, {
            gameId: data.gameId,
            userId,
        });
        this.server.to(data.gameId).emit(shared_1.GameEvents.PLAYER_LEFT_ROOM, {
            gameId: data.gameId,
            userId,
            username,
            timestamp: new Date(),
        });
    }
    handleChallenge(data, socket) {
        try {
            const userId = socket.data.userId;
            const username = socket.data.username || 'Player';
            const room = this.gameRoomService.getRoom(data.gameId);
            if (!room)
                return socket.emit(shared_1.GameEvents.ERROR, { message: 'Game not found' });
            this.gameRoomService.updateRoom(data.gameId, {
                challengerId: userId,
                challengerName: username,
                challengerSocketId: socket.id,
                status: shared_1.GameStatus.CHALLENGED,
            });
            this.server.to(data.gameId).emit(shared_1.GameEvents.CHALLENGED, {
                gameId: data.gameId,
                challengerId: userId,
                challengerName: username,
            });
        }
        catch (e) {
            socket.emit(shared_1.GameEvents.ERROR, { message: e.message });
        }
    }
};
exports.GamesGateway = GamesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_c = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _c : Object)
], GamesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.GameCommands.CREATE_GAME),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "handleCreateGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.GameCommands.LIST_GAMES),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], GamesGateway.prototype, "handleListGames", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.GameCommands.JOIN_GAME),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_f = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _f : Object]),
    __metadata("design:returntype", void 0)
], GamesGateway.prototype, "handleJoinGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.GameCommands.LEAVE_GAME),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_g = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _g : Object]),
    __metadata("design:returntype", void 0)
], GamesGateway.prototype, "handleLeaveGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_1.GameCommands.CHALLENGE),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_h = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _h : Object]),
    __metadata("design:returntype", void 0)
], GamesGateway.prototype, "handleChallenge", null);
exports.GamesGateway = GamesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof game_room_service_1.GameRoomService !== "undefined" && game_room_service_1.GameRoomService) === "function" ? _a : Object, typeof (_b = typeof games_service_1.GamesService !== "undefined" && games_service_1.GamesService) === "function" ? _b : Object])
], GamesGateway);


/***/ },

/***/ "./src/gateway/gateway.module.ts"
/*!***************************************!*\
  !*** ./src/gateway/gateway.module.ts ***!
  \***************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GatewayModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const main_gateway_1 = __webpack_require__(/*! ./main.gateway */ "./src/gateway/main.gateway.ts");
const games_gateway_1 = __webpack_require__(/*! ./games.gateway */ "./src/gateway/games.gateway.ts");
const duel_gateway_1 = __webpack_require__(/*! ./duel.gateway */ "./src/gateway/duel.gateway.ts");
const duel_decision_gateway_1 = __webpack_require__(/*! ./duel-decision.gateway */ "./src/gateway/duel-decision.gateway.ts");
const chat_gateway_1 = __webpack_require__(/*! ./chat.gateway */ "./src/gateway/chat.gateway.ts");
const decks_gateway_1 = __webpack_require__(/*! ./decks.gateway */ "./src/gateway/decks.gateway.ts");
const game_room_service_1 = __webpack_require__(/*! ../services/game-room.service */ "./src/services/game-room.service.ts");
const coin_toss_service_1 = __webpack_require__(/*! ../services/coin-toss.service */ "./src/services/coin-toss.service.ts");
const duel_state_service_1 = __webpack_require__(/*! ../services/duel-state.service */ "./src/services/duel-state.service.ts");
const games_module_1 = __webpack_require__(/*! ../modules/games/games.module */ "./src/modules/games/games.module.ts");
const chat_module_1 = __webpack_require__(/*! ../modules/chat/chat.module */ "./src/modules/chat/chat.module.ts");
const decks_module_1 = __webpack_require__(/*! ../modules/decks/decks.module */ "./src/modules/decks/decks.module.ts");
let GatewayModule = class GatewayModule {
};
exports.GatewayModule = GatewayModule;
exports.GatewayModule = GatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [games_module_1.GamesModule, chat_module_1.ChatModule, decks_module_1.DecksModule],
        providers: [
            main_gateway_1.MainGateway,
            games_gateway_1.GamesGateway,
            duel_gateway_1.DuelGateway,
            duel_decision_gateway_1.DuelDecisionGateway,
            chat_gateway_1.ChatGateway,
            decks_gateway_1.DecksGateway,
            game_room_service_1.GameRoomService,
            coin_toss_service_1.CoinTossService,
            duel_state_service_1.DuelStateService,
        ],
    })
], GatewayModule);


/***/ },

/***/ "./src/gateway/main.gateway.ts"
/*!*************************************!*\
  !*** ./src/gateway/main.gateway.ts ***!
  \*************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MainGateway = void 0;
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const socket_io_1 = __webpack_require__(/*! socket.io */ "socket.io");
let MainGateway = class MainGateway {
    constructor() {
        this.activeUsers = new Map();
    }
    handleConnection(socket) {
        const userId = socket.handshake.auth?.userId;
        if (userId) {
            socket.data.userId = userId;
            socket.data.username = socket.handshake.auth?.username;
            this.activeUsers.set(socket.id, userId);
        }
        console.log(`Client connected: ${socket.id} userId=${userId}`);
    }
    handleDisconnect(socket) {
        this.activeUsers.delete(socket.id);
        console.log(`Client disconnected: ${socket.id}`);
    }
};
exports.MainGateway = MainGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], MainGateway.prototype, "server", void 0);
exports.MainGateway = MainGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
            credentials: true,
        },
    })
], MainGateway);


/***/ },

/***/ "./src/modules/auth/auth.controller.ts"
/*!*********************************************!*\
  !*** ./src/modules/auth/auth.controller.ts ***!
  \*********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let AuthController = class AuthController {
    googleAuth() {
    }
    googleAuthCallback(req) {
        return { user: req.user };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleAuthCallback", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth')
], AuthController);


/***/ },

/***/ "./src/modules/auth/auth.module.ts"
/*!*****************************************!*\
  !*** ./src/modules/auth/auth.module.ts ***!
  \*****************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const users_module_1 = __webpack_require__(/*! ../users/users.module */ "./src/modules/users/users.module.ts");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./src/modules/auth/auth.controller.ts");
const google_strategy_1 = __webpack_require__(/*! ./google.strategy */ "./src/modules/auth/google.strategy.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [passport_1.PassportModule, users_module_1.UsersModule],
        providers: [auth_service_1.AuthService, google_strategy_1.GoogleStrategy],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ },

/***/ "./src/modules/auth/auth.service.ts"
/*!******************************************!*\
  !*** ./src/modules/auth/auth.service.ts ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const users_service_1 = __webpack_require__(/*! ../users/users.service */ "./src/modules/users/users.service.ts");
let AuthService = class AuthService {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async validateGoogleUser(profile) {
        const { id, displayName, emails, photos } = profile;
        return this.usersService.findOrCreate({
            googleId: id,
            email: emails?.[0]?.value || '',
            displayName,
            avatarUrl: photos?.[0]?.value || '',
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], AuthService);


/***/ },

/***/ "./src/modules/auth/google.strategy.ts"
/*!*********************************************!*\
  !*** ./src/modules/auth/google.strategy.ts ***!
  \*********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoogleStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_google_oauth20_1 = __webpack_require__(/*! passport-google-oauth20 */ "passport-google-oauth20");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor(authService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
            callbackURL: 'http://localhost:3000/auth/google/callback',
            scope: ['email', 'profile'],
        });
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const user = await this.authService.validateGoogleUser(profile);
        done(null, user);
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], GoogleStrategy);


/***/ },

/***/ "./src/modules/cards/cards.controller.ts"
/*!***********************************************!*\
  !*** ./src/modules/cards/cards.controller.ts ***!
  \***********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CardsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const cards_service_1 = __webpack_require__(/*! ./cards.service */ "./src/modules/cards/cards.service.ts");
let CardsController = class CardsController {
    constructor(cardsService) {
        this.cardsService = cardsService;
    }
    findAll(civilization, type, set, search) {
        return this.cardsService.findAll({ civilization, type, set, search });
    }
    findOne(id) {
        return this.cardsService.findById(id);
    }
};
exports.CardsController = CardsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('civilization')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('set')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "findOne", null);
exports.CardsController = CardsController = __decorate([
    (0, common_1.Controller)('cards'),
    __metadata("design:paramtypes", [typeof (_a = typeof cards_service_1.CardsService !== "undefined" && cards_service_1.CardsService) === "function" ? _a : Object])
], CardsController);


/***/ },

/***/ "./src/modules/cards/cards.module.ts"
/*!*******************************************!*\
  !*** ./src/modules/cards/cards.module.ts ***!
  \*******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CardsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const card_schema_1 = __webpack_require__(/*! ./schemas/card.schema */ "./src/modules/cards/schemas/card.schema.ts");
const cards_service_1 = __webpack_require__(/*! ./cards.service */ "./src/modules/cards/cards.service.ts");
const cards_controller_1 = __webpack_require__(/*! ./cards.controller */ "./src/modules/cards/cards.controller.ts");
let CardsModule = class CardsModule {
};
exports.CardsModule = CardsModule;
exports.CardsModule = CardsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: card_schema_1.Card.name, schema: card_schema_1.CardSchema }]),
        ],
        providers: [cards_service_1.CardsService],
        controllers: [cards_controller_1.CardsController],
        exports: [cards_service_1.CardsService],
    })
], CardsModule);


/***/ },

/***/ "./src/modules/cards/cards.service.ts"
/*!********************************************!*\
  !*** ./src/modules/cards/cards.service.ts ***!
  \********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CardsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const card_schema_1 = __webpack_require__(/*! ./schemas/card.schema */ "./src/modules/cards/schemas/card.schema.ts");
let CardsService = class CardsService {
    constructor(cardModel) {
        this.cardModel = cardModel;
    }
    async findAll(filters = {}) {
        const query = {};
        if (filters.civilization)
            query.civilizations = filters.civilization;
        if (filters.type)
            query.type = filters.type;
        if (filters.set)
            query['printings.set'] = filters.set;
        if (filters.search)
            query.name = { $regex: filters.search, $options: 'i' };
        return this.cardModel.find(query).limit(200).exec();
    }
    async findById(id) {
        return this.cardModel.findById(id).exec();
    }
    async findByCivilization(civilization) {
        return this.cardModel.find({ civilizations: civilization }).exec();
    }
};
exports.CardsService = CardsService;
exports.CardsService = CardsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(card_schema_1.Card.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], CardsService);


/***/ },

/***/ "./src/modules/cards/schemas/card.schema.ts"
/*!**************************************************!*\
  !*** ./src/modules/cards/schemas/card.schema.ts ***!
  \**************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CardSchema = exports.Card = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
let Card = class Card {
};
exports.Card = Card;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Card.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], Card.prototype, "civilizations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Card.prototype, "cost", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Card.prototype, "power", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Card.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Card.prototype, "subtypes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Card.prototype, "supertypes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Card.prototype, "text", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], required: true }),
    __metadata("design:type", typeof (_a = typeof Array !== "undefined" && Array) === "function" ? _a : Object)
], Card.prototype, "printings", void 0);
exports.Card = Card = __decorate([
    (0, mongoose_1.Schema)({ collection: 'cards' })
], Card);
exports.CardSchema = mongoose_1.SchemaFactory.createForClass(Card);
exports.CardSchema.index({ name: 1 });
exports.CardSchema.index({ civilizations: 1 });
exports.CardSchema.index({ type: 1 });


/***/ },

/***/ "./src/modules/chat/chat.module.ts"
/*!*****************************************!*\
  !*** ./src/modules/chat/chat.module.ts ***!
  \*****************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const chat_message_schema_1 = __webpack_require__(/*! ./schemas/chat-message.schema */ "./src/modules/chat/schemas/chat-message.schema.ts");
const chat_service_1 = __webpack_require__(/*! ./chat.service */ "./src/modules/chat/chat.service.ts");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: chat_message_schema_1.ChatMessage.name, schema: chat_message_schema_1.ChatMessageSchema },
            ]),
        ],
        providers: [chat_service_1.ChatService],
        exports: [chat_service_1.ChatService],
    })
], ChatModule);


/***/ },

/***/ "./src/modules/chat/chat.service.ts"
/*!******************************************!*\
  !*** ./src/modules/chat/chat.service.ts ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const chat_message_schema_1 = __webpack_require__(/*! ./schemas/chat-message.schema */ "./src/modules/chat/schemas/chat-message.schema.ts");
let ChatService = class ChatService {
    constructor(chatMessageModel) {
        this.chatMessageModel = chatMessageModel;
    }
    async saveMessage(data) {
        return this.chatMessageModel.create({
            ...data,
            gameId: new mongoose_2.Types.ObjectId(data.gameId),
            timestamp: new Date(),
        });
    }
    async findByGame(gameId) {
        return this.chatMessageModel
            .find({ gameId: new mongoose_2.Types.ObjectId(gameId) })
            .sort({ timestamp: 1 })
            .exec();
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_message_schema_1.ChatMessage.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ChatService);


/***/ },

/***/ "./src/modules/chat/schemas/chat-message.schema.ts"
/*!*********************************************************!*\
  !*** ./src/modules/chat/schemas/chat-message.schema.ts ***!
  \*********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatMessageSchema = exports.ChatMessage = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let ChatMessage = class ChatMessage {
};
exports.ChatMessage = ChatMessage;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Game', required: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], ChatMessage.prototype, "gameId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ChatMessage.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ChatMessage.prototype, "username", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ChatMessage.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], ChatMessage.prototype, "timestamp", void 0);
exports.ChatMessage = ChatMessage = __decorate([
    (0, mongoose_1.Schema)({ collection: 'chat_messages', timestamps: true })
], ChatMessage);
exports.ChatMessageSchema = mongoose_1.SchemaFactory.createForClass(ChatMessage);
exports.ChatMessageSchema.index({ gameId: 1, timestamp: 1 });


/***/ },

/***/ "./src/modules/decks/decks.module.ts"
/*!*******************************************!*\
  !*** ./src/modules/decks/decks.module.ts ***!
  \*******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DecksModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const deck_schema_1 = __webpack_require__(/*! ./schemas/deck.schema */ "./src/modules/decks/schemas/deck.schema.ts");
const card_schema_1 = __webpack_require__(/*! ../cards/schemas/card.schema */ "./src/modules/cards/schemas/card.schema.ts");
const decks_service_1 = __webpack_require__(/*! ./decks.service */ "./src/modules/decks/decks.service.ts");
let DecksModule = class DecksModule {
};
exports.DecksModule = DecksModule;
exports.DecksModule = DecksModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: deck_schema_1.Deck.name, schema: deck_schema_1.DeckSchema },
                { name: card_schema_1.Card.name, schema: card_schema_1.CardSchema },
            ]),
        ],
        providers: [decks_service_1.DecksService],
        exports: [decks_service_1.DecksService],
    })
], DecksModule);


/***/ },

/***/ "./src/modules/decks/decks.service.ts"
/*!********************************************!*\
  !*** ./src/modules/decks/decks.service.ts ***!
  \********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DecksService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const deck_schema_1 = __webpack_require__(/*! ./schemas/deck.schema */ "./src/modules/decks/schemas/deck.schema.ts");
const card_schema_1 = __webpack_require__(/*! ../cards/schemas/card.schema */ "./src/modules/cards/schemas/card.schema.ts");
const shared_1 = __webpack_require__(/*! @dm/shared */ "../shared/index.ts");
let DecksService = class DecksService {
    constructor(deckModel, cardModel) {
        this.deckModel = deckModel;
        this.cardModel = cardModel;
    }
    async createDeck(userId, name, cards) {
        const totalCopies = cards.reduce((sum, c) => sum + c.copies, 0);
        if (totalCopies > shared_1.GAME_CONSTANTS.DECK_MAX) {
            throw new common_1.BadRequestException(`Deck cannot exceed ${shared_1.GAME_CONSTANTS.DECK_MAX} cards`);
        }
        for (const entry of cards) {
            if (entry.copies > 4) {
                throw new common_1.BadRequestException(`Card ${entry.cardId} exceeds max 4 copies`);
            }
        }
        return this.deckModel.create({ userId, name, cards });
    }
    async getUserDecks(userId) {
        return this.deckModel.find({ userId }).sort({ createdAt: -1 }).exec();
    }
    async getDeck(deckId) {
        const deck = await this.deckModel.findById(deckId).exec();
        if (!deck)
            throw new common_1.NotFoundException('Deck not found');
        return deck;
    }
    async updateDeck(deckId, userId, name, cards) {
        const deck = await this.getDeck(deckId);
        if (deck.userId !== userId) {
            throw new common_1.BadRequestException('Not your deck');
        }
        const totalCopies = cards.reduce((sum, c) => sum + c.copies, 0);
        if (totalCopies > shared_1.GAME_CONSTANTS.DECK_MAX) {
            throw new common_1.BadRequestException(`Deck cannot exceed ${shared_1.GAME_CONSTANTS.DECK_MAX} cards`);
        }
        for (const entry of cards) {
            if (entry.copies > 4) {
                throw new common_1.BadRequestException(`Card ${entry.cardId} exceeds max 4 copies`);
            }
        }
        deck.name = name;
        deck.cards = cards;
        return deck.save();
    }
    async deleteDeck(deckId, userId) {
        const deck = await this.getDeck(deckId);
        if (deck.userId !== userId) {
            throw new common_1.BadRequestException('Not your deck');
        }
        await this.deckModel.findByIdAndDelete(deckId).exec();
    }
    async expandDeck(deckId) {
        const deck = await this.getDeck(deckId);
        const cardIds = deck.cards.map((c) => c.cardId);
        const cardDocs = await this.cardModel
            .find({ _id: { $in: cardIds } })
            .exec();
        const cardMap = new Map();
        for (const doc of cardDocs) {
            cardMap.set(doc._id.toString(), doc);
        }
        const result = [];
        for (const entry of deck.cards) {
            const card = cardMap.get(entry.cardId);
            if (!card)
                continue;
            for (let i = 0; i < entry.copies; i++) {
                result.push({
                    _id: card._id.toString(),
                    name: card.name,
                    civilizations: card.civilizations,
                    cost: card.cost,
                    power: card.power,
                    type: card.type,
                    subtypes: card.subtypes,
                    supertypes: card.supertypes,
                    text: card.text,
                    printings: card.printings,
                });
            }
        }
        return result;
    }
};
exports.DecksService = DecksService;
exports.DecksService = DecksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(deck_schema_1.Deck.name)),
    __param(1, (0, mongoose_1.InjectModel)(card_schema_1.Card.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], DecksService);


/***/ },

/***/ "./src/modules/decks/schemas/deck.schema.ts"
/*!**************************************************!*\
  !*** ./src/modules/decks/schemas/deck.schema.ts ***!
  \**************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeckSchema = exports.Deck = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
let Deck = class Deck {
};
exports.Deck = Deck;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Deck.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Deck.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ cardId: String, copies: Number }],
        default: [],
    }),
    __metadata("design:type", Array)
], Deck.prototype, "cards", void 0);
exports.Deck = Deck = __decorate([
    (0, mongoose_1.Schema)({ collection: 'decks', timestamps: true })
], Deck);
exports.DeckSchema = mongoose_1.SchemaFactory.createForClass(Deck);
exports.DeckSchema.index({ userId: 1 });


/***/ },

/***/ "./src/modules/games/games.controller.ts"
/*!***********************************************!*\
  !*** ./src/modules/games/games.controller.ts ***!
  \***********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GamesController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const games_service_1 = __webpack_require__(/*! ./games.service */ "./src/modules/games/games.service.ts");
let GamesController = class GamesController {
    constructor(gamesService) {
        this.gamesService = gamesService;
    }
    findByUser(userId) {
        return this.gamesService.findByUser(userId);
    }
    findOne(id) {
        return this.gamesService.findById(id);
    }
    findSteps(id) {
        return this.gamesService.findSteps(id);
    }
};
exports.GamesController = GamesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/steps'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "findSteps", null);
exports.GamesController = GamesController = __decorate([
    (0, common_1.Controller)('games'),
    __metadata("design:paramtypes", [typeof (_a = typeof games_service_1.GamesService !== "undefined" && games_service_1.GamesService) === "function" ? _a : Object])
], GamesController);


/***/ },

/***/ "./src/modules/games/games.module.ts"
/*!*******************************************!*\
  !*** ./src/modules/games/games.module.ts ***!
  \*******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GamesModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const game_schema_1 = __webpack_require__(/*! ./schemas/game.schema */ "./src/modules/games/schemas/game.schema.ts");
const game_step_schema_1 = __webpack_require__(/*! ./schemas/game-step.schema */ "./src/modules/games/schemas/game-step.schema.ts");
const games_service_1 = __webpack_require__(/*! ./games.service */ "./src/modules/games/games.service.ts");
const games_controller_1 = __webpack_require__(/*! ./games.controller */ "./src/modules/games/games.controller.ts");
let GamesModule = class GamesModule {
};
exports.GamesModule = GamesModule;
exports.GamesModule = GamesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: game_schema_1.Game.name, schema: game_schema_1.GameSchema },
                { name: game_step_schema_1.GameStep.name, schema: game_step_schema_1.GameStepSchema },
            ]),
        ],
        providers: [games_service_1.GamesService],
        controllers: [games_controller_1.GamesController],
        exports: [games_service_1.GamesService],
    })
], GamesModule);


/***/ },

/***/ "./src/modules/games/games.service.ts"
/*!********************************************!*\
  !*** ./src/modules/games/games.service.ts ***!
  \********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GamesService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const game_schema_1 = __webpack_require__(/*! ./schemas/game.schema */ "./src/modules/games/schemas/game.schema.ts");
const game_step_schema_1 = __webpack_require__(/*! ./schemas/game-step.schema */ "./src/modules/games/schemas/game-step.schema.ts");
let GamesService = class GamesService {
    constructor(gameModel, gameStepModel) {
        this.gameModel = gameModel;
        this.gameStepModel = gameStepModel;
    }
    async createGame(data) {
        return this.gameModel.create({ ...data, status: 'waiting' });
    }
    async startGame(gameId) {
        return this.gameModel
            .findByIdAndUpdate(gameId, { status: 'in-progress', startedAt: new Date() }, { new: true })
            .exec();
    }
    async endGame(gameId, winnerId) {
        return this.gameModel
            .findByIdAndUpdate(gameId, { status: 'completed', endedAt: new Date(), winnerId }, { new: true })
            .exec();
    }
    async updateStatus(gameId, status, extra = {}) {
        return this.gameModel
            .findByIdAndUpdate(gameId, { status, ...extra }, { new: true })
            .exec();
    }
    async recordStep(gameId, step) {
        const count = await this.gameStepModel.countDocuments({
            gameId: new mongoose_2.Types.ObjectId(gameId),
        });
        return this.gameStepModel.create({
            gameId: new mongoose_2.Types.ObjectId(gameId),
            ...step,
            sequenceNumber: count + 1,
            timestamp: new Date(),
        });
    }
    async findByUser(userId) {
        return this.gameModel
            .find({ $or: [{ inviterId: userId }, { challengerId: userId }] })
            .sort({ createdAt: -1 })
            .exec();
    }
    async findById(gameId) {
        return this.gameModel.findById(gameId).exec();
    }
    async findSteps(gameId) {
        return this.gameStepModel
            .find({ gameId: new mongoose_2.Types.ObjectId(gameId) })
            .sort({ sequenceNumber: 1 })
            .exec();
    }
};
exports.GamesService = GamesService;
exports.GamesService = GamesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(game_schema_1.Game.name)),
    __param(1, (0, mongoose_1.InjectModel)(game_step_schema_1.GameStep.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], GamesService);


/***/ },

/***/ "./src/modules/games/schemas/game-step.schema.ts"
/*!*******************************************************!*\
  !*** ./src/modules/games/schemas/game-step.schema.ts ***!
  \*******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameStepSchema = exports.GameStep = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let GameStep = class GameStep {
};
exports.GameStep = GameStep;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Game', required: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], GameStep.prototype, "gameId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GameStep.prototype, "playerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GameStep.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object)
], GameStep.prototype, "payload", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], GameStep.prototype, "sequenceNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], GameStep.prototype, "timestamp", void 0);
exports.GameStep = GameStep = __decorate([
    (0, mongoose_1.Schema)({ collection: 'game_steps', timestamps: true })
], GameStep);
exports.GameStepSchema = mongoose_1.SchemaFactory.createForClass(GameStep);
exports.GameStepSchema.index({ gameId: 1, sequenceNumber: 1 });


/***/ },

/***/ "./src/modules/games/schemas/game.schema.ts"
/*!**************************************************!*\
  !*** ./src/modules/games/schemas/game.schema.ts ***!
  \**************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameSchema = exports.Game = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
let Game = class Game {
};
exports.Game = Game;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Game.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Game.prototype, "inviterId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Game.prototype, "inviterName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Game.prototype, "challengerId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Game.prototype, "challengerName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'waiting' }),
    __metadata("design:type", String)
], Game.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'standard' }),
    __metadata("design:type", String)
], Game.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Game.prototype, "startedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Game.prototype, "endedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Game.prototype, "winnerId", void 0);
exports.Game = Game = __decorate([
    (0, mongoose_1.Schema)({ collection: 'games', timestamps: true })
], Game);
exports.GameSchema = mongoose_1.SchemaFactory.createForClass(Game);


/***/ },

/***/ "./src/modules/users/schemas/user.schema.ts"
/*!**************************************************!*\
  !*** ./src/modules/users/schemas/user.schema.ts ***!
  \**************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
let User = class User {
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "googleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "displayName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "avatarUrl", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ collection: 'users', timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);


/***/ },

/***/ "./src/modules/users/users.module.ts"
/*!*******************************************!*\
  !*** ./src/modules/users/users.module.ts ***!
  \*******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const user_schema_1 = __webpack_require__(/*! ./schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./src/modules/users/users.service.ts");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
        ],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);


/***/ },

/***/ "./src/modules/users/users.service.ts"
/*!********************************************!*\
  !*** ./src/modules/users/users.service.ts ***!
  \********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const user_schema_1 = __webpack_require__(/*! ./schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findOrCreate(profile) {
        const existing = await this.userModel
            .findOne({ googleId: profile.googleId })
            .exec();
        if (existing) {
            existing.displayName = profile.displayName;
            existing.avatarUrl = profile.avatarUrl;
            return existing.save();
        }
        return this.userModel.create(profile);
    }
    async findById(id) {
        return this.userModel.findById(id).exec();
    }
    async findByGoogleId(googleId) {
        return this.userModel.findOne({ googleId }).exec();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], UsersService);


/***/ },

/***/ "./src/services/coin-toss.service.ts"
/*!*******************************************!*\
  !*** ./src/services/coin-toss.service.ts ***!
  \*******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CoinTossService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let CoinTossService = class CoinTossService {
    constructor() {
        this.tosses = new Map();
    }
    initToss(gameId) {
        this.tosses.set(gameId, { gameId, picks: new Map() });
    }
    pick(gameId, userId, side) {
        let toss = this.tosses.get(gameId);
        if (!toss) {
            toss = { gameId, picks: new Map() };
            this.tosses.set(gameId, toss);
        }
        toss.picks.set(userId, side);
    }
    flip(gameId) {
        const toss = this.tosses.get(gameId);
        if (!toss || toss.picks.size < 1)
            return null;
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        let winnerId;
        for (const [userId, side] of toss.picks) {
            if (side === result) {
                winnerId = userId;
                break;
            }
        }
        if (!winnerId)
            winnerId = [...toss.picks.keys()][0];
        toss.result = result;
        toss.winnerId = winnerId;
        return { result, winnerId };
    }
    getToss(gameId) {
        return this.tosses.get(gameId);
    }
    clearToss(gameId) {
        this.tosses.delete(gameId);
    }
};
exports.CoinTossService = CoinTossService;
exports.CoinTossService = CoinTossService = __decorate([
    (0, common_1.Injectable)()
], CoinTossService);


/***/ },

/***/ "./src/services/duel-state.service.ts"
/*!********************************************!*\
  !*** ./src/services/duel-state.service.ts ***!
  \********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DuelStateService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const shared_1 = __webpack_require__(/*! @dm/shared */ "../shared/index.ts");
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
let DuelStateService = class DuelStateService {
    constructor() {
        this.states = new Map();
    }
    initGame(gameId, players) {
        const playerStates = {};
        players.forEach((p, idx) => {
            const shuffled = this.shuffle([...p.deck]);
            const shields = shuffled
                .splice(0, shared_1.GAME_CONSTANTS.SHIELDS)
                .map((card, i) => this.makeZoneCard(card, shared_1.ZoneType.SHIELDS, i, p.userId));
            const hand = shuffled
                .splice(0, shared_1.GAME_CONSTANTS.INITIAL_HAND)
                .map((card, i) => this.makeZoneCard(card, shared_1.ZoneType.HAND, i, p.userId));
            const deck = shuffled.map((card, i) => this.makeZoneCard(card, shared_1.ZoneType.DECK, i, p.userId));
            playerStates[p.userId] = {
                userId: p.userId,
                username: p.username,
                isFirstPlayer: idx === 0,
                zones: {
                    [shared_1.ZoneType.DECK]: deck,
                    [shared_1.ZoneType.HAND]: hand,
                    [shared_1.ZoneType.SHIELDS]: shields,
                    [shared_1.ZoneType.BATTLE_ZONE]: [],
                    [shared_1.ZoneType.GRAVEYARD]: [],
                    [shared_1.ZoneType.MANA]: [],
                },
            };
        });
        const state = {
            gameId,
            players: playerStates,
            currentPhase: shared_1.Phase.START,
            currentTurn: 0,
            activePlayerId: players[0].userId,
            turnNumber: 1,
        };
        this.states.set(gameId, state);
        return state;
    }
    getState(gameId) {
        return this.states.get(gameId);
    }
    clearState(gameId) {
        this.states.delete(gameId);
    }
    makeZoneCard(card, zone, position, ownerId) {
        return {
            id: (0, uuid_1.v4)(),
            card,
            zone,
            position,
            isTapped: false,
            isRevealed: false,
            ownerId,
        };
    }
    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
};
exports.DuelStateService = DuelStateService;
exports.DuelStateService = DuelStateService = __decorate([
    (0, common_1.Injectable)()
], DuelStateService);


/***/ },

/***/ "./src/services/game-room.service.ts"
/*!*******************************************!*\
  !*** ./src/services/game-room.service.ts ***!
  \*******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameRoomService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const shared_1 = __webpack_require__(/*! @dm/shared */ "../shared/index.ts");
let GameRoomService = class GameRoomService {
    constructor() {
        this.rooms = new Map();
    }
    onModuleInit() {
        this.cleanupInterval = setInterval(() => this.cleanupStaleRooms(), 30 * 60 * 1000);
    }
    onModuleDestroy() {
        clearInterval(this.cleanupInterval);
    }
    createRoom(data) {
        const room = {
            ...data,
            status: shared_1.GameStatus.WAITING,
            users: new Set([data.inviterId]),
            createdAt: new Date(),
        };
        this.rooms.set(data.id, room);
        return room;
    }
    getRoom(id) {
        return this.rooms.get(id);
    }
    getAllRooms() {
        return Array.from(this.rooms.values());
    }
    getWaitingRooms() {
        return this.getAllRooms().filter((r) => r.status === shared_1.GameStatus.WAITING);
    }
    updateRoom(id, updates) {
        const room = this.rooms.get(id);
        if (!room)
            return undefined;
        const updated = { ...room, ...updates };
        this.rooms.set(id, updated);
        return updated;
    }
    deleteRoom(id) {
        this.rooms.delete(id);
    }
    cleanupStaleRooms() {
        const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000);
        for (const [id, room] of this.rooms) {
            if (room.createdAt < cutoff &&
                room.status !== shared_1.GameStatus.IN_PROGRESS) {
                this.rooms.delete(id);
            }
        }
    }
};
exports.GameRoomService = GameRoomService;
exports.GameRoomService = GameRoomService = __decorate([
    (0, common_1.Injectable)()
], GameRoomService);


/***/ },

/***/ "@nestjs/common"
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
(module) {

module.exports = require("@nestjs/common");

/***/ },

/***/ "@nestjs/config"
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
(module) {

module.exports = require("@nestjs/config");

/***/ },

/***/ "@nestjs/core"
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
(module) {

module.exports = require("@nestjs/core");

/***/ },

/***/ "@nestjs/mongoose"
/*!***********************************!*\
  !*** external "@nestjs/mongoose" ***!
  \***********************************/
(module) {

module.exports = require("@nestjs/mongoose");

/***/ },

/***/ "@nestjs/passport"
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
(module) {

module.exports = require("@nestjs/passport");

/***/ },

/***/ "@nestjs/platform-socket.io"
/*!*********************************************!*\
  !*** external "@nestjs/platform-socket.io" ***!
  \*********************************************/
(module) {

module.exports = require("@nestjs/platform-socket.io");

/***/ },

/***/ "@nestjs/websockets"
/*!*************************************!*\
  !*** external "@nestjs/websockets" ***!
  \*************************************/
(module) {

module.exports = require("@nestjs/websockets");

/***/ },

/***/ "mongoose"
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
(module) {

module.exports = require("mongoose");

/***/ },

/***/ "passport-google-oauth20"
/*!******************************************!*\
  !*** external "passport-google-oauth20" ***!
  \******************************************/
(module) {

module.exports = require("passport-google-oauth20");

/***/ },

/***/ "reflect-metadata"
/*!***********************************!*\
  !*** external "reflect-metadata" ***!
  \***********************************/
(module) {

module.exports = require("reflect-metadata");

/***/ },

/***/ "socket.io"
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
(module) {

module.exports = require("socket.io");

/***/ },

/***/ "uuid"
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
(module) {

module.exports = require("uuid");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! reflect-metadata */ "reflect-metadata");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
const platform_socket_io_1 = __webpack_require__(/*! @nestjs/platform-socket.io */ "@nestjs/platform-socket.io");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
        credentials: true,
    });
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Duel Masters backend running on port ${port}`);
}
bootstrap();

})();

/******/ })()
;
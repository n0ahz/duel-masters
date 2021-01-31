export const DECK = {
  MAX_CARDS_PER_DECK: 40,
};

export const CARD = {
  CONTAINER: {
    WIDTH: 75,
    HEIGHT: 98,
  },
  SCALE: {
    GENERAL: 0.25,
    HAND: 0.35,
  },
  FACTOR: {
    HAND: 1.5,
  }
};

const SCORE_TEMPLATE = `Duel Stat
---------
Cards: {totalCards}
Deck: {deckZoneCards}
Hand: {handZoneCards}
Mana: {manaZoneCards}
Shield: {shieldZoneCards}
GraveYard: {graveyardZoneCards}
Hyper Spatial: {hyperSpatialZoneCards}
Battle: {battleZoneCards}`;

const CARD_INFO_TEMPLATE = `{name}
----------------------------
Race: {race}
Type: {type}
Civilization: {civilization} 


{cardText}


{cost}           {power}`;

export const GAME = {
  WORLD: {
    WIDTH: 2000,
    HEIGHT: 960,
  },
  // an image of this resolution is actually the background for the play area..
  STAGE: {
    WIDTH: 1280,
    HEIGHT: 960,
  },
  SCORE_TEMPLATE: SCORE_TEMPLATE,
  CARD_INFO_TEMPLATE: CARD_INFO_TEMPLATE,
};

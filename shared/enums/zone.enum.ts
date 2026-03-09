export enum ZoneType {
  DECK = 'deck',
  HAND = 'hand',
  SHIELDS = 'shields',
  BATTLE_ZONE = 'battle-zone',
  GRAVEYARD = 'graveyard',
  MANA = 'mana',
}

export enum ZoneVisibility {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
  OWNER_ONLY = 'owner-only',
}

export enum ZoneSpacing {
  SPREAD = 'spread',
  STACK = 'stack',
  FAN = 'fan',
}

export enum PlayerSide {
  BOTTOM = 'bottom',
  TOP = 'top',
}

export enum Position {
  TAPPED = 'tapped',
  UNTAPPED = 'untapped',
}

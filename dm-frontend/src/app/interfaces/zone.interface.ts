import { ZonesEnum } from '../enums/zones.enum';
import { PlayerSidesEnum } from '../enums/player-sides.enum';
import { ZoneTypesEnum } from '../enums/zone-types.enum';
import { ZoneVisibilitiesEnum } from '../enums/zone-visibilities.enum';
import { ZoneSpacingEnum } from '../enums/zone-spacing.enum';


export interface ZoneInterface {
  name: ZonesEnum;
  side?: PlayerSidesEnum;
  type?: ZoneTypesEnum;
  uid?: string;
  cardsCanTap?: boolean;
  visibility?: ZoneVisibilitiesEnum;
  cardStraight?: boolean;
  cardStacked?: boolean;
  zoneCardSpacing?: ZoneSpacingEnum;
  canSwitchCardSpacing?: boolean;
  canDrawCards?: boolean;
  canPutCards?: boolean;
}

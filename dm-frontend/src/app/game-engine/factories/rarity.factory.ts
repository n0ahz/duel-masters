import {RaritiesEnum} from "../../enums/rarities.enum";
import {RarityInterface} from "../../interfaces/rarity.interface";


export class RarityFactory {

  static getInstance(value: RaritiesEnum) : RarityInterface {
    switch (value) {
      case RaritiesEnum.COMMON:
        return common;
      case RaritiesEnum.UNCOMMON:
        return uncommon;
      case RaritiesEnum.RARE:
        return rare;
      case RaritiesEnum.VERY_RARE:
        return veryRare;
      case RaritiesEnum.SUPER_RARE:
        return superRare;
      case RaritiesEnum.VICTORY_RARE:
        return victoryRare;
      case RaritiesEnum.DOUBLE_VICTORY_RARE:
        return doubleVictoryRare;
      case RaritiesEnum.LEGEND:
        return legend;
      case RaritiesEnum.FORBIDDEN_LEGEND:
        return forbiddenLegend;
      case RaritiesEnum.MASTER:
        return master;
      case RaritiesEnum.SECRET_RARE:
        return secretRare;
      default:
        return null;
    }
  }

  static create(name: string, iconUrl?: string, serial?: number) : RarityInterface {
    return {
      name: name,
      iconUrl: iconUrl,
      serial: serial,
    };
  }
}


export const common: RarityInterface = RarityFactory.create(RaritiesEnum.COMMON);
export const uncommon = RarityFactory.create(RaritiesEnum.UNCOMMON);
export const rare = RarityFactory.create(RaritiesEnum.RARE);
export const veryRare = RarityFactory.create(RaritiesEnum.VERY_RARE);
export const superRare = RarityFactory.create(RaritiesEnum.SUPER_RARE);
export const victoryRare = RarityFactory.create(RaritiesEnum.VICTORY_RARE);
export const doubleVictoryRare = RarityFactory.create(RaritiesEnum.DOUBLE_VICTORY_RARE);
export const legend = RarityFactory.create(RaritiesEnum.LEGEND);
export const forbiddenLegend = RarityFactory.create(RaritiesEnum.FORBIDDEN_LEGEND);
export const master = RarityFactory.create(RaritiesEnum.MASTER);
export const secretRare = RarityFactory.create(RaritiesEnum.SECRET_RARE);

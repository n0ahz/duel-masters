import { RaritiesEnum } from '../../enums/rarities.enum';
import { RarityInterface } from '../../interfaces/rarity.interface';


export class RarityFactory {

  static getInstance(value: RaritiesEnum): RarityInterface {
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

  static create(name: string, iconUrl?: string, serial?: number): RarityInterface {
    return {
      name: name,
      iconUrl: iconUrl,
      serial: serial,
    };
  }
}

export const common: RarityInterface = RarityFactory.create('Common', '', 1);
export const uncommon = RarityFactory.create('Uncommon', '', 2);
export const rare = RarityFactory.create('Rare', '', 3);
export const veryRare = RarityFactory.create('Very Rare', '', 4);
export const superRare = RarityFactory.create('Super Rare', '', 5);
export const victoryRare = RarityFactory.create('Victory Rare', '', 6);
export const doubleVictoryRare = RarityFactory.create('Double Victory Rare', '', 7);
export const legend = RarityFactory.create('Legend', '', 8);
export const forbiddenLegend = RarityFactory.create('Forbidden Legend', '', 9);
export const master = RarityFactory.create('Master', '', 10);
export const secretRare = RarityFactory.create('Secret Rare', '', 11);

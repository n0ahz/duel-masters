import {SetsEnum} from "../../enums/sets.enum";
import {SetInterface} from "../../interfaces/set.interface";


export class SetFactory {

  static getInstance(value: SetsEnum) : SetInterface {
    switch (value) {
      case SetsEnum.DM_01:
        return dm01;
      default:
        return null;
    }
  }
}

export const dm01 : SetInterface = {
  id: "DM-01",
  name: "Base Set",
  fullName: "DM-01 Base Set",
  serial: 1,
  noOfCards: 120,
  year: 2004,
  imageUrls: [],
  puzzleImageUrls: [],
  description: 'It is the first set to contain 120 cards.\n' +
    '\n' +
    'In the TCG, there are 5 artworks for this booster pack. These artworks consist of\n' +
    '\n' +
    '    Aqua Sniper\n' +
    '    Deathliger, Lion of Chaos\n' +
    '    Mighty Shouter\n' +
    '    Rothus, the Traveler\n' +
    '    Urth, Purifying Elemental\n' +
    '\n' +
    'This set has an OCG equivalent, DM-01 Base Set (OCG). ',
};

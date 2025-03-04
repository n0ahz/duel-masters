import { CivilizationsEnum } from '../../enums/civilizations.enum';
import { CivilizationInterface } from '../../interfaces/civilization.interface';

export class CivilizationFactory {

  static getInstance(value: CivilizationsEnum): CivilizationInterface {
    switch (value) {
      case CivilizationsEnum.LIGHT:
        return light;
      case CivilizationsEnum.WATER:
        return water;
      case CivilizationsEnum.DARKNESS:
        return darkness;
      case CivilizationsEnum.FIRE:
        return fire;
      case CivilizationsEnum.NATURE:
        return nature;
      case CivilizationsEnum.RAINBOW:
        return rainbow;
      case CivilizationsEnum.ZERO:
        return zero;
      case CivilizationsEnum.JOKERS:
        return jokers;
      default:
        return null;
    }
  }

  static create(name: string, color?: string, iconUrl?: string, description?: string): CivilizationInterface {
    return {
      name: name,
      color: color,
      iconUrl: iconUrl,
      description: description,
    };
  }
}

export const light: CivilizationInterface = CivilizationFactory.create('Light', 'yellow', '', 'The Light Civilization is distinguished by a yellow color frame and is represented by 3 circles composed of several smaller circles. Abilities unique to Light involve adding cards to the shield zone, tapping others\' creatures while untapping its own, and getting spells from the mana zone, graveyard, or deck. Light is also known for having the best creatures with the Blocker ability, with the only restriction that they are usually unable to attack players.');
export const water: CivilizationInterface = CivilizationFactory.create('Water', 'aqua', '', 'The Water Civilization is distinguished by a blue color frame and is represented by a cylinder with electronic design. Abilities unique to water involve drawing cards, looking at cards in the shield zone, hand, and the opponent\'s deck, returning cards from the battle zone or mana zone to the hand, and unblockable creatures. Water is also known for having expensive creatures that have low power, usually in exchange for a useful effect. They are the second-best at blocking, having blockers that can attack both players and creatures, and blockers that cannot attack at all.');
export const darkness: CivilizationInterface = CivilizationFactory.create('Darkness', 'black', '', 'The Darkness Civilization is distinguished by a black color frame and is represented by a color-coded black and white mask with horns. Abilities unique to darkness involve discarding cards from the hand, destroying other creatures, "slayer", and recovering creatures from the graveyard. Most Darkness creatures also have side effects, like self-destruction when it battles or wins a battle, in exchange for its high power. They are the third-best at blocking, as they have few blockers and most have drawbacks with high power or low power in exchange for an ability like "slayer".');
export const fire: CivilizationInterface = CivilizationFactory.create('Fire', 'red', '', 'The Fire Civilization is distinguished by a red color frame and is represented by the icon of a gear. Abilities unique to Fire involve "speed attacker", power-limited destruction, mana and shield destruction, attacking untapped creatures, and the need to attack each turn if able.');
export const nature: CivilizationInterface = CivilizationFactory.create('Nature', 'green', '', 'The Nature Civilization is distinguished by a green color frame and is represented by 2 overlapping zigzags. Abilities unique to Nature involve increasing cards in one\'s mana zone, power-limited unblockability, and getting creatures from one\'s deck.');
export const rainbow: CivilizationInterface = CivilizationFactory.create('Rainbow', 'multi', '', 'Multicolored cards are distinguished by a rainbow-colored frame and are represented by the multiple civilizations used on it. Multicolored cards are cards with 2 or more different civilizations.\n' +
  '\n' +
  'Multicolored cards can be any type of card and similar to the single civilizations, also require at least one of both civilizations depicted on the card to be tapped. A multicolored Fire and Nature creature such as Gonta, the Warrior Savage requires at least 1 Fire Civilization mana and 1 Nature Civilization mana to be summoned.');
export const zero: CivilizationInterface = CivilizationFactory.create('Zero', 'white', '', 'The Zero Civilization is represented by a white crystal-like 6 point star on its mana number.');
export const jokers: CivilizationInterface = CivilizationFactory.create('Jokers', 'white', '', 'The Jokers Civilization is represented by a J shape on its mana number, as well as a Jo red and black mark on the upper right of the card.');

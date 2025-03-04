import { Card } from '../card';
import { RacesEnum } from '../../enums/races.enum';
import { CivilizationsEnum } from '../../enums/civilizations.enum';
import { RaritiesEnum } from '../../enums/rarities.enum';
import { SetsEnum } from '../../enums/sets.enum';
import { CardTypesEnum } from '../../enums/card-types.enum';


export const chilias = () => {
  return new Card(
    {
      name: 'Chilias, the Oracle',
      _type: 'CREATURE',
      _civilization: CivilizationsEnum.LIGHT,
      cost: 4,
      _rarity: RaritiesEnum.RARE,
      image: 'DM-01/1.jpg',
      cardText: 'When this creature would be destroyed, put it into your hand instead.',
      _set: SetsEnum.DM_01,
      cardSerial: 1,
      collectorNo: '1/110',
      uid: 'DM-01/1/110',
      race: RacesEnum.LIGHT_BRINGER,
      power: 2500,
    },
  );
};

export const diaNork = () => {
  return new Card(
    {
      name: 'Dia Nork, Moonlight Guardian',
      _type: 'CREATURE',
      _civilization: CivilizationsEnum.LIGHT,
      cost: 4,
      _rarity: RaritiesEnum.RARE,
      image: 'DM-01/2.jpg',
      cardText: 'Blocker (When an opponent\'s creature attacks, you may tap this creature to stop the attack. Then the two creatures battle.)\nThis creature can\'t attack players.',
      _set: SetsEnum.DM_01,
      cardSerial: 2,
      collectorNo: '2/110',
      uid: 'DM-01/2/110',
      race: RacesEnum.GUARDIAN,
      power: 5000,
    },
  );
};

export const emeraldGrass = () => {
  return new Card(
    {
      name: 'Emerald Grass',
      _type: 'CREATURE',
      _civilization: CivilizationsEnum.LIGHT,
      cost: 2,
      _rarity: RaritiesEnum.COMMON,
      image: 'DM-01/3.jpg',
      cardText: 'Blocker (When an opponent\'s creature attacks, you may tap this creature to stop the attack. Then the two creatures battle.)\nThis creature can\'t attack players.',
      _set: SetsEnum.DM_01,
      cardSerial: 3,
      collectorNo: '3/110',
      uid: 'DM-01/3/110',
      race: RacesEnum.STARLIGHT_TREE,
      power: 3000,
    },
  );
};

export const laUraGiga = () => {
  return new Card(
    {
      name: 'La Ura Giga, Sky Guardian',
      _type: 'CREATURE',
      _civilization: CivilizationsEnum.LIGHT,
      cost: 2,
      _rarity: RaritiesEnum.COMMON,
      image: 'DM-01/9.jpg',
      cardText: 'Blocker (When an opponent\'s creature attacks, you may tap this creature to stop the attack. Then the two creatures battle.)\nThis creature can\'t attack players.',
      _set: SetsEnum.DM_01,
      cardSerial: 9,
      collectorNo: '9/110',
      uid: 'DM-01/9/110',
      race: RacesEnum.GUARDIAN,
      power: 2000,
    },
  );
};

export const reusol = () => {
  return new Card(
    {
      name: 'Reusol, the Oracle',
      _type: 'CREATURE',
      _civilization: CivilizationsEnum.LIGHT,
      cost: 2,
      _rarity: RaritiesEnum.COMMON,
      image: 'DM-01/16.jpg',
      cardText: '',
      _set: SetsEnum.DM_01,
      cardSerial: 16,
      collectorNo: '16/110',
      uid: 'DM-01/16/110',
      race: RacesEnum.LIGHT_BRINGER,
      power: 2000,
    },
  );
};

export const senatineJadeTree = () => {
  return new Card(
    {
      name: 'Senatine Jade Tree',
      _type: 'CREATURE',
      _civilization: CivilizationsEnum.LIGHT,
      cost: 3,
      _rarity: RaritiesEnum.COMMON,
      image: 'DM-01/18.jpg',
      cardText: 'Blocker (When an opponent\'s creature attacks, you may tap this creature to stop the attack. Then the two creatures battle.)\nThis creature can\'t attack players.',
      _set: SetsEnum.DM_01,
      cardSerial: 18,
      collectorNo: '18/110',
      uid: 'DM-01/18/110',
      race: RacesEnum.STARLIGHT_TREE,
      power: 4000,
    },
  );
};

export const szubsKin = () => {
  return new Card(
    {
      name: 'Szubs Kin, Twilight Guardian',
      _type: 'CREATURE',
      _civilization: CivilizationsEnum.LIGHT,
      cost: 5,
      _rarity: RaritiesEnum.RARE,
      image: 'DM-01/21.jpg',
      cardText: 'Blocker (When an opponent\'s creature attacks, you may tap this creature to stop the attack. Then the two creatures battle.)\nThis creature can\'t attack players.',
      _set: SetsEnum.DM_01,
      cardSerial: 21,
      collectorNo: '21/110',
      uid: 'DM-01/21/110',
      race: RacesEnum.GUARDIAN,
      power: 6000,
    },
  );
};

export const bolshack = () => {
  return new Card(
    {
      name: 'Bolshack Dragon',
      _type: 'CREATURE',
      _civilization: CivilizationsEnum.FIRE,
      cost: 6,
      _rarity: RaritiesEnum.VERY_RARE,
      image: 'DM-01/69.jpg',
      cardText: 'While attacking, this creature gets +1000 power for each fire card in your graveyard.\nDouble breaker (This creature breaks 2 shields.)',
      _set: SetsEnum.DM_01,
      cardSerial: 69,
      collectorNo: '69/110',
      uid: 'DM-01/69/110',
      race: RacesEnum.ARMORED_DRAGON,
      power: 6000,
      powerExtensible: true,
    },
  );
};

export const brawlerZyler = () => {
  return new Card(
    {
      name: 'Brawler Zyler',
      _type: 'CREATURE',
      _civilization: CivilizationsEnum.FIRE,
      cost: 2,
      _rarity: RaritiesEnum.COMMON,
      image: 'DM-01/70.jpg',
      cardText: 'Power attacker +2000 (While attacking, this creature gets +2000 power.)',
      _set: SetsEnum.DM_01,
      cardSerial: 70,
      collectorNo: '70/110',
      uid: 'DM-01/70/110',
      race: RacesEnum.ARMORED_DRAGON,
      power: 1000,
      powerExtensible: true,
    },
  );
};

export const immortalBaronVorg = () => {
  return new Card(
    {
      name: 'Immortal Baron, Vorg',
      _type: 'CREATURE',
      _civilization: CivilizationsEnum.FIRE,
      cost: 2,
      _rarity: RaritiesEnum.COMMON,
      image: 'DM-01/80.jpg',
      cardText: '',
      _set: SetsEnum.DM_01,
      cardSerial: 80,
      collectorNo: '80/110',
      uid: 'DM-01/80/110',
      race: RacesEnum.HUMAN,
      power: 2000,
    },
  );
};

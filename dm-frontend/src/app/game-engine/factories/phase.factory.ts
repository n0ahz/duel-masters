import {PhasesEnum} from "../../enums/phases.enum";
import {PhaseInterface} from "../../interfaces/phase.interface";


export class PhaseFactory {

  static getInstance(value: PhasesEnum): PhaseInterface {
    switch (value) {
      case PhasesEnum.BEGIN:
        return begin;
      case PhasesEnum.UNTAP:
        return untap;
      case PhasesEnum.STANDBY:
        return standby;
      case PhasesEnum.DRAW:
        return draw;
      case PhasesEnum.CHARGE:
        return charge;
      case PhasesEnum.MAIN:
        return main;
      case PhasesEnum.BATTLE:
        return battle;
      case PhasesEnum.END:
        return end;
      default:
        return null;
    }
  }

  static create(name: string, serial?: number) : PhaseInterface {
    return {
      name: name,
      serial: serial,
    };
  }
}

export const begin : PhaseInterface = PhaseFactory.create(PhasesEnum.BEGIN, 1);
export const untap : PhaseInterface = PhaseFactory.create(PhasesEnum.UNTAP, 2);
export const standby : PhaseInterface = PhaseFactory.create(PhasesEnum.STANDBY, 3);
export const draw : PhaseInterface = PhaseFactory.create(PhasesEnum.DRAW, 4);
export const charge : PhaseInterface = PhaseFactory.create(PhasesEnum.CHARGE, 5);
export const main : PhaseInterface = PhaseFactory.create(PhasesEnum.MAIN, 6);
export const battle : PhaseInterface = PhaseFactory.create(PhasesEnum.BATTLE, 7);
export const end : PhaseInterface = PhaseFactory.create(PhasesEnum.END, 8);

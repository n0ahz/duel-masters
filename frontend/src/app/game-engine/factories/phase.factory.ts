import { Phase } from '@dm/shared';

export interface PhaseActions {
  canDraw: boolean;
  canChargeMana: boolean;
  canSummon: boolean;
  canCastSpell: boolean;
  canAttack: boolean;
  canBlock: boolean;
}

export class PhaseFactory {
  private static readonly PHASE_ACTIONS: Record<Phase, PhaseActions> = {
    [Phase.START]: {
      canDraw: false,
      canChargeMana: false,
      canSummon: false,
      canCastSpell: false,
      canAttack: false,
      canBlock: false,
    },
    [Phase.DRAW]: {
      canDraw: true,
      canChargeMana: false,
      canSummon: false,
      canCastSpell: false,
      canAttack: false,
      canBlock: false,
    },
    [Phase.CHARGE]: {
      canDraw: false,
      canChargeMana: true,
      canSummon: false,
      canCastSpell: false,
      canAttack: false,
      canBlock: false,
    },
    [Phase.MAIN]: {
      canDraw: false,
      canChargeMana: false,
      canSummon: true,
      canCastSpell: true,
      canAttack: false,
      canBlock: false,
    },
    [Phase.ATTACK]: {
      canDraw: false,
      canChargeMana: false,
      canSummon: false,
      canCastSpell: false,
      canAttack: true,
      canBlock: false,
    },
    [Phase.BLOCK]: {
      canDraw: false,
      canChargeMana: false,
      canSummon: false,
      canCastSpell: false,
      canAttack: false,
      canBlock: true,
    },
    [Phase.END]: {
      canDraw: false,
      canChargeMana: false,
      canSummon: false,
      canCastSpell: false,
      canAttack: false,
      canBlock: false,
    },
  };

  static getActions(phase: Phase): PhaseActions {
    return this.PHASE_ACTIONS[phase] ?? this.PHASE_ACTIONS[Phase.START];
  }

  static getLabel(phase: Phase): string {
    const labels: Record<Phase, string> = {
      [Phase.START]: 'Start Phase',
      [Phase.DRAW]: 'Draw Phase',
      [Phase.CHARGE]: 'Charge Phase',
      [Phase.MAIN]: 'Main Phase',
      [Phase.ATTACK]: 'Attack Phase',
      [Phase.BLOCK]: 'Block Phase',
      [Phase.END]: 'End Phase',
    };
    return labels[phase] ?? phase;
  }
}

import { Civilization } from '@dm/shared';

export class CivilizationFactory {
  private static readonly COLOR_MAP: Record<string, number> = {
    [Civilization.LIGHT]: 0xf5e642,
    [Civilization.WATER]: 0x4287f5,
    [Civilization.DARKNESS]: 0x9b42f5,
    [Civilization.FIRE]: 0xf54242,
    [Civilization.NATURE]: 0x42f560,
  };

  static getColor(civilization?: string): number {
    if (!civilization) return 0x888888;
    return this.COLOR_MAP[civilization] ?? 0x888888;
  }

  static getCssColor(civilization?: string): string {
    const hex = this.getColor(civilization).toString(16).padStart(6, '0');
    return `#${hex}`;
  }

  static getColors(civilizations: string[]): number[] {
    return civilizations.map((c) => this.getColor(c));
  }
}

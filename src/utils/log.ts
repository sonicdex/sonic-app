export abstract class AppLog {
  static readonly IDENTIFIER = '[Sonic]';

  static error(label: string, ...args: unknown[]): void {
    // eslint-disable-next-line no-console
    console.error(this.IDENTIFIER, this.createLabel(label), ...args);
  }

  static warn(label: string, ...args: unknown[]): void {
    // eslint-disable-next-line no-console
    console.warn(this.IDENTIFIER, this.createLabel(label), ...args);
  }

  private static createLabel(label: string): string {
    return `[${label}]`;
  }
}

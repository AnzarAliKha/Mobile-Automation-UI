import { test } from '@playwright/test';

export enum LogLevel {
  INFO = 'INFO',
  STEP = 'STEP',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

class Logger {
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString().substring(11, 19);
    return `[${timestamp}] [${level}] ${message}`;
  }

  public info(message: string): void {
    console.log(`\x1b[34m${this.formatMessage(LogLevel.INFO, message)}\x1b[0m`);
  }

  public success(message: string): void {
    console.log(`\x1b[32m${this.formatMessage(LogLevel.SUCCESS, message)}\x1b[0m`);
  }

  public warn(message: string): void {
    console.log(`\x1b[33m${this.formatMessage(LogLevel.WARN, message)}\x1b[0m`);
  }

  public error(message: string): void {
    console.error(`\x1b[31m${this.formatMessage(LogLevel.ERROR, message)}\x1b[0m`);
  }

  /**
   * Log an actionable step both in the console and Playwright's test report / trace viewer
   */
  public async step<T>(stepName: string, action: () => Promise<T>): Promise<T> {
    const start = Date.now();
    console.log(`\x1b[36m${this.formatMessage(LogLevel.STEP, `Starting: ${stepName}`)}\x1b[0m`);
    return await test.step(stepName, async () => {
      try {
        const result = await action();
        const duration = Date.now() - start;
        console.log(`\x1b[32m${this.formatMessage(LogLevel.SUCCESS, `Completed: ${stepName} (${duration}ms)`)}\x1b[0m`);
        return result;
      } catch (error) {
        console.error(`\x1b[31m${this.formatMessage(LogLevel.ERROR, `Failed: ${stepName}`)}\x1b[0m`);
        throw error;
      }
    });
  }
}

export const logger = new Logger();

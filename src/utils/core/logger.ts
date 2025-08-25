// src/utils/logger.ts - Logger TypeScript

export class Logger {
  private static isDev = process.env.NODE_ENV !== "production";
  static log(message: string, ...args: any[]): void {
    if (!Logger.isDev) {
      console.log(`📝 [LOG] ${message}`, ...args);
    }
  }

  static info(message: string, ...args: any[]): void {
    if (!Logger.isDev) {
      console.info(`🌱 [INFO] ${message}`, ...args);
    }
  }

  static warn(message: string, ...args: any[]): void {
    if (!Logger.isDev) {
      console.warn(`⚠️ [WARN] ${message}`, ...args);
    }
  }

  static error(message: string, ...args: any[]): void {
    console.error(`❌ [ERROR] ${message}`, ...args);
  }

  static debug(message: string, ...args: any[]): void {
    if (!Logger.isDev) {
      console.debug(`🔍 [DEBUG] ${message}`, ...args);
    }
  }
}

export const logger = Logger;

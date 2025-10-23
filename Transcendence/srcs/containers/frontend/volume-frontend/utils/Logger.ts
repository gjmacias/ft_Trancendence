type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'off';

export default class Logger {
  private static logLevel: LogLevel = 'debug';

  private constructor() {}

  public static setLevel(level: LogLevel) {
    Logger.logLevel = level;
  }

  public static disable() {
    this.logLevel = 'off';
  }

  private static shouldLog(level: LogLevel): boolean {
    if (Logger.logLevel === 'off') return false;
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(Logger.logLevel);
  }

  public static log(...data: any[]) {
    if (Logger.shouldLog('debug')) {
      console.log(...data);
    }
  }

  public static debug(...data: any[]) {
    if (Logger.shouldLog('debug')) {
      console.debug('[DEBUG]', ...data);
    }
  }

  public static info(...data: any[]) {
    if (Logger.shouldLog('info')) {
      console.info('[INFO]', ...data);
    }
  }

  public static warn(...data: any[]) {
    if (Logger.shouldLog('warn')) {
      console.warn('[WARN]', ...data);
    }
  }

  public static error(...data: any[]) {
    if (Logger.shouldLog('error')) {
      console.error('[ERROR]', ...data);
    }
  }
}

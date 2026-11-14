import { TskvLogger } from './tskv.logger';

type Method = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';
type ConsoleMethod = 'log' | 'error' | 'warn' | 'debug';

const cases: Array<{ method: Method; consoleMethod: ConsoleMethod }> = [
  { method: 'log', consoleMethod: 'log' },
  { method: 'error', consoleMethod: 'error' },
  { method: 'warn', consoleMethod: 'warn' },
  { method: 'debug', consoleMethod: 'debug' },
  { method: 'verbose', consoleMethod: 'debug' },
  { method: 'fatal', consoleMethod: 'error' },
];

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('разделяет поля табуляцией в формате key=value', () => {
      expect(logger.formatMessage('log', 'hello')).toBe(
        'level=log\tmessage=hello',
      );
    });

    it('добавляет optionalParams строкой, если они переданы', () => {
      expect(logger.formatMessage('log', 'hello', 'ctx')).toBe(
        'level=log\tmessage=hello\toptionalParams=["ctx"]',
      );
    });

    it('не добавляет optionalParams, если параметров нет', () => {
      expect(logger.formatMessage('log', 'hello')).not.toContain(
        'optionalParams',
      );
    });

    it('преобразует нестроковые значения в строки', () => {
      expect(logger.formatMessage('log', { a: 1 })).toBe(
        'level=log\tmessage={"a":1}',
      );
      expect(logger.formatMessage('log', 10)).toBe('level=log\tmessage=10');
    });

    it('использует текст ошибки для Error', () => {
      expect(logger.formatMessage('error', new Error('boom'))).toBe(
        'level=error\tmessage=boom',
      );
    });

    it('экранирует табуляцию, перенос строки и обратную косую в значениях', () => {
      const result = logger.formatMessage('log', 'a\tb\nc\\d');

      expect(result).toBe('level=log\tmessage=a\\tb\\nc\\\\d');
    });

    it('не оставляет в записи переносов строки', () => {
      expect(logger.formatMessage('log', 'line1\nline2\r\nline3')).not.toMatch(
        /[\n\r]/,
      );
    });
  });

  describe('методы вывода', () => {
    it.each(cases)(
      '$method пишет запись уровня $method в console.$consoleMethod',
      ({ method, consoleMethod }) => {
        const spy = jest
          .spyOn(console, consoleMethod)
          .mockImplementation(() => undefined);

        logger[method]('msg', 'ctx');

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(
          `level=${method}\tmessage=msg\toptionalParams=["ctx"]`,
        );
      },
    );
  });
});

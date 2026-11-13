import { JsonLogger } from './json.logger';

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

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('возвращает JSON с полями level, message и optionalParams', () => {
      const result = logger.formatMessage('log', 'hello');

      expect(JSON.parse(result)).toEqual({
        level: 'log',
        message: 'hello',
        optionalParams: [],
      });
    });

    it('кладёт дополнительные параметры в плоский массив optionalParams', () => {
      const result = logger.formatMessage('log', 'hello', 'ctx', 42);

      expect(JSON.parse(result).optionalParams).toEqual(['ctx', 42]);
    });

    it('сериализует объект в message без потери структуры', () => {
      const result = logger.formatMessage('log', { id: 1, name: 'film' });

      expect(JSON.parse(result).message).toEqual({ id: 1, name: 'film' });
    });

    it('сериализует Error вместе с name, message и stack', () => {
      const result = logger.formatMessage('error', new Error('boom'));
      const parsed: {
        message: { name: string; message: string; stack: string };
      } = JSON.parse(result);

      expect(parsed.message.name).toBe('Error');
      expect(parsed.message.message).toBe('boom');
      expect(typeof parsed.message.stack).toBe('string');
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
          JSON.stringify({
            level: method,
            message: 'msg',
            optionalParams: ['ctx'],
          }),
        );
      },
    );
  });
});

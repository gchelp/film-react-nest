import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { createLogger } from './logger.factory';
import { TskvLogger } from './tskv.logger';

describe('createLogger', () => {
  it('возвращает JsonLogger для типа json', () => {
    expect(createLogger('json')).toBeInstanceOf(JsonLogger);
  });

  it('возвращает TskvLogger для типа tskv', () => {
    expect(createLogger('tskv')).toBeInstanceOf(TskvLogger);
  });

  it('возвращает DevLogger для типа dev', () => {
    expect(createLogger('dev')).toBeInstanceOf(DevLogger);
  });

  it('возвращает DevLogger, если тип не задан или неизвестен', () => {
    expect(createLogger()).toBeInstanceOf(DevLogger);
    expect(createLogger('unknown')).toBeInstanceOf(DevLogger);
  });
});

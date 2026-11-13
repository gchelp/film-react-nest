import { ValueTransformer } from 'typeorm';

export const csvTransformer: ValueTransformer = {
  to: (value?: string[]) => (value ?? []).join(','),
  from: (value?: string) => (value ? value.split(',') : []),
};

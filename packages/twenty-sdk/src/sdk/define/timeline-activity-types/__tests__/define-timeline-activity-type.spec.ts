import { describe, expect, it } from 'vitest';

import { defineTimelineActivityType } from '@/sdk/define';

const baseValidConfig = {
  universalIdentifier: '11111111-1111-4111-8111-111111111111',
  name: 'deploymentCompleted',
  label: 'completed a deployment',
  action: 'updated' as const,
  objectUniversalIdentifier: '22222222-2222-4222-8222-222222222222',
  frontComponentUniversalIdentifier: '33333333-3333-4333-8333-333333333333',
};

describe('defineTimelineActivityType', () => {
  it('returns the generic native and custom rendering contract', () => {
    const result = defineTimelineActivityType(baseValidConfig);

    expect(result).toEqual({
      success: true,
      config: baseValidConfig,
      errors: [],
      warnings: [],
    });
  });

  it.each([
    [
      'universalIdentifier',
      'TimelineActivityType must have a universalIdentifier',
    ],
    ['name', 'TimelineActivityType must have a name'],
    ['label', 'TimelineActivityType must have a label'],
  ] as const)('reports a missing %s', (property, error) => {
    const result = defineTimelineActivityType({
      ...baseValidConfig,
      [property]: '',
    });

    expect(result.success).toBe(false);
    expect(result.errors).toContain(error);
  });

  it('reports an unsupported action', () => {
    const result = defineTimelineActivityType({
      ...baseValidConfig,
      // @ts-expect-error verifies runtime validation for JavaScript callers.
      action: 'deployed',
    });

    expect(result.success).toBe(false);
    expect(result.errors).toContain(
      'TimelineActivityType action deployed is not supported',
    );
  });
});

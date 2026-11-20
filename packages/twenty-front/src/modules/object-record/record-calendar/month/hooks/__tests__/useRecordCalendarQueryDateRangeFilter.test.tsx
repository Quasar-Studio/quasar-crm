import { renderHook } from '@testing-library/react';
import { Temporal } from 'temporal-polyfill';

import { useRecordCalendarQueryDateRangeFilter } from '@/object-record/record-calendar/month/hooks/useRecordCalendarQueryDateRangeFilter';
import { FieldMetadataType } from '~/generated-metadata/graphql';

let mockFieldType = FieldMetadataType.DATE;
let mockEndFieldId: string | undefined;
const mockComputeFilter = jest.fn((args: unknown) =>
  jest
    .requireActual('twenty-shared/utils')
    .computeRecordGqlOperationFilter(args),
);

jest.mock(
  '@/object-record/record-calendar/contexts/RecordCalendarContext',
  () => ({
    useRecordCalendarContextOrThrow: () => ({
      viewBarInstanceId: 'view',
      objectMetadataItem: {
        fields: [
          { id: 'start', name: 'startDate', type: mockFieldType },
          { id: 'end', name: 'endDate', type: mockFieldType },
        ],
      },
    }),
  }),
);
jest.mock(
  '@/object-record/record-calendar/month/hooks/useRecordCalendarMonthDaysRange',
  () => ({
    useRecordCalendarMonthDaysRange: () => ({
      firstDayOfFirstWeek: Temporal.PlainDate.from('2026-06-29'),
      lastDayOfLastWeek: Temporal.PlainDate.from('2026-08-09'),
    }),
  }),
);
jest.mock('@/ui/input/components/internal/date/hooks/useUserTimezone', () => ({
  useUserTimezone: () => ({ userTimezone: 'Europe/Paris' }),
}));
jest.mock(
  '@/object-record/record-filter/hooks/useFilterValueDependencies',
  () => ({
    useFilterValueDependencies: () => ({
      filterValueDependencies: { timeZone: 'Europe/Paris' },
    }),
  }),
);
jest.mock('@/ui/utilities/state/jotai/hooks/useAtomStateValue', () => ({
  useAtomStateValue: () => [
    { id: 'start', name: 'startDate', type: mockFieldType },
  ],
}));
jest.mock(
  '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue',
  () => ({
    useAtomComponentStateValue: jest.fn(),
  }),
);
jest.mock('twenty-shared/utils', () => ({
  ...jest.requireActual('twenty-shared/utils'),
  computeRecordGqlOperationFilter: (args: unknown) => mockComputeFilter(args),
  turnAnyFieldFilterIntoRecordGqlFilter: () => ({
    recordGqlOperationFilter: {},
  }),
}));

import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';

describe('useRecordCalendarQueryDateRangeFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFieldType = FieldMetadataType.DATE;
    mockEndFieldId = undefined;
  });

  const renderCalendarFilter = () => {
    jest
      .mocked(useAtomComponentStateValue)
      .mockReturnValueOnce([])
      .mockReturnValueOnce([])
      .mockReturnValueOnce('start')
      .mockReturnValueOnce(mockEndFieldId)
      .mockReturnValueOnce(undefined);
    return renderHook(() =>
      useRecordCalendarQueryDateRangeFilter(
        Temporal.PlainDate.from('2026-07-01'),
      ),
    );
  };

  it('filters a single DATE field using plain dates', () => {
    const { result } = renderCalendarFilter();
    expect(mockComputeFilter).toHaveBeenCalledWith(
      expect.objectContaining({
        recordFilters: expect.arrayContaining([
          expect.objectContaining({ type: 'DATE', value: '2026-06-29' }),
          expect.objectContaining({ type: 'DATE', value: '2026-08-10' }),
        ]),
      }),
    );
    expect(result.current.dateRangeFilter).toEqual({
      and: [
        { startDate: { gte: '2026-06-29' } },
        { startDate: { lt: '2026-08-10' } },
      ],
    });
  });

  it('filters a single DATE_TIME field using timezone-adjusted instants', () => {
    mockFieldType = FieldMetadataType.DATE_TIME;
    renderCalendarFilter();
    expect(mockComputeFilter).toHaveBeenCalledWith(
      expect.objectContaining({
        recordFilters: expect.arrayContaining([
          expect.objectContaining({
            type: 'DATE_TIME',
            value: '2026-06-28T22:00:00Z',
          }),
          expect.objectContaining({
            type: 'DATE_TIME',
            value: '2026-08-09T22:00:00Z',
          }),
        ]),
      }),
    );
  });

  it('keeps overlap filtering for compatible DATE ranges', () => {
    mockEndFieldId = 'end';
    const { result } = renderCalendarFilter();
    expect(mockComputeFilter).toHaveBeenCalledWith(
      expect.objectContaining({ recordFilters: [] }),
    );
    expect(result.current.dateRangeFilter).toEqual(
      expect.objectContaining({
        and: expect.arrayContaining([
          { startDate: { lt: '2026-08-10' } },
          {
            or: [
              { startDate: { gte: '2026-06-29' } },
              { endDate: { gte: '2026-06-29' } },
            ],
          },
        ]),
      }),
    );
  });
});

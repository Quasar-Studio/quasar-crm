import { renderHook } from '@testing-library/react';
import { type ReactNode } from 'react';

import { PreComputedChipGeneratorsContext } from '@/object-metadata/contexts/PreComputedChipGeneratorsContext';
import { useRecordChipData } from '@/object-record/hooks/useRecordChipData';

const record = { id: 'record-id', name: 'Example' };

it('uses default chip data when the object generator is unavailable', () => {
  const { result } = renderHook(
    () => useRecordChipData({ objectNameSingular: 'customObject', record }),
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <PreComputedChipGeneratorsContext.Provider
          value={{
            chipGeneratorPerObjectPerField: {},
            identifierChipGeneratorPerObject: {},
          }}
        >
          {children}
        </PreComputedChipGeneratorsContext.Provider>
      ),
    },
  );

  expect(result.current.recordChipData).toMatchObject({
    recordId: 'record-id',
    name: 'Example',
    objectNameSingular: 'customObject',
  });
});

it('uses the object-specific generator when present', () => {
  const chip = {
    avatarType: 'rounded' as const,
    avatarUrl: '',
    isLabelIdentifier: true,
    name: 'Generated label',
    objectNameSingular: 'customObject',
    recordId: 'record-id',
  };
  const generator = jest.fn(() => chip);
  const { result } = renderHook(
    () => useRecordChipData({ objectNameSingular: 'customObject', record }),
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <PreComputedChipGeneratorsContext.Provider
          value={{
            chipGeneratorPerObjectPerField: {},
            identifierChipGeneratorPerObject: { customObject: generator },
          }}
        >
          {children}
        </PreComputedChipGeneratorsContext.Provider>
      ),
    },
  );

  expect(generator).toHaveBeenCalledWith(record);
  expect(result.current.recordChipData).toBe(chip);
});

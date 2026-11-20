import { renderHook } from '@testing-library/react';
import { type ReactNode } from 'react';

import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';
import { useGetSecondaryRecordTableCellButton } from '@/object-record/record-table/record-table-cell/hooks/useGetSecondaryRecordTableCellButton';
import { FieldMetadataType } from '~/generated-metadata/graphql';

let mockFieldValue: object;

jest.mock('@/object-record/record-store/hooks/useRecordFieldValue', () => ({
  useRecordFieldValue: () => mockFieldValue,
}));
jest.mock('~/hooks/useCopyToClipboard', () => ({
  useCopyToClipboard: () => ({ copyToClipboard: jest.fn() }),
}));
jest.mock('@/activities/emails/hooks/useOpenEmailInAppOrFallback', () => ({
  useOpenEmailInAppOrFallback: () => ({ openEmail: jest.fn() }),
}));

describe('useGetSecondaryRecordTableCellButton', () => {
  it.each([
    [FieldMetadataType.LINKS, { primaryLinkUrl: '' }],
    [FieldMetadataType.LINKS, { primaryLinkUrl: '  ' }],
    [FieldMetadataType.EMAILS, { primaryEmail: '' }],
    [
      FieldMetadataType.PHONES,
      { primaryPhoneCallingCode: '+1', primaryPhoneNumber: '' },
    ],
  ])('hides actions for empty %s values', (type, value) => {
    mockFieldValue = value;
    const fieldContext = {
      recordId: 'record',
      fieldDefinition: { type, metadata: { fieldName: 'field' } },
    } as unknown as React.ContextType<typeof FieldContext>;
    const wrapper = ({ children }: { children: ReactNode }) => (
      <FieldContext.Provider value={fieldContext}>
        {children}
      </FieldContext.Provider>
    );
    const { result } = renderHook(
      () => useGetSecondaryRecordTableCellButton(),
      { wrapper },
    );

    expect(result.current).toEqual([]);
  });

  it.each([
    [FieldMetadataType.LINKS, { primaryLinkUrl: 'https://example.com' }],
    [FieldMetadataType.EMAILS, { primaryEmail: 'a@example.com' }],
    [
      FieldMetadataType.PHONES,
      { primaryPhoneCallingCode: '+1', primaryPhoneNumber: '5551234567' },
    ],
  ])('keeps actions for populated %s values', (type, value) => {
    mockFieldValue = value;
    const fieldContext = {
      recordId: 'record',
      fieldDefinition: { type, metadata: { fieldName: 'field' } },
    } as unknown as React.ContextType<typeof FieldContext>;
    const wrapper = ({ children }: { children: ReactNode }) => (
      <FieldContext.Provider value={fieldContext}>
        {children}
      </FieldContext.Provider>
    );
    const { result } = renderHook(
      () => useGetSecondaryRecordTableCellButton(),
      { wrapper },
    );

    expect(result.current).toHaveLength(1);
  });
});

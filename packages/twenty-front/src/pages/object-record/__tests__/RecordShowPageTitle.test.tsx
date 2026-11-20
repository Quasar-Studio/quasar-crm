import { render, screen } from '@testing-library/react';

import { RecordShowPageTitle } from '~/pages/object-record/RecordShowPageTitle';

let mockRecord: object;

jest.mock(
  '@/object-metadata/hooks/useLabelIdentifierFieldMetadataItem',
  () => ({
    useLabelIdentifierFieldMetadataItem: () => ({
      labelIdentifierFieldMetadataItem: undefined,
    }),
  }),
);
jest.mock('@/object-metadata/hooks/useObjectMetadataItem', () => ({
  useObjectMetadataItem: () => ({
    objectMetadataItem: { labelSingular: 'Company' },
  }),
}));
jest.mock('@/ui/utilities/state/jotai/hooks/useAtomFamilyStateValue', () => ({
  useAtomFamilyStateValue: () => mockRecord,
}));
jest.mock('@/ui/utilities/page-title/components/PageTitle', () => ({
  PageTitle: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe('RecordShowPageTitle', () => {
  it('falls back to the object label for a partial record without an id', () => {
    mockRecord = {};
    render(
      <RecordShowPageTitle objectNameSingular="company" objectRecordId="123" />,
    );

    expect(screen.getByText('Company')).toBeInTheDocument();
  });

  it('includes the record id when available', () => {
    mockRecord = { id: '123' };
    render(
      <RecordShowPageTitle objectNameSingular="company" objectRecordId="123" />,
    );

    expect(screen.getByText('123 - Company')).toBeInTheDocument();
  });
});

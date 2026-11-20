import { render, screen } from '@testing-library/react';

import { ViewBarPageTitle } from '@/views/components/ViewBarPageTitle';

jest.mock('@/object-record/record-index/contexts/RecordIndexContext', () => ({
  useRecordIndexContextOrThrow: () => ({
    objectMetadataItem: { labelPlural: 'Companies' },
  }),
}));
jest.mock('@/views/hooks/useGetCurrentViewOnly', () => ({
  useGetCurrentViewOnly: () => ({ currentView: { name: 'My view' } }),
}));
jest.mock('@/ui/utilities/page-title/components/PageTitle', () => ({
  PageTitle: ({ title }: { title: string }) => <span>{title}</span>,
}));

it('uses the record index metadata for the page title without a URL parameter', () => {
  render(<ViewBarPageTitle />);

  expect(screen.getByText('My view - Companies')).toBeInTheDocument();
});

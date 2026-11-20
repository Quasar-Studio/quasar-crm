import { fireEvent, render, screen } from '@testing-library/react';
import { ViewBarFilterDropdownAdvancedFilterButton } from './ViewBarFilterDropdownAdvancedFilterButton';
import { useGetCurrentViewOnly } from '@/views/hooks/useGetCurrentViewOnly';

jest.mock('@/views/hooks/useGetCurrentViewOnly');
jest.mock(
  '@/ui/utilities/state/jotai/hooks/useAtomComponentSelectorValue',
  () => ({ useAtomComponentSelectorValue: () => undefined }),
);
jest.mock(
  '@/object-record/advanced-filter/hooks/useChildRecordFiltersAndRecordFilterGroups',
  () => ({
    useChildRecordFiltersAndRecordFilterGroups: () => ({
      childRecordFiltersAndRecordFilterGroups: [],
    }),
  }),
);
jest.mock(
  '@/ui/utilities/state/jotai/hooks/useAtomComponentFamilyStateValue',
  () => ({ useAtomComponentFamilyStateValue: () => false }),
);
jest.mock(
  '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue',
  () => ({ useAtomComponentStateValue: () => [{ id: 'group' }] }),
);
jest.mock(
  '@/ui/utilities/state/jotai/hooks/useAtomFamilySelectorValue',
  () => ({ useAtomFamilySelectorValue: () => [] }),
);
jest.mock('@/object-metadata/hooks/useObjectMetadataItemById', () => ({
  useObjectMetadataItemById: () => ({ objectMetadataItem: { id: 'object' } }),
}));
jest.mock(
  '@/object-record/record-filter-group/hooks/useUpsertRecordFilterGroup',
  () => ({
    useUpsertRecordFilterGroup: () => ({ upsertRecordFilterGroup: jest.fn() }),
  }),
);
jest.mock('@/object-record/record-filter/hooks/useUpsertRecordFilter', () => ({
  useUpsertRecordFilter: () => ({ upsertRecordFilter: jest.fn() }),
}));
jest.mock(
  '@/object-record/advanced-filter/hooks/useSetRecordFilterUsedInAdvancedFilterDropdownRow',
  () => ({
    useSetRecordFilterUsedInAdvancedFilterDropdownRow: () => ({
      setRecordFilterUsedInAdvancedFilterDropdownRow: jest.fn(),
    }),
  }),
);
jest.mock(
  '@/object-record/record-filter/hooks/useCreateEmptyRecordFilterFromFieldMetadataItem',
  () => ({
    useCreateEmptyRecordFilterFromFieldMetadataItem: () => ({
      createEmptyRecordFilterFromFieldMetadataItem: jest.fn(),
    }),
  }),
);
const mockOpen = jest.fn();
const mockClose = jest.fn();
jest.mock('@/ui/layout/dropdown/hooks/useOpenDropdown', () => ({
  useOpenDropdown: () => ({ openDropdown: mockOpen }),
}));
jest.mock('@/ui/layout/dropdown/hooks/useCloseDropdown', () => ({
  useCloseDropdown: () => ({ closeDropdown: mockClose }),
}));
jest.mock('@lingui/react', () => ({
  useLingui: () => ({
    i18n: { _: (value: { message: string }) => value.message },
  }),
}));
jest.mock('@/ui/layout/selectable-list/components/SelectableListItem', () => ({
  SelectableListItem: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));
jest.mock('twenty-ui/navigation', () => ({
  MenuItem: ({ text, onClick }: { text: string; onClick: () => void }) => (
    <button onClick={onClick}>{text}</button>
  ),
}));

const mockUseGetCurrentViewOnly = jest.mocked(useGetCurrentViewOnly);

describe('ViewBarFilterDropdownAdvancedFilterButton', () => {
  it('handles a view appearing and disappearing without breaking the filter button', () => {
    mockUseGetCurrentViewOnly.mockReturnValue({
      currentView: undefined,
    } as never);
    const { container, rerender } = render(
      <ViewBarFilterDropdownAdvancedFilterButton />,
    );
    expect(container).toBeEmptyDOMElement();

    mockUseGetCurrentViewOnly.mockReturnValue({
      currentView: { id: 'view', objectMetadataId: 'object' },
    } as never);
    rerender(<ViewBarFilterDropdownAdvancedFilterButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Advanced filter' }));
    expect(mockClose).toHaveBeenCalledTimes(1);
    expect(mockOpen).toHaveBeenCalledTimes(1);

    mockUseGetCurrentViewOnly.mockReturnValue({
      currentView: undefined,
    } as never);
    rerender(<ViewBarFilterDropdownAdvancedFilterButton />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when object metadata is missing', () => {
    mockUseGetCurrentViewOnly.mockReturnValue({
      currentView: { id: 'view', objectMetadataId: '' },
    } as never);
    const { container } = render(<ViewBarFilterDropdownAdvancedFilterButton />);
    expect(container).toBeEmptyDOMElement();
  });
});

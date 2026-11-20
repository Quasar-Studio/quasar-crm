import { fireEvent, render, screen } from '@testing-library/react';
import { AdvancedFilterSidePanelCreateRootFilterButton } from './AdvancedFilterSidePanelCreateRootFilterButton';

const mockUpsertGroup = jest.fn((group: { id: string }) => group);
const mockUpsertFilter = jest.fn((filter: unknown) => filter);
const mockInitializeFilter = jest.fn((filter: unknown) => filter);
const mockSetInitialized = jest.fn();
const mockCreateFilter = jest.fn(() => ({
  newRecordFilter: { id: 'filter', fieldMetadataId: 'field' },
}));
let mockRootGroup: { id: string } | undefined;

jest.mock(
  '@/ui/utilities/state/jotai/hooks/useAtomComponentSelectorValue',
  () => ({ useAtomComponentSelectorValue: () => mockRootGroup }),
);
jest.mock(
  '@/ui/utilities/state/jotai/hooks/useAtomFamilySelectorValue',
  () => ({ useAtomFamilySelectorValue: () => [{ id: 'field' }] }),
);
jest.mock(
  '@/ui/utilities/state/jotai/hooks/useSetAtomComponentFamilyState',
  () => ({ useSetAtomComponentFamilyState: () => mockSetInitialized }),
);
jest.mock(
  '@/object-record/record-filter-group/hooks/useUpsertRecordFilterGroup',
  () => ({
    useUpsertRecordFilterGroup: () => ({
      upsertRecordFilterGroup: mockUpsertGroup,
    }),
  }),
);
jest.mock('@/object-record/record-filter/hooks/useUpsertRecordFilter', () => ({
  useUpsertRecordFilter: () => ({ upsertRecordFilter: mockUpsertFilter }),
}));
jest.mock(
  '@/object-record/record-filter/hooks/useCreateEmptyRecordFilterFromFieldMetadataItem',
  () => ({
    useCreateEmptyRecordFilterFromFieldMetadataItem: () => ({
      createEmptyRecordFilterFromFieldMetadataItem: mockCreateFilter,
    }),
  }),
);
jest.mock(
  '@/object-record/advanced-filter/hooks/useSetRecordFilterUsedInAdvancedFilterDropdownRow',
  () => ({
    useSetRecordFilterUsedInAdvancedFilterDropdownRow: () => ({
      setRecordFilterUsedInAdvancedFilterDropdownRow: mockInitializeFilter,
    }),
  }),
);
jest.mock('twenty-ui/input', () => ({
  Button: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick}>Add filter</button>
  ),
}));

describe('AdvancedFilterSidePanelCreateRootFilterButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRootGroup = undefined;
  });
  it('initializes the new filter dropdown state', () => {
    render(
      <AdvancedFilterSidePanelCreateRootFilterButton
        objectMetadataItem={{ id: 'object' } as never}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add filter' }));
    expect(mockUpsertGroup).toHaveBeenCalledTimes(1);
    expect(mockUpsertFilter).toHaveBeenCalledTimes(1);
    expect(mockInitializeFilter).toHaveBeenCalledWith(
      mockUpsertFilter.mock.calls[0][0],
    );
    expect(mockInitializeFilter.mock.calls[0][0]).toMatchObject({
      id: 'filter',
      fieldMetadataId: 'field',
      recordFilterGroupId: mockUpsertGroup.mock.calls[0][0].id,
    });
  });
  it('does not create or initialize another filter if a group exists', () => {
    mockRootGroup = { id: 'existing' };
    render(
      <AdvancedFilterSidePanelCreateRootFilterButton
        objectMetadataItem={{ id: 'object' } as never}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add filter' }));
    expect(mockUpsertFilter).not.toHaveBeenCalled();
    expect(mockInitializeFilter).not.toHaveBeenCalled();
  });
});
